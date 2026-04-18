import type React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { RootProvider } from "fumadocs-ui/provider";
import PrivyAppProvider from "@/components/auth/privy-provider";
import { RouteGuard } from "@/components/route-guard";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import {
  courseKeywords,
  defaultOpenGraphImage,
  defaultTwitterImage,
  metadataBase,
  siteUrl,
} from "@/lib/seo";
import { brand } from "@/lib/brand";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: brand.name,
  alternateName: brand.alternateName,
  url: siteUrl,
  logo: `${siteUrl}${brand.assets.appleTouchIcon}`,
  description: brand.longDescription,
  sameAs: [brand.xUrl, brand.githubUrl],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "support",
      email: brand.email,
    },
  ],
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Learn Solana Development",
  description:
    "Comprehensive Solana development course covering blockchain fundamentals, Rust programming, Anchor framework, and building dApps.",
  provider: {
    "@type": "EducationalOrganization",
    name: brand.name,
    url: siteUrl,
  },
  educationalLevel: "Beginner to Advanced",
  isAccessibleForFree: true,
  inLanguage: "en",
  coursePrerequisites: "Basic programming knowledge",
  teaches: ["Solana Development", "Rust Programming", "Smart Contracts", "Anchor Framework", "Solana Client Tooling"],
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT40H",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: brand.name,
  alternateName: brand.alternateName,
  url: siteUrl,
  // NOTE: SearchAction commented out - fumadocs uses a different search mechanism
  // Uncomment when a /search page is implemented
  // potentialAction: {
  //   "@type": "SearchAction",
  //   target: `${siteUrl}/search?q={search_term_string}`,
  //   "query-input": "required name=search_term_string",
  // },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.longDescription,
  keywords: courseKeywords,
  applicationName: brand.name,
  authors: [{ name: `${brand.name} Team` }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.longDescription,
    url: siteUrl,
    siteName: `${brand.name}, ${brand.alternateName} Development`,
    locale: "en_US",
    images: [defaultOpenGraphImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@learndotsol",
    creator: "@Some1UKnow25",
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.longDescription,
    images: [defaultTwitterImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
  category: "education",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(organizationJsonLd)}
        </Script>
        <Script
          id="jsonld-course"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(courseJsonLd)}
        </Script>
        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(websiteJsonLd)}
        </Script>
        {process.env.NEXT_PUBLIC_ENABLE_REACT_SCAN && (
          // react-scan performance analyzer (only enabled when explicitly requested)
          <Script
            id="react-scan"
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {process.env.NODE_ENV === "production" && clarityId && (
          <Script id="clarity-script" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}
        {process.env.NODE_ENV === "production" && (
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="jirAR70ve59bhS08RdDhqw"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PrivyAppProvider>
            <RouteGuard>
              <RootProvider>
                {children}
                <Analytics />
              </RootProvider>
            </RouteGuard>
          </PrivyAppProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
