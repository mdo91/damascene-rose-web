# Damas website

Static, multilingual website for **Damas - Video Link Transcriber**, published at [damascenerose.com](https://damascenerose.com). It contains the app landing page, a downloadable media kit, guides, and the existing legal/support URLs. The site has no analytics or transcription backend. Video processing takes place in the iPhone app.

## Develop and verify

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
BASE_PATH=/damascene-rose-web/ npm run build
npm run preview
```

Vite publishes generated HTML from `.generated/`; source pages are rendered by `scripts/generate.ts` and `src/render.ts`. Generated HTML, build output and private research are ignored. Important content, navigation, native language switching and guides work without JavaScript. Display WebP images are optimized; original PNG/MP4 downloads remain in `public/assets/`.

English uses `/`; the other languages use `/fr/`, `/de/`, `/ja/`, `/ko/`, `/ms/`, `/pt/`, `/ru/`, `/zh-hans/`, `/es/`, and `/tr/`. Each locale includes a landing page, guide index, media kit, three initial guides, privacy policy, terms, and support. Equivalent published pages receive reciprocal `hreflang`. The canonical origin remains production for both supported deployment bases.

## Content

Guides live in `content/guides/<locale>/<slug>.md`. Frontmatter requires `title`, `description`, `slug`, `locale`, `publishedAt`, `updatedAt`, `status`, `primaryQuery`, `topics`, `sources`, `related` and `translationKey`. Dates use `YYYY-MM-DD`. Drafts never appear in HTML or the sitemap. Do not advance dates unless the content meaningfully changes. Equivalent translations share a `translationKey`, but only published equivalents appear as alternates. Current product facts are documented in the growth skill and must be rechecked against Apple before changing claims.

The 33 launch guides were refined against live Keyword Planner data for all 11 languages. See [research methodology](docs/keyword-methodology.md). Private caches retain authentic estimates and unavailable values; they are never committed.

## SEO and deployment

`.github/workflows/pages.yml` runs TypeScript, tests, HTML publication validation, and root/repository-path production builds before Pages deployment. The required check is **Validate website**. Validation covers metadata, canonical/alternate URLs, sitemap dates, structured data, local resources, article sources, download destinations and missing artifacts. GitHub Pages serves `404.html` with a genuine 404 for unknown paths; verify this after publishing.

Repository variables:

The authentic Search Console verification tag is committed permanently in `src/content/site-verification.json`; keep it after ownership verification.

Optional repository variables:
- `APP_STORE_PROVIDER_TOKEN`: an authentic provider token for this app, if obtained from App Store Connect. Without it, links remain ordinary App Store links and download attribution is unavailable.
- `WEBSITE_BASE_PATH`: `/damascene-rose-web/` only during project-path staging; `/` after attaching the custom domain. This affects asset/navigation paths, never production canonical URLs.

All language directories belong to the same Search Console property: `https://damascenerose.com/`. Submit its sitemap at `/sitemap.xml`; missing Search Console performance data is not proof that a page is unindexed.

## Organic growth

Call **`$organic-growth`** in Codex while this repository is open. The self-contained instructions are in `.agents/skills/organic-growth/SKILL.md`, and non-secret project settings are in `growth.config.json`.

```sh
npm run growth:keywords -- --plan
npm run growth:keywords
npm run growth:collect
```

The audited Gum build is reproducible with `bash scripts/gum/build-keyword-gum.sh` (Go required). The project MCP entry uses the read-only `damas-searchconsole` profile. Keyword collection uses the separate `damas-keywords` profile and only the two permitted keyword-planning operations. See the skill for exact scopes, targeting, caching and provisioning. Keep `.growth`, OAuth secrets and tokens private; do not commit any credentials.

The private [Damas growth runner](https://github.com/mdo91/damas-growth-runner) orchestrates the daily workflow at 08:00 Europe/Istanbul. It uses the owner's selected **Codex subscription** with a fresh isolated login, secure credential refresh persistence, shared subscription limits, and no separate OpenAI API key. Recurrence must remain disabled until a complete cloud trial validates collection, generation, publishing and exact deployment. The Mac is not needed after that setup succeeds. Signature Scan's runner and profiles are independent.

## Domain migration and rollback

The previous site is hosted by `mdo91/mdo91.github.io`. First deploy this repository at its project path and validate it. Back up the previous Pages/CNAME configuration, remove committed domain-claim files from the old repository, detach its custom domain, then attach `damascenerose.com` to this repository and redeploy at `/`. Preserve existing DNS unless GitHub's domain check identifies a required change. Verify HTTPS, representative locales, legal URLs and 404 responses before considering migration complete. To roll back, detach the domain here and restore the previous site's saved Pages/CNAME configuration. Never attach the same domain to both deployments.
