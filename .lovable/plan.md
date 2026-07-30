## Where the site stands

- Semrush has **no data** for lowestweplay.lovable.app and no data for "weplay top up" (IN database) — the domain isn't ranking yet and the core term is too niche to be tracked. So this is a from-zero SEO build, not an optimization of existing rankings.
- No SEO scan has ever run on the project (all scanners `not_scanned`) — I'll start one so the technical checks are graded by the real scanner too.
- What already exists: a real title/description, og/twitter tags, a working `robots.txt`. What's missing: sitemap, canonical, per-page metadata, structured data, and any content pages that can rank.

## Phase 1 — Technical foundation

1. **Head metadata cleanup** in `index.html`: tighten title to keyword-led form ("WePlay Top Up — Cheapest Recharge & Red Packet | Lowest Weplay", <60 chars), rewrite the description (currently ends in a stray quote, <160 chars), add `<link rel="canonical">` and `og:url` pointing at `https://lowestweplay.lovable.app/`, keep the existing og:image.
2. **Per-page metadata** via `react-helmet-async`: unique title + description + self-referencing canonical for `/`, `/contact`, `/privacy-policy`, `/refund-policy`, `/terms-of-service`; `noindex` on `/admin` and `/admin/auth`.
3. **Sitemap**: add `scripts/generate-sitemap.ts` wired to `predev`/`prebuild`, emitting `public/sitemap.xml` with the 5 public routes (admin routes excluded). No `lastmod` — there's no per-page timestamp to justify one.
4. **robots.txt**: keep the existing per-crawler blocks, add `Disallow: /admin`, and add the `Sitemap:` directive.
5. **Structured data**: `Organization` JSON-LD sitewide in `index.html`; `Product`/`Offer` JSON-LD for the top-up packages and `FAQPage` on the homepage FAQ once that section exists.
6. **On-page hygiene**: verify exactly one `<h1>` per page, alt text on every product/partner/carousel image, and `lang="en"` (or `en-IN`).

## Phase 2 — Search Console

Connect Google Search Console, verify the domain via the meta-tag method, submit the sitemap, then use URL Inspection to confirm the homepage is indexed. Without this, nothing about real indexing status is measurable.

## Phase 3 — Content that can actually rank

The site is one page selling a product — there is nothing for Google to rank on informational queries. Since keyword data for this niche is thin, treat the list below as **unvalidated** and prioritized by buyer intent:

| Page | Target intent |
| --- | --- |
| `/weplay-recharge` | "weplay recharge", "weplay coins buy india" |
| `/weplay-red-packet` | "weplay red packet top up" |
| `/weplay-top-up-price-list` | price/cost intent — full package table in INR |
| `/how-to-top-up-weplay` | step-by-step guide with the WePlay ID lookup |
| `/faq` | delivery time, safety, refund, "is it legit" |

Each page: answers the query directly, shows real prices, ends in one CTA, and is internally linked from the homepage plus the other pages. Five substantive pages beat fifty thin ones — thin variants get stuck as "Discovered - currently not indexed".

## Phase 4 — Authority & off-page

Ranking for transactional gaming-top-up terms is mostly trust. Highest-leverage moves: get listed/linked from WePlay creator communities, Discord/Telegram resource lists, and gaming-deal directories; keep the YouTube demo video embedded and linked back; collect real reviews with a `Review`/`AggregateRating` schema once they're genuine.

## Technical notes

- This is a classic Vite SPA with no SSR. `react-helmet-async` fixes titles/canonicals for Googlebot (which executes JS), but **social-preview crawlers only read the static `index.html`** — so per-page link previews will show the sitewide og tags. If accurate per-page previews matter, the app can get SSR by upgrading to Lovable's latest template ([what the upgrade gives you](https://lovable.dev/blog/building-apps-using-tanstack-start)).
- Semrush is the data source for the ranking/keyword claims above. For ongoing rank tracking and per-country keyword breakdowns, connecting Semrush would let me build that tracking into the app.

## Out of scope unless you ask

Blog posts (wrong first move for a transactional product), paid ads, and bulk templated location pages.
