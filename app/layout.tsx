import type React from "react";
import "./globals.css";
import "./design-system.css";
import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
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
import { createSiteStructuredData } from "@/lib/site-structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

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
        {createSiteStructuredData(siteUrl).map((schema, index) => (
          <script
            key={`jsonld-site-${index}`}
            id={`jsonld-site-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {process.env.NEXT_PUBLIC_ENABLE_REACT_SCAN && (
          <Script
            id="react-scan"
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[60] -translate-y-20 rounded-[6px] bg-[#181818] px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
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
          defaultTheme="light"
          enableSystem={false}
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
