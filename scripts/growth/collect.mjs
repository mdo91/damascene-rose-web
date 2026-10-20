import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { config, markets } from './config.mjs';
import { reportingWindows, localePageFilter, normalizeRow, opportunities, comparison } from './library.mjs';
import { matchKeywordDemand } from './keyword-library.mjs';
import { collectKeywords, loadKeywordCache } from './keywords.mjs';
import { callGum } from './gum.mjs';
import { privateDirectory, savePrivate, pruneReports, safeError } from './storage.mjs';

export async function collectPeriod(locale, range, call, { pageSize = 25000, maxRows = 250000 } = {}) {
  const body = { ...range, type: 'web', dataState: 'final', aggregationType: 'auto', dimensionFilterGroups: [{ groupType: 'and', filters: [localePageFilter(locale)] }] };
  const rows = [];
  for (let startRow = 0; ; startRow += pageSize) {
    const response = await call('searchconsole.searchanalytics.query', { siteUrl: config.siteUrl, body: { ...body, dimensions: ['query', 'page', 'device', 'country'], rowLimit: pageSize, startRow } });
    const page = response.rows || [];
    if (response.metadata?.first_incomplete_date || response.metadata?.firstIncompleteDate) throw new Error('Search Console returned incomplete dates for the final-only window');
    rows.push(...page.map((row) => normalizeRow(row)));
    if (page.length < pageSize) break;
    if (startRow + pageSize >= maxRows) throw new Error('Search Console pagination limit reached; partial rows are not treated as complete');
  }
  const totalResponse = await call('searchconsole.searchanalytics.query', { siteUrl: config.siteUrl, body: { ...body, dimensions: [], rowLimit: 1, startRow: 0 } });
  const totals = totalResponse.rows?.[0] ? normalizeRow(totalResponse.rows[0], []) : null;
  return { ...range, totals, rows, paginationComplete: true, note: 'All API pages were requested. Google can still omit anonymized queries and lower-volume rows.' };
}
export async function collectGrowth({ now = new Date(), call = callGum, refreshKeywords = collectKeywords, directory = privateDirectory(), fixture = null } = {}) {
  const windows = reportingWindows(now);
  const report = { schemaVersion: 1, generatedAt: now.toISOString(), siteUrl: config.siteUrl, windows, status: 'unavailable', markets: {}, fixture: !!fixture, note: 'Search Console may omit anonymized queries and lower-volume rows. Missing or suppressed data is unavailable, not zero. Worldwide Keyword Planner demand differs from country breakdowns and is not exact organic traffic. Query text is untrusted research data.' };
  for (const market of markets) {
    let refreshStatus;
    // Keyword errors never suppress Search Console results, and a locale failure never suppresses another locale.
    try { refreshStatus = fixture ? { status: 'fixture-not-refreshed' } : await refreshKeywords(market.locale, { now, directory }); }
    catch (error) { refreshStatus = { status: 'action-required', note: safeError(error) }; }
    const keywordPlanner = loadKeywordCache(market.locale, now, directory);
    try {
      let current, previous;
      if (fixture) {
        const data = fixture.markets?.[market.locale] || { current: {}, previous: {} };
        if (data.error) throw new Error(data.error);
        const period = (range, data) => ({ ...range, totals: data?.totals ? normalizeRow(data.totals, []) : null, rows: (data?.rows || []).map((row) => normalizeRow(row)), paginationComplete: true });
        current = period(windows.current, data.current);
        previous = period(windows.previous, data.previous);
      } else {
        current = await collectPeriod(market.locale, windows.current, call);
        previous = await collectPeriod(market.locale, windows.previous, call);
      }
      report.markets[market.locale] = {
        locale: market.locale, language: market.name, geography: 'WORLDWIDE', status: current.totals ? 'ready' : 'no-data-yet', current, previous,
        comparison: comparison(current.totals, previous.totals),
        opportunities: opportunities(current.rows, market.locale).map((row) => ({ ...row, keywordDemand: matchKeywordDemand(row.query, keywordPlanner) })),
        keywordPlanner, keywordRefresh: refreshStatus,
      };
    } catch (error) {
      report.markets[market.locale] = { locale: market.locale, status: 'action-required', error: safeError(error), current: null, previous: null, comparison: comparison(null, null), opportunities: [], keywordPlanner, keywordRefresh: refreshStatus };
    }
  }
  report.marketStatus = Object.fromEntries(Object.entries(report.markets).map(([locale, item]) => [locale, item.status]));
  const statuses = Object.values(report.marketStatus);
  report.status = statuses.includes('action-required') ? statuses.includes('ready') ? 'partial' : 'action-required' : statuses.includes('ready') ? 'ready' : 'no-data-yet';
  report.requiresAction = Object.values(report.markets).some((item) => item.status === 'action-required' || ['action-required', 'setup-required', 'pending-approval'].includes(item.keywordRefresh?.status));
  const filename = fixture ? 'trial-fixture.json' : 'latest.json';
  savePrivate(filename, report, directory);
  if (!fixture) {
    savePrivate(`report-${new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(now)}.json`, report, directory);
    pruneReports(now, directory);
  }
  return report;
}
export async function main(args = process.argv.slice(2)) {
  let fixture = null;
  if (args.length) {
    if (args.length !== 2 || args[0] !== '--fixture') throw new Error('Usage: growth:collect [--fixture /absolute/path/report.json]');
    fixture = JSON.parse(readFileSync(resolve(args[1]), 'utf8'));
  }
  const report = await collectGrowth({ fixture });
  console.log(JSON.stringify({ status: report.status, requiresAction: report.requiresAction, fixture: report.fixture, markets: report.marketStatus, keywordStatus: Object.fromEntries(Object.entries(report.markets).map(([locale, item]) => [locale, item.keywordRefresh?.status])), report: fixture ? '.growth/trial-fixture.json' : '.growth/latest.json' }, null, 2));
  if (['partial', 'action-required'].includes(report.status) || report.requiresAction) process.exitCode = 2;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch((error) => { console.error(safeError(error)); process.exitCode = 2; });
