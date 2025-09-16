import React from "react";

// Server component: renders JSON-LD structured data for Person (CV)
// No "use client" needed.
export default function CVJsonLd({
  locale = "de",
  sameAs = [],
}: {
  locale?: string;
  sameAs?: string[];
}) {
  const de = locale?.startsWith("de");
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ismet Mesic",
    jobTitle: "Executive Entrepreneur & Innovation Architect",
    email: "mailto:ismet@mesic.dev",
    address: {
      "@type": "PostalAddress",
      addressLocality: de ? "Wien, AT" : "Vienna, AT",
      addressCountry: "AT",
    },
    worksFor: {
      "@type": "Organization",
      name: "Independent / Consulting",
    },
    image: {
      "@type": "ImageObject",
      url: "/cv/profile.jpg",
    },
    sameAs: sameAs.filter(Boolean),
    author: {
      "@type": "Person",
      name: "Ismet Mesic",
    },
    authorOf: [
      {
        "@type": "Book",
        name: de
          ? "#Sigmacode – Das mentale Betriebssystem für Männer"
          : "#Sigmacode – The mental operating system for men",
      },
    ],
  } as const;

  return (
    <script
      type="application/ld+json"
      // JSON.stringify with spacing 0 to keep it compact
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
