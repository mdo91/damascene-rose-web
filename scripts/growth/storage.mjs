import { mkdirSync, readFileSync, writeFileSync, chmodSync, renameSync, existsSync, readdirSync, unlinkSync, lstatSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { root, config } from './config.mjs';

export const privateDirectory = () => resolve(process.env.DAMAS_GROWTH_DIR || resolve(root, '.growth'));
export function preparePrivateDirectory(directory = privateDirectory()) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  if (lstatSync(directory).isSymbolicLink()) throw new Error('Private output directory cannot be a symlink');
  chmodSync(directory, 0o700);
  return directory;
}
export function savePrivate(name, value, directory = privateDirectory()) {
  if (basename(name) !== name || !/^[a-zA-Z0-9_.-]+$/.test(name)) throw new Error('Invalid private filename');
  preparePrivateDirectory(directory);
  const target = resolve(directory, name), temp = `${target}.tmp-${process.pid}`;
  writeFileSync(temp, JSON.stringify(value, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
  chmodSync(temp, 0o600);
  renameSync(temp, target);
}
export function readPrivate(name, directory = privateDirectory()) {
  if (basename(name) !== name) throw new Error('Invalid private filename');
  const path = resolve(directory, name);
  if (!existsSync(path)) return null;
  if (!lstatSync(path).isFile()) throw new Error('Private state must be a regular file');
  return JSON.parse(readFileSync(path, 'utf8'));
}
export function pruneReports(now = new Date(), directory = privateDirectory()) {
  if (!existsSync(directory)) return;
  const cutoff = now.getTime() - config.privateReportRetentionDays * 86400000;
  for (const file of readdirSync(directory)) {
    const match = file.match(/^report-(\d{4}-\d{2}-\d{2})\.json$/);
    if (match && Number.isFinite(Date.parse(match[1])) && Date.parse(match[1] + 'T23:59:59Z') < cutoff) unlinkSync(resolve(directory, file));
  }
}
export function safeError(error) {
  return String(error?.message || error).replace(/GOCSPX-[A-Za-z0-9_-]+/g, '[redacted]').replace(/(?:ya29\.|1\/\/)[A-Za-z0-9_.-]+/g, '[redacted]').replace(/Bearer\s+\S+/gi, 'Bearer [redacted]').replace(/((?:access_token|refresh_token|client_secret|id_token)["']?\s*[:=]\s*["']?)[^\s,"'}]+/gi, '$1[redacted]').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[account]').replace(/\b\d{10,}\b/g, '[account-id]').slice(0, 1200);
}
