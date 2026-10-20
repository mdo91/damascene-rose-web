import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { config, root } from './config.mjs';

const allowed = new Map([
  ['searchconsole.searchanalytics.query', config.profiles.searchConsole],
  ['searchconsole.urlInspection.index.inspect', config.profiles.searchConsole],
  ['googleads.keywordPlanIdeas.generateKeywordIdeas', config.profiles.keywords],
  ['googleads.keywordPlanIdeas.generateKeywordHistoricalMetrics', config.profiles.keywords],
]);
export function validateGumOperation(operation, args) {
  if (!allowed.has(operation)) throw new Error('Operation outside the Damas read-only research allowlist');
  if (operation.startsWith('searchconsole.')) {
    const site = args.siteUrl || args.body?.siteUrl;
    if (site !== config.siteUrl) throw new Error('Search Console property is outside the Damas allowlist');
    const inspectionUrl = args.body?.inspectionUrl || args.inspectionUrl;
    if (operation === 'searchconsole.urlInspection.index.inspect' && (!inspectionUrl || new URL(inspectionUrl).origin !== new URL(config.siteUrl).origin)) throw new Error('URL inspection must stay on the Damas origin');
  } else {
    if (args.keywordPlanNetwork !== 'GOOGLE_SEARCH' || JSON.stringify(args.geoTargetConstants) !== '[]') throw new Error('Keyword research requires explicit worldwide Google Search targeting');
    if (!config.markets.some((market) => args.language === `languageConstants/${market.languageId}`)) throw new Error('Unsupported keyword language');
  }
  return allowed.get(operation);
}
let lastAdsRequest = 0;
export async function callGum(operation, args) {
  const profile = validateGumOperation(operation, args);
  const binary = process.env.GUM_BINARY || resolve(root, '.tools/gum-keywords');
  for (let attempt = 0; attempt < 3; attempt++) {
    if (operation.startsWith('googleads.')) {
      const wait = Math.max(0, 1100 - (Date.now() - lastAdsRequest));
      if (wait) await new Promise(resolve => setTimeout(resolve, wait));
      lastAdsRequest = Date.now();
    }
    try {
      const response = spawnSync(binary, ['--profile', profile, 'read', operation, '--args', JSON.stringify(args), '--format', 'raw', '--max-items', 'all'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 90000 });
      if (response.error || response.status !== 0) throw new Error(response.error?.message || response.stderr?.trim() || 'Gum research request failed');
      const parsed = JSON.parse(response.stdout), data = parsed.data || parsed;
      if (data.error || parsed.error) throw new Error(data.error?.message || parsed.error?.message || 'Google rejected the research request');
      return data;
    } catch (error) {
      if (attempt === 2 || !/RESOURCE_EXHAUSTED|\b429\b|UNAVAILABLE|\b50[0234]\b|temporarily unavailable/i.test(error.message)) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
}
