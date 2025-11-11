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
  "@type": "Organization",
  name: "learn.sol",
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image.png`,
  sameAs: ["https://x.com/learndotsol", "https://github.com/learn-solana"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "support",
      email: "raghav@learnsol.site",
    },
  ],
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
    default: "Learn Solana",
    template: "%s | Learn Solana",
  },
  description:
    "Learn solana through courses, games and coding challenges at learn.sol",
  keywords: courseKeywords,
  applicationName: "Learn Solana",
  authors: [{ name: "learn.sol Team" }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Learn Solana",
    description:
      "Learn solana through courses, games and coding challenges at learn.sol",
    url: siteUrl,
    siteName: "learn.sol",
    locale: "en_US",
    images: [defaultOpenGraphImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@learndotsol",
    creator: "@Some1UKnow25",
    title: "Learn Solana",
    description:
      "Learn solana through courses, games and coding challenges at learn.sol",
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
  category: "technology",
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
        {clarityId ? (
          <Script id="clarity-script" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        ) : null}
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
