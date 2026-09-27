import React from "react";
import { Helmet } from "react-helmet";

const SITE = "https://sheetalproperty.com";
const DEFAULT_IMAGE = `${SITE}/shetallogo.png`;

/**
 * Reusable SEO component.
 * Handles title/description/keywords, canonical, OG, Twitter,
 * hreflang alternates (Nepal / India / UAE-Dubai / worldwide default),
 * and optional JSON-LD structured data.
 *
 * hreflang note: this is a single-market (Nepal) site with one shared
 * URL per page. Until dedicated India/UAE localized content or
 * subpaths exist, hreflang alternates below point at the SAME url —
 * this correctly tells Google "this one page serves all these
 * regions" (valid & safe), but it is NOT the same as true localized
 * content per country. See README-SEO.md for the upgrade path
 * (e.g. /in/ and /ae/ landing pages) when ready.
 */
const SEO = ({
  title,
  description,
  keywords,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = null,
}) => {
  const url = `${SITE}${path}`;
  const fullTitle = title?.includes("Sheetal Property")
    ? title
    : `${title} | Sheetal Property Nepal`;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* hreflang — see note above */}
      <link rel="alternate" hrefLang="en-np" href={url} />
      <link rel="alternate" hrefLang="en-in" href={url} />
      <link rel="alternate" hrefLang="en-ae" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Sheetal Property Nepal" />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLdArray.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
export { SITE, DEFAULT_IMAGE };
