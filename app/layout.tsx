import type React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { RootProvider } from "fumadocs-ui/provider";
import Provider from "../components/web3Auth/authProvider";
import { RouteGuard } from "@/components/route-guard";
import { headers } from "next/headers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import {
  courseKeywords,
  defaultOpenGraphImage,
  defaultTwitterImage,
  metadataBase,
  siteUrl,
} from "@/lib/seo";
import { parseWeb3AuthStateFromCookie } from "@/lib/web3auth-cookie";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "learn.sol",
  alternateName: "Learn Solana",
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image.png`,
  description: "Free Solana development courses, tutorials, and coding challenges",
  sameAs: ["https://x.com/learndotsol", "https://github.com/learn-solana"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "support",
      email: "raghav@learnsol.site",
    },
  ],
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Learn Solana Development",
  description: "Free comprehensive Solana development course covering blockchain fundamentals, Rust programming, Anchor framework, and building dApps",
  provider: {
    "@type": "EducationalOrganization",
    name: "learn.sol",
    url: siteUrl,
  },
  educationalLevel: "Beginner to Advanced",
  isAccessibleForFree: true,
  inLanguage: "en",
  coursePrerequisites: "Basic programming knowledge",
  teaches: ["Solana Development", "Rust Programming", "Smart Contracts", "Anchor Framework", "Web3 Development"],
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT40H",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "learn.sol",
  alternateName: "Learn Solana",
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
    default: "Learn Solana | Free Solana Development Course",
    template: "%s | learn.sol",
  },
  description:
    "Learn Solana development for free. Master Solana programming, Rust, Anchor framework through interactive courses, games, and coding challenges. The best way to learn Solana.",
  keywords: courseKeywords,
  applicationName: "learn.sol",
  authors: [{ name: "learn.sol Team" }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Learn Solana | Free Solana Development Course",
    description:
      "Learn Solana development for free. Master Solana programming through interactive courses, games, and challenges.",
    url: siteUrl,
    siteName: "learn.sol, Learn Solana Development",
    locale: "en_US",
    images: [defaultOpenGraphImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@learndotsol",
    creator: "@Some1UKnow25",
    title: "Learn Solana | Free Development Course",
    description:
      "Learn Solana development for free through interactive courses, games, and coding challenges.",
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
  const headersList = await headers();
  const web3authInitialState = parseWeb3AuthStateFromCookie(
    headersList.get("cookie"),
  );
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
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
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
            data-key={process.env.NEXT_PUBLIC_AHREFS_KEY}
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Provider web3authInitialState={web3authInitialState}>
            <RouteGuard>
              <RootProvider>
                {children}
                <Analytics />
              </RootProvider>
            </RouteGuard>
          </Provider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
