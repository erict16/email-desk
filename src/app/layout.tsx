import type { Metadata, Viewport } from "next";
import "./globals.css";

const isProd = process.env.NODE_ENV === "production";
const base = isProd ? "/email-desk" : "";
const v = "girl9";

export const metadata: Metadata = {
  metadataBase: new URL(
    isProd
      ? "https://erict16.github.io/email-desk/"
      : "http://localhost:3000",
  ),
  title: "邮件跟进清单 · Email Desk",
  description: "Eric's weekday email follow-up board",
  applicationName: "Email Desk",
  appleWebApp: {
    capable: true,
    title: "Email Desk",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    // Browser tabs — PNG is fine (Chrome/Edge/Safari all OK)
    icon: [
      { url: `${base}/favicon-32.png?v=${v}`, type: "image/png", sizes: "32x32" },
      { url: `${base}/favicon-48.png?v=${v}`, type: "image/png", sizes: "48x48" },
      { url: `${base}/favicon.png?v=${v}`, type: "image/png", sizes: "64x64" },
    ],
    // iOS home screen — opaque RGB squares; iOS applies its own mask
    apple: [
      { url: `${base}/apple-touch-icon.png?v=${v}`, sizes: "180x180", type: "image/png" },
      {
        url: `${base}/apple-touch-icon-167.png?v=${v}`,
        sizes: "167x167",
        type: "image/png",
      },
      {
        url: `${base}/apple-touch-icon-152.png?v=${v}`,
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: `${base}/apple-touch-icon-120.png?v=${v}`,
        sizes: "120x120",
        type: "image/png",
      },
    ],
  },
};

/** iOS Safari / PWA viewport */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
