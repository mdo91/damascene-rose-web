import { config, marketFor, markets } from './config.mjs';

/** GSC reports use Pacific calendar dates; final-only data has a three-day buffer. */
export function reportingWindows(now = new Date()) {
  if (!Number.isFinite(now.getTime())) throw new Error('Invalid reporting date');
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = (type) => parts.find((part) => part.type === type).value;
  const today = new Date(`${value('year')}-${value('month')}-${value('day')}T12:00:00Z`);
  const day = (offset) => { const date = new Date(today); date.setUTCDate(date.getUTCDate() + offset); return date.toISOString().slice(0, 10); };
  return { current: { startDate: day(-30), endDate: day(-3) }, previous: { startDate: day(-58), endDate: day(-31) } };
}
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function localePageFilter(locale) {
  marketFor(locale);
  const origin = escapeRegex(config.siteUrl);
  if (locale === 'en') return { dimension: 'page', operator: 'excludingRegex', expression: `^${origin}(?:${markets.filter((market) => market.locale !== 'en').map((market) => escapeRegex(market.locale)).join('|')})(?:/|$)` };
  return { dimension: 'page', operator: 'includingRegex', expression: `^${origin}${escapeRegex(locale)}/` };
}
export function matchesLocalePage(page, locale) {
  try {
    const url = new URL(page);
    if (url.origin !== new URL(config.siteUrl).origin) return false;
    const first = url.pathname.split('/')[1];
    return locale === 'en' ? !markets.some((market) => market.locale !== 'en' && market.locale === first) : first === locale;
  } catch { return false; }
}
function metric(value, { ratio = false } = {}) {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || ratio && number > 1) throw new Error('Invalid Search Console metric');
  return number;
}
export function normalizeRow(row, dimensions = ['query', 'page', 'device', 'country']) {
  return { ...Object.fromEntries(dimensions.map((dimension, index) => [dimension, row.keys?.[index] || ''])), clicks: metric(row.clicks), impressions: metric(row.impressions), ctr: metric(row.ctr, { ratio: true }), averagePosition: metric(row.position) };
}
export function opportunities(rows, locale) {
  const groups = new Map();
  for (const row of rows) {
    if (!row.query || !matchesLocalePage(row.page, locale) || row.clicks === null || row.impressions === null || row.averagePosition === null) continue;
    const key = JSON.stringify([row.query, row.page]);
    const group = groups.get(key) || { query: row.query, page: row.page, clicks: 0, impressions: 0, weightedPosition: 0 };
    group.clicks += row.clicks; group.impressions += row.impressions; group.weightedPosition += row.averagePosition * row.impressions;
    groups.set(key, group);
  }
  return [...groups.values()].map(({ weightedPosition, ...row }) => ({ ...row, ctr: row.impressions ? row.clicks / row.impressions : null, averagePosition: row.impressions ? weightedPosition / row.impressions : null }))
    .filter((row) => row.impressions >= 20 && row.averagePosition >= 4 && row.averagePosition <= 50 && row.ctr !== null && row.ctr < 0.05)
    .map((row) => ({ ...row, priority: row.impressions * (1 - row.ctr) / Math.sqrt(row.averagePosition), decisionNote: 'Verify product relevance, language and existing intent coverage. Countries/devices are aggregated for prioritization; original rows preserve breakdowns. Average position is an aggregate, not an exact keyword rank.' }))
    .sort((a, b) => b.priority - a.priority);
}
export function comparison(current, previous) {
  if (!current || !previous) return { status: 'unavailable', clicksChange: null, impressionsChange: null, ctrChange: null, averagePositionChange: null };
  const difference = (key) => current[key] === null || previous[key] === null ? null : current[key] - previous[key];
  return { status: 'ready', clicksChange: difference('clicks'), impressionsChange: difference('impressions'), ctrChange: difference('ctr'), averagePositionChange: difference('averagePosition') };
}
