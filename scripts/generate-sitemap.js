/**
 * generate-sitemap.js
 *
 * Generates public/sitemap.xml including:
 *  - all static routes (same list as the committed public/sitemap.xml)
 *  - every property listing  (/property/:id)
 *  - every blog post         (/blog/:slug)
 *  - every blog category     (/blog/category/:slug)
 *
 * Run this as part of your deploy pipeline (e.g. right before/after
 * `npm run build`) so the sitemap always reflects current listings and
 * posts. It needs your live API to be reachable.
 *
 * Usage:
 *   REACT_APP_API_LINK=https://api.sheetalproperty.com/api node scripts/generate-sitemap.js
 *
 * Requires: node 18+ (built-in fetch). No extra npm packages needed.
 */

const fs = require("fs");
const path = require("path");

const SITE = "https://sheetalproperty.com";
const API_BASE = process.env.REACT_APP_API_LINK || "";

const STATIC_ROUTES = [
  ["/", "1.0", "daily"],
  ["/properties", "0.9", "daily"],
  ["/Sale", "0.9", "daily"],
  ["/Rent", "0.9", "daily"],
  ["/investment", "0.9", "daily"],
  ["/blog", "0.8", "daily"],
  ["/FindAgent", "0.7", "weekly"],
  ["/PropertyManagement", "0.6", "monthly"],
  ["/homeLone", "0.6", "monthly"],
  ["/homeLone/applyOnline", "0.5", "monthly"],
  ["/payRentOnline", "0.5", "monthly"],
  ["/LegalHelp", "0.5", "monthly"],
  ["/rateandtrend", "0.5", "weekly"],
  ["/property-demand", "0.5", "weekly"],
  ["/post-property", "0.6", "monthly"],
  ["/about", "0.4", "yearly"],
  ["/tools/emi-calculator", "0.7", "monthly"],
  ["/tools/roi-calculator", "0.7", "monthly"],
  ["/tools/land-estimator", "0.7", "monthly"],
  ["/tools/rent-vs-buy", "0.7", "monthly"],
  ["/tools/unit-converter", "0.7", "monthly"],
  ["/tools/property-tax", "0.7", "monthly"],
  ["/terms-and-conditions", "0.2", "yearly"],
  ["/privacy-policy", "0.2", "yearly"],
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeFetchJson(url, retriesLeft = 4) {
  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; SheetalSitemapBot/1.0; +https://sheetalproperty.com)",
      },
    });

    if (res.status === 429) {
      if (retriesLeft <= 0) {
        console.warn(`  ! ${url} -> HTTP 429, out of retries, skipping`);
        return null;
      }
      const retryAfterHeader = res.headers.get("retry-after");
      const waitMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 3000;
      console.warn(`  ! ${url} -> HTTP 429, waiting ${waitMs}ms then retrying (${retriesLeft} left)`);
      await sleep(waitMs);
      return safeFetchJson(url, retriesLeft - 1);
    }

    if (!res.ok) {
      console.warn(`  ! ${url} -> HTTP ${res.status}, skipping`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`  ! Could not reach ${url} (${err.message}), skipping`);
    return null;
  }
}

// Some endpoints cap per_page (they returned far fewer than requested).
// This loops page-by-page until the API stops returning new items, instead
// of trusting per_page=5000 to come back in one shot.
async function fetchAllPages(baseUrl, paramName = "per_page") {
  const all = [];
  const seenIds = new Set();
  let page = 1;
  let consecutiveNoNewItems = 0;
  const MAX_PAGES = 500; // safety cap
  while (page <= MAX_PAGES) {
    if (page > 1) await sleep(250); // stay under the API's rate limit
    const sep = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${sep}page=${page}&${paramName}=100`;
    const json = await safeFetchJson(url);
    if (!json) break;

    if (page === 1) {
      const metaPreview = json?.data?.meta || json?.meta || {
        current_page: json?.data?.current_page,
        last_page: json?.data?.last_page,
        total: json?.data?.total,
      };
      console.log(`    [page 1 meta for ${baseUrl}]`, JSON.stringify(metaPreview));
    }

    const list = json?.data?.data || json?.data || [];
    if (!Array.isArray(list) || list.length === 0) break;

    // Track whether this page actually contained anything new — if the
    // API ignores the page param and keeps returning the same items,
    // this stops us looping forever instead of assuming a short page
    // means "last page" (some APIs cap page size regardless of what
    // we ask for, so a short page does NOT necessarily mean it's last).
    let newCount = 0;
    for (const item of list) {
      const key = item?.id ?? JSON.stringify(item);
      if (!seenIds.has(key)) {
        seenIds.add(key);
        all.push(item);
        newCount++;
      }
    }
    if (newCount === 0) {
      consecutiveNoNewItems++;
      if (consecutiveNoNewItems >= 2) break; // API is repeating itself, stop
    } else {
      consecutiveNoNewItems = 0;
    }

    // Stop once we've reached the API's own reported last page, if it tells us.
    const meta = json?.data?.meta || json?.data || json?.meta || {};
    const currentPage = meta.current_page ?? page;
    const lastPage = meta.last_page;
    if (lastPage && currentPage >= lastPage) break;

    page++;
  }
  return all;
}

function urlEntry(loc, priority, changefreq) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const entries = STATIC_ROUTES.map(([p, pr, f]) => urlEntry(`${SITE}${p}`, pr, f));

  if (!API_BASE) {
    console.warn(
      "REACT_APP_API_LINK not set — writing static-only sitemap. " +
      "Set the env var to also include property & blog URLs."
    );
  } else {
    // ---- Properties ----
    // No single /properties endpoint on this API — listings are split by
    // purpose across /sale, /rent, /invest (same as RelatedProperties.jsx).
    // Each endpoint is paginated and caps per_page below what we ask for,
    // so we loop through every page instead of assuming one request gets
    // everything.
    console.log("Fetching properties...");
    const seenPropertyIds = new Set();
    let propertyCount = 0;
    for (const endpoint of ["/sale", "/rent", "/invest"]) {
      const propertyList = await fetchAllPages(`${API_BASE}${endpoint}`);
      for (const prop of propertyList) {
        if (prop?.id && !seenPropertyIds.has(prop.id)) {
          seenPropertyIds.add(prop.id);
          entries.push(urlEntry(`${SITE}/property/${prop.url || prop.id}`, "0.8", "weekly"));
          propertyCount++;
        }
      }
      console.log(`  -> ${endpoint}: ${propertyList.length} fetched (running total ${propertyCount} unique)`);
    }
    console.log(`  -> ${propertyCount} properties added total`);

    // ---- Blog posts ----
    console.log("Fetching blog posts...");
    const blogList = await fetchAllPages(`${API_BASE}/blog`);
    for (const post of blogList) {
      if (post?.slug) {
        entries.push(urlEntry(`${SITE}/blog/${post.slug}`, "0.7", "monthly"));
      }
    }
    console.log(`  -> ${blogList.length} blog posts added`);

    // ---- Blog categories ----
    console.log("Fetching blog categories...");
    const categories = await safeFetchJson(`${API_BASE}/blog/categories`);
    const categoryList = categories?.data?.data || categories?.data || [];
    for (const cat of categoryList) {
      if (cat?.slug) {
        entries.push(urlEntry(`${SITE}/blog/category/${cat.slug}`, "0.5", "weekly"));
      }
    }
    console.log(`  -> ${categoryList.length} blog categories added`);
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join("\n") +
    "\n</urlset>\n";

  const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");
  console.log(`\nWrote ${entries.length} URLs to ${outPath}`);
}

main();
