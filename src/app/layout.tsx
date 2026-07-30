import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";
import {
  ASSET_V,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  siteBase,
  siteOrigin,
} from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const base = siteBase();
const v = ASSET_V;
const icon = (file: string, sizes: string, type = "image/png") => ({
  url: `${base}/${file}?v=${v}`,
  type,
  sizes,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: `${base}/favicon.svg?v=${v}`, type: "image/svg+xml" },
      { url: `${base}/favicon.ico?v=${v}`, sizes: "any" },
      icon("favicon-32.png", "32x32"),
      icon("favicon-48.png", "48x48"),
      icon("favicon.png", "64x64"),
    ],
    apple: [
      icon("apple-touch-icon.png", "180x180"),
      icon("apple-touch-icon-167.png", "167x167"),
      icon("apple-touch-icon-152.png", "152x152"),
      icon("apple-touch-icon-120.png", "120x120"),
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`dark h-full antialiased ${inter.variable}`}>
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <ToastProvider>
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
