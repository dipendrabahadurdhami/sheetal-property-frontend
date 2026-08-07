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

async function safeFetchJson(url) {
  try {
    const res = await fetch(url);
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
    // Adjust the endpoint/response shape below to match your actual API.
    console.log("Fetching properties...");
    const properties = await safeFetchJson(`${API_BASE}/properties?per_page=5000`);
    const propertyList = properties?.data?.data || properties?.data || [];
    for (const prop of propertyList) {
      if (prop?.id) {
        entries.push(urlEntry(`${SITE}/property/${prop.id}`, "0.8", "weekly"));
      }
    }
    console.log(`  -> ${propertyList.length} properties added`);

    // ---- Blog posts ----
    console.log("Fetching blog posts...");
    const blogs = await safeFetchJson(`${API_BASE}/blogs?per_page=5000`);
    const blogList = blogs?.data?.data || blogs?.data || [];
    for (const post of blogList) {
      if (post?.slug) {
        entries.push(urlEntry(`${SITE}/blog/${post.slug}`, "0.7", "monthly"));
      }
    }
    console.log(`  -> ${blogList.length} blog posts added`);

    // ---- Blog categories ----
    console.log("Fetching blog categories...");
    const categories = await safeFetchJson(`${API_BASE}/blog-categories`);
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
