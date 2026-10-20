import { defineConfig } from 'vite';
import { copyFileSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
function htmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}
export default defineConfig({
  root: '.generated',
  base: process.env.BASE_PATH || '/',
  publicDir: '../public',
  plugins: [{ name: 'static-publication-files', closeBundle() {
    for (const name of ['sitemap.xml', 'robots.txt', '.nojekyll']) copyFileSync(resolve('.generated', name), resolve('dist', name));
    const base = process.env.BASE_PATH || '/';
    if (base !== '/') {
      const legacy = resolve('dist/squatvision-privacy-policy.html');
      writeFileSync(legacy, readFileSync(legacy, 'utf8').replaceAll('href="/', `href="${base}`));
    }
  } }],
  build: { outDir: '../dist', emptyOutDir: true, rollupOptions: { input: htmlFiles(resolve('.generated')) } },
});
