import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import QRCode from 'qrcode';
import { loadPosts } from '../src/posts';
import { article, guideIndex, home, legal, mediaKit, notFound } from '../src/render';
import { campaign, locales, localPath, origin, texts } from '../src/site';
import { privacyPolicyPage } from '../src/content/legal/privacy-policy';
import { termsOfUsePage } from '../src/content/legal/terms-of-use';
import { supportPage } from '../src/content/legal/support';
const root = resolve('.generated');
rmSync(root, { recursive: true, force: true });
mkdirSync(root, { recursive: true });
const qrAssets = resolve(root, 'assets');
mkdirSync(qrAssets, { recursive: true });
const posts = loadPosts();
const urls: { path: string; lastmod?: string; group: string }[] = [];
function save(path: string, html: string, group: string, lastmod?: string) {
  const file = resolve(root, '.' + path + (path.endsWith('/') ? 'index.html' : ''));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (!path.includes('404')) urls.push({ path, lastmod, group });
}
for (const locale of locales) {
  if (!texts[locale]) throw new Error(`Missing interface translation: ${locale}`);
  writeFileSync(resolve(qrAssets, `app-store-qr-${locale}.svg`), await QRCode.toString(campaign(locale, 'hero-qr'), {
    type: 'svg', errorCorrectionLevel: 'M', margin: 4, width: 144,
  }));
  const localized = posts.filter(post => post.locale === locale);
  if (!localized.length) throw new Error(`Missing published guides: ${locale}`);
  save(localPath(locale), home(locale, localized), 'home');
  save(localPath(locale, '/guides/'), guideIndex(locale, localized), 'guides');
  save(localPath(locale, '/media-kit/'), mediaKit(locale), 'media-kit');
  const translationFile = `src/content/legal-translations/${locale}.json`;
  let documents = { privacy: privacyPolicyPage, terms: termsOfUsePage, support: supportPage };
  if (locale !== 'en') {
    if (!existsSync(translationFile)) throw new Error(`Missing complete legal translation: ${locale}`);
    documents = JSON.parse(readFileSync(translationFile, 'utf8'));
    for (const key of ['privacy', 'terms', 'support'] as const) {
      if (!Array.isArray(documents[key]?.sections) || !documents[key].sections.length) throw new Error(`Invalid legal translation ${locale}/${key}`);
      const original = { privacy: privacyPolicyPage, terms: termsOfUsePage, support: supportPage }[key];
      if (documents[key].sections.length !== original.sections.length) throw new Error(`Legal section count changed: ${locale}/${key}`);
    }
  }
  for (const document of Object.values(documents)) save(localPath(locale, document.path), legal(locale, document), document.filename);
}
for (const post of posts) save(localPath(post.locale, `/guides/${post.slug}/`), article(post, posts), `post:${post.translationKey}`, post.updatedAt);
save('/404.html', notFound(), '404');
const xmlEscape = (v: string) => v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);
writeFileSync('.generated/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.map(u => `<url><loc>${origin}${u.path}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}${urls.filter(v => v.group === u.group).map(v => { const l = locales.find(l => l !== 'en' && v.path.startsWith(`/${l}/`)) || 'en'; return `<xhtml:link rel="alternate" hreflang="${texts[l].htmlLang}" href="${xmlEscape(origin + v.path)}"/>`; }).join('')}</url>`).join('')}</urlset>\n`);
writeFileSync('.generated/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
writeFileSync('.generated/.nojekyll', '');
writeFileSync('.generated/manifest.json', JSON.stringify({ urls, posts: posts.length, locales: locales.length }, null, 2));
console.log(`Generated ${urls.length + 1} static pages (${posts.length} guides, ${locales.length} languages).`);
