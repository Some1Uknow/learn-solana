import { brand } from "./brand";

type JsonLdObject = Record<string, unknown>;

function normalizeOrigin(origin: string) {
  return origin.replace(/\/+$/, "");
}

/**
 * Returns the public identity schemas emitted on the server-rendered site
 * shell. Keeping these as native JSON-LD objects makes them available in the
 * initial HTML before any client JavaScript runs.
 */
export function createSiteStructuredData(origin: string): JsonLdObject[] {
  const site = normalizeOrigin(origin);
  const organizationId = `${site}#organization`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: brand.name,
      alternateName: brand.alternateName,
      url: site,
      logo: `${site}${brand.assets.appleTouchIcon}`,
      description: brand.longDescription,
      sameAs: [brand.xUrl, brand.githubUrl],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: brand.email,
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${site}#software-application`,
      name: brand.name,
      description: brand.description,
      url: site,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@id": organizationId,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${site}#course`,
      name: "Learn Solana Development",
      description:
        "A free Solana development course covering blockchain fundamentals, Rust programming, Anchor, and modern client tooling.",
      url: `${site}/learn`,
      provider: {
        "@id": organizationId,
      },
      educationalLevel: "Beginner to Advanced",
      isAccessibleForFree: true,
      inLanguage: "en",
      teaches: [
        "Solana Development",
        "Rust Programming",
        "Smart Contracts",
        "Anchor Framework",
        "Solana Client Tooling",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${site}#website`,
      name: brand.name,
      alternateName: brand.alternateName,
      url: site,
      description: brand.longDescription,
      publisher: {
        "@id": organizationId,
      },
    },
  ];
}
