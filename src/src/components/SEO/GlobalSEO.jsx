import React from "react";
import { Helmet } from "react-helmet";
import { SITE, DEFAULT_IMAGE } from "./SEO";

/**
 * Renders ONCE at the App root. Provides site-wide defaults + the
 * Organization / WebSite JSON-LD that should appear on every page
 * regardless of which page-level <SEO> component also runs.
 * react-helmet merges multiple <Helmet> instances safely.
 */
const GlobalSEO = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: "Sheetal Property Nepal",
      url: SITE,
      logo: DEFAULT_IMAGE,
      image: DEFAULT_IMAGE,
      description:
        "Sheetal Property Nepal is Nepal's trusted real estate platform for buying, selling, renting and investing in verified properties across Kathmandu, Pokhara and Nepal — serving local buyers as well as NRNs and investors from India and Dubai/UAE.",
      areaServed: [
        { "@type": "Country", name: "Nepal" },
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United Arab Emirates" },
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "NP",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Sheetal Property Nepal",
      url: SITE,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE}/properties?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <Helmet>
      <html lang="en" />
      <meta
        name="keywords"
        content="Sheetal Property Nepal, property Nepal, real estate Nepal, buy property Nepal from India, NRN property investment Nepal, Nepal real estate for Dubai investors, Kathmandu real estate, land for sale Nepal, house for sale Nepal, property investment Nepal"
      />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="NP" />
      <meta name="geo.placename" content="Kathmandu" />
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default GlobalSEO;
