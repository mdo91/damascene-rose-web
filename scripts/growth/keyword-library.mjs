import { keywordTargetingFor, keywordPlan, config } from './config.mjs';

export function strictDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/.test(value)) throw new Error('Invalid ISO observation date');
  const time = Date.parse(value);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0,10) !== value.slice(0,10)) throw new Error('Invalid ISO observation date');
  return time;
}

export const keywordKey = (text) =>
  String(text)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
const day = 86400000;
const count = (value) => {
  if (value === undefined || value === null || value === '' || value === '--')
    return null;
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error('Invalid keyword count');
  return n;
};
export function normalizeKeywordResults(results = []) {
  const groups = new Map();
  for (const row of results) {
    if (typeof row.text !== 'string' || !row.text.trim())
      throw new Error('Keyword text missing');
    const metrics = row.keywordIdeaMetrics || row.keywordMetrics || {};
    const item = {
      text: row.text.trim(),
      closeVariants: [...new Set((row.closeVariants || []).map(String))],
      averageMonthlySearches: count(metrics.avgMonthlySearches),
      searchVolumeRange: row.searchVolumeRange || null,
      monthlySearchVolumes: (metrics.monthlySearchVolumes || []).map((m) => ({
        year: count(m.year),
        month: m.month,
        monthlySearches: count(m.monthlySearches),
      })),
      advertiserCompetition: ['LOW', 'MEDIUM', 'HIGH'].includes(
        metrics.competition,
      )
        ? metrics.competition
        : null,
      advertiserCompetitionIndex: count(metrics.competitionIndex),
    };
    if (item.advertiserCompetitionIndex > 100)
      throw new Error('Invalid advertiser competition index');
    const key = keywordKey(item.text);
    if (groups.has(key)) {
      const old = groups.get(key);
      if (old.averageMonthlySearches !== item.averageMonthlySearches)
        throw new Error('Conflicting duplicate keyword estimates');
      old.closeVariants = [
        ...new Set([...old.closeVariants, ...item.closeVariants]),
      ];
    } else groups.set(key, item);
  }
  return [...groups.values()];
}
export function makeKeywordCache({
  results,
  source,
  targeting = keywordTargetingFor('en'),
  generatedAt = new Date().toISOString(),
}) {
  const cache = {
    schemaVersion: 1,
    seedFingerprint: source.kind === 'google-ads-api' ? keywordPlan(targeting.language).seedFingerprint : null,
    generatedAt,
    observedAt: source.exportedAt || generatedAt,
    targeting: { ...targeting },
    source: cleanSource(source),
    keywords: normalizeKeywordResults(results),
    note: 'Demand estimates are not exact traffic counts. CSV exports may provide representative point values for ranges shown in the UI. Close variants can share estimates and low-volume terms may be omitted. Advertising competition is not organic ranking difficulty.',
  };
  const check = assessKeywordCache(cache, new Date(generatedAt));
  if (check.status === 'invalid') throw new Error(check.note);
  return cache;
}
export function assessKeywordCache(cache, now = new Date()) {
  if (!cache)
    return {
      status: 'unavailable',
      note: 'No approved API result or explicitly targeted Keyword Planner CSV has been imported.',
    };
  try {
    if (cache.schemaVersion !== 1 || !Array.isArray(cache.keywords))
      throw new Error('Unsupported keyword cache');
    const t = cache.targeting;
    const expected = t && keywordTargetingFor(t.language);
    if (
      !t ||
      !expected ||
      t.geography !== 'WORLDWIDE' ||
      t.language !== expected.language ||
      t.network !== 'GOOGLE_SEARCH' ||
      t.languageConstant !== expected.languageConstant ||
      JSON.stringify(t.geoTargetConstants) !== JSON.stringify(expected.geoTargetConstants)
    )
      throw new Error('Keyword targeting must match a supported language, worldwide geography and Google Search');
    if (!['google-ads-api', 'keyword-planner-csv'].includes(cache.source?.kind))
      throw new Error('Keyword source missing');
    const age = now.getTime() - strictDate(cache.observedAt);
    const generated = strictDate(cache.generatedAt);
    if (generated > now.getTime() + 300000 || generated < strictDate(cache.observedAt)) throw new Error('Invalid keyword generation date');
    if (
      !Number.isFinite(age) ||
      age < -300000 ||
      !Number.isFinite(Date.parse(cache.generatedAt))
    )
      throw new Error('Invalid keyword observation date');
    for (const item of cache.keywords) {
      if (
        typeof item.text !== 'string' ||
        !item.text.trim() ||
        !Array.isArray(item.closeVariants)
      )
        throw new Error('Invalid keyword entry');
      count(item.averageMonthlySearches);
      const competitionIndex = count(item.advertiserCompetitionIndex);
      if (competitionIndex > 100) throw new Error('Invalid advertiser competition index');
      for (const month of item.monthlySearchVolumes || []) count(month.monthlySearches);
      if (
        item.searchVolumeRange &&
        (count(item.searchVolumeRange.min) === null ||
          count(item.searchVolumeRange.max) === null ||
          item.searchVolumeRange.max < item.searchVolumeRange.min)
      )
        throw new Error('Invalid search volume range');
    }
    return {
      ...cache,
      source: cleanSource(cache.source),
      status: age >= config.keywordCacheDays * day ? 'stale' : 'ready',
      note:
        age >= config.keywordCacheDays * day
          ? 'Keyword estimates are at least 30 days old; refresh before prioritizing from demand.'
          : cache.note,
    };
  } catch (error) {
    return { status: 'invalid', note: error.message };
  }
}
function cleanSource(source) {
  return Object.fromEntries(['kind', 'exportedAt', 'targetingEvidence', 'operations', 'profile'].filter((key) => source[key] !== undefined).map((key) => [key, source[key]]));
}
export function matchKeywordDemand(query, cache) {
  if (cache?.status !== 'ready') return null;
  const key = keywordKey(query);
  const row = cache.keywords.find((k) =>
    [k.text, ...k.closeVariants].some((v) => keywordKey(v) === key),
  );
  return row
    ? {
        ...row,
        estimatesMayIncludeCloseVariants: true,
        observedAt: cache.observedAt,
        source: cache.source.kind,
      }
    : null;
}
function parseDelimited(input, delimiter) {
  const rows = [];
  let row = [],
    value = '',
    quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (!quoted && (c === delimiter || c === '\n' || c === '\r')) {
      row.push(value);
      value = '';
      if (c !== delimiter) {
        if (c === '\r' && input[i + 1] === '\n') i++;
        rows.push(row);
        row = [];
      }
    } else value += c;
  }
  if (quoted) throw new Error('Unclosed quote in Keyword Planner CSV');
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}
function csvVolume(value) {
  const input = String(value || '').trim();
  if (!input || /^(--|—|unknown|n\/a)$/i.test(input))
    return { avgMonthlySearches: null };
  const n = (s) => {
    const m = s.replace(/[,\s\u00a0]/g, '').match(/^(\d+(?:\.\d+)?)([kKmM])?$/);
    if (!m) throw new Error('Unrecognized CSV search estimate: ' + input);
    return count(
      Number(m[1]) *
        (m[2]?.toLowerCase() === 'k'
          ? 1000
          : m[2]?.toLowerCase() === 'm'
            ? 1000000
            : 1),
    );
  };
  const range = input.split(/\s*[-–—]\s*/);
  if (range.length === 2)
    return {
      avgMonthlySearches: null,
      range: { min: n(range[0]), max: n(range[1]) },
    };
  if (/^<\s*\d+$/.test(input))
    return {
      avgMonthlySearches: null,
      range: { min: 0, max: n(input.replace('<', '')) - 1 },
    };
  return { avgMonthlySearches: n(input) };
}
export function parseKeywordCsv(bytes) {
  const text = (
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? bytes.subarray(2).toString('utf16le')
      : bytes.toString('utf8')
  ).replace(/^\uFEFF/, '');
  const header = text
    .split(/\r?\n/)
    .find((line) => /(^|[\t,])"?Keyword"?([\t,]|$)/i.test(line));
  if (!header)
    throw new Error(
      'Expected an English Keyword Planner export with a Keyword header',
    );
  const delimiter = header.includes('\t') ? '\t' : ',';
  const rows = parseDelimited(text, delimiter);
  const index = rows.findIndex((r) =>
    r.some((v) => v.trim().toLowerCase() === 'keyword'),
  );
  const columns = rows[index].map((c) => c.trim().toLowerCase());
  const keyword = columns.indexOf('keyword'),
    volume = columns.findIndex((c) => /^avg\.? monthly searches$/.test(c));
  if (volume < 0) throw new Error('CSV is missing Avg. monthly searches');
  const competition = columns.indexOf('competition'),
    competitionIndex = columns.findIndex((c) =>
      /^competition \(indexed value\)$/.test(c),
    );
  return rows
    .slice(index + 1)
    .filter((r) => r[keyword]?.trim())
    .map((r) => {
      const v = csvVolume(r[volume]);
      return {
        text: r[keyword].trim(),
        searchVolumeRange: v.range || null,
        keywordIdeaMetrics: {
          avgMonthlySearches: v.avgMonthlySearches,
          competition: r[competition]?.trim().toUpperCase(),
          competitionIndex:
            competitionIndex >= 0 &&
            !/^(--|—)?$/.test(r[competitionIndex]?.trim() || '')
              ? r[competitionIndex]?.trim()
              : null,
        },
      };
    });
}
