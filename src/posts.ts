import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { parse } from 'yaml';
import { marked } from 'marked';
import { locales, type Locale } from './site';
export type Post = {
  title: string; description: string; slug: string; locale: Locale; publishedAt: string; updatedAt: string;
  status: 'published' | 'draft'; primaryQuery: string; topics: string[]; sources: { title: string; url: string }[];
  related: string[]; translationKey: string; body: string; file: string;
};
export function parsePost(source: string, file: string): Post {
  const parts = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!parts) throw new Error(`${file}: missing YAML metadata`);
  const metadata = parse(parts[1]);
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) throw new Error(`${file}: invalid metadata`);
  for (const key of ['title', 'description', 'slug', 'locale', 'publishedAt', 'updatedAt', 'primaryQuery', 'translationKey']) {
    if (typeof metadata[key] !== 'string' || !metadata[key].trim()) throw new Error(`${file}: invalid ${key}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) throw new Error(`${file}: invalid slug`);
  if (!locales.includes(metadata.locale)) throw new Error(`${file}: unsupported locale`);
  if (!['published', 'draft'].includes(metadata.status)) throw new Error(`${file}: invalid status`);
  for (const key of ['publishedAt', 'updatedAt']) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata[key]) || new Date(metadata[key]).toISOString().slice(0, 10) !== metadata[key]) throw new Error(`${file}: invalid ${key}`);
  }
  if (metadata.updatedAt < metadata.publishedAt) throw new Error(`${file}: updated before publication`);
  const today = new Date().toISOString().slice(0, 10);
  if (metadata.publishedAt > today || metadata.updatedAt > today) throw new Error(`${file}: future article date`);
  for (const key of ['topics', 'related']) {
    if (!Array.isArray(metadata[key]) || !metadata[key].every((v: unknown) => typeof v === 'string' && v.trim())) throw new Error(`${file}: invalid ${key}`);
  }
  if (!Array.isArray(metadata.sources) || !metadata.sources.length || !metadata.sources.every((s: any) => s && typeof s.title === 'string' && /^https:\/\//.test(s.url))) throw new Error(`${file}: sources required`);
  if (metadata.related.includes(metadata.slug) || new Set(metadata.related).size !== metadata.related.length) throw new Error(`${file}: invalid related guides`);
  if (/<\/?(?:script|style|iframe|object|embed|form)\b/i.test(parts[2])) throw new Error(`${file}: unsafe HTML`);
  marked.walkTokens(marked.lexer(parts[2]), token => {
    if (token.type === 'html') throw new Error(`${file}: raw HTML is not allowed in guides`);
    if ((token.type === 'link' || token.type === 'image') && !/^(https:\/\/|\/(?!\/)|#)/i.test(token.href)) throw new Error(`${file}: unsupported link protocol`);
    if (token.type === 'heading' && token.depth === 1) throw new Error(`${file}: use metadata for the page heading`);
  });
  return { ...metadata, body: parts[2], file };
}
function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(item => item.isDirectory() ? files(resolve(directory, item.name)) : item.name.endsWith('.md') ? [resolve(directory, item.name)] : []);
}
export function loadPosts(): Post[] {
  const all = files(resolve('content/guides')).map(file => {
    const post = parsePost(readFileSync(file, 'utf8'), relative(process.cwd(), file));
    if (relative(resolve('content/guides'), file) !== `${post.locale}/${post.slug}.md`) throw new Error(`${file}: path does not match metadata`);
    return post;
  });
  const published = all.filter(p => p.status === 'published');
  for (const post of published) {
    if (published.filter(p => p.locale === post.locale && p.translationKey === post.translationKey).length !== 1) throw new Error(`${post.file}: duplicate translation group`);
    if (post.related.some(slug => !published.some(p => p.locale === post.locale && p.slug === slug))) throw new Error(`${post.file}: related guide is missing or a draft`);
  }
  return published;
}
