# SEO Fixes Applied — Sheetal Property Nepal

Extract this zip directly onto your project root (it only adds/overwrites
files listed below — nothing else is touched).

## What changed

### 1. Reusable SEO system
- `src/components/SEO/SEO.jsx` — drop-in `<SEO />` component: title,
  description, keywords, canonical, hreflang, Open Graph, Twitter card,
  and optional JSON-LD.
- `src/components/SEO/GlobalSEO.jsx` — renders once at the app root.
  Adds sitewide `RealEstateAgent` + `WebSite` (with `SearchAction`)
  JSON-LD, and declares Nepal/India/UAE as `areaServed`.
- `src/components/SEO/PageLoader.jsx` — small spinner shown while a
  lazy-loaded route chunk downloads.

### 2. Meta tags added to every page that was missing them (30 pages)
Every page now has a tailored title/description/keywords, including the
previously-blank ones that mattered most:
- **BlogSingle** — now fully dynamic: title, description, OG image, and
  `Article` JSON-LD generated from the actual post data (author,
  category, tags, publish date).
- **BlogCategory** — dynamic title/description using the category name.
- All 6 calculator/tool pages (EMI, ROI, Land Estimator, Property Tax,
  Rent vs Buy, Unit Converter) — these are long-tail keyword magnets
  that were previously invisible to search engines.
- AllProperties, Investment, InvestmentAllProduct, InvestDetails,
  PropertyDemand, PostProperty, and the rest of the utility/legal pages.
- Private/admin-only pages (MyProfile, Messages, VerifyEmail,
  ResetPassword, ShetalLeadExtractor, Test) were given `noindex` instead
  of real keywords — they have no ranking value and shouldn't compete
  with your real pages for crawl budget.

`SingleProduct.jsx` and `SingleAgent.jsx` already had good meta + JSON-LD
before this pass and were left as-is.

### 3. Code splitting
`App.js` now lazy-loads every route (`React.lazy` + `Suspense`) instead
of shipping one giant bundle. This directly improves Core Web Vitals
(LCP/FID), which is a Google ranking factor.

### 4. robots.txt + sitemap.xml
- `public/robots.txt` — allows everything except private/admin routes,
  points to the sitemap.
- `public/sitemap.xml` — static version covering all fixed routes
  (home, listings, tools, blog index, etc).
- `scripts/generate-sitemap.js` — **run this at deploy time** to also
  include every individual property and blog URL, pulled live from your
  API. Static sitemap.xml alone won't know about new listings/posts.

  ```bash
  REACT_APP_API_LINK=https://your-api.com/api npm run generate-sitemap
  # or, to build + regenerate sitemap in one step:
  npm run build:seo
  ```

  The script guesses at reasonable API endpoints
  (`/properties`, `/blogs`, `/blog-categories`) and response shapes —
  **check the field names against your actual Laravel API** and adjust
  the `properties?.data?.data` style accessors in the script if they
  don't match.

## Important: hreflang is a simplified stopgap, not full localization

I added `hreflang` alternates (`en-np`, `en-in`, `en-ae`, `x-default`)
to every page — but they all currently point at the **same URL**. This
is valid and tells Google "this one page is meant for all these
regions," which is safe and better than nothing, but it is **not** the
same as real per-country content. To seriously compete for India and
Dubai/UAE search traffic, the real fix is separate landing pages (or
subpaths like `/in/`, `/ae/`) with content, testimonials, currency and
contact info tailored to each market. Flagging this so it doesn't get
mistaken for "the site is now fully localized."

## Not done in this pass (needs your input / backend coordination)

- **Property URLs are still `/property/:id`** (numeric, no keywords).
  Changing this to a slug (`/property/2bhk-flat-baluwatar-4821`) touches
  routing, every `<Link>` that builds a property URL, and ideally a
  `slug` field on the backend — too invasive to do blind. Happy to do
  this next if you confirm the backend can return a slug (or if you
  want me to generate one client-side from the title + id).
- **True SSR/SSG migration** (e.g. to Next.js) — the single highest-
  leverage remaining fix for international ranking speed, since this is
  still a client-rendered React app. That's a bigger project, not a
  patch-in-place fix.
- I could not verify whether a `public/index.html` with proper meta
  already exists on your live repo — it wasn't present in the zip you
  gave me, so it wasn't touched. Double check that file directly.

## Quick test checklist after deploying

1. View source (not devtools, actual "view source") on a blog post and
   a property page — confirm `<title>`, `<meta description>`, and the
   `<script type="application/ld+json">` block are present.
2. Test structured data: https://search.google.com/test/rich-results
3. Test the sitemap loads: `https://sheetalproperty.com/sitemap.xml`
4. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
5. Re-run `npm run generate-sitemap` after each deploy (or wire it into
   your CI/CD) so new listings and posts get picked up.
