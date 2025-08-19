import type React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { RootProvider } from "fumadocs-ui/provider";
import { cookieToWeb3AuthState } from "@web3auth/modal";
import Provider from "../components/web3Auth/authProvider";
import { RouteGuard } from "@/components/route-guard";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "learn.sol",
  description: "The first AI-assisted Solana learning and building platform",
  openGraph: {
    title: "learn.sol",
    description: "The first AI-assisted Solana learning and building platform",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "learn.sol",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "learn.sol",
    description: "The first AI-assisted Solana learning and building platform",
    images: ["/twitter-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const web3authInitialState = cookieToWeb3AuthState(headersList.get("cookie"));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Provider web3authInitialState={web3authInitialState}>
            <RouteGuard>
              <RootProvider>{children}</RootProvider>
            </RouteGuard>
          </Provider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
