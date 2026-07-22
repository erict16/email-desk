import type { Metadata } from "next";
import "./globals.css";

const isProd = process.env.NODE_ENV === "production";
const base = isProd ? "/email-desk" : "";

export const metadata: Metadata = {
  metadataBase: new URL(
    isProd
      ? "https://erict16.github.io/email-desk/"
      : "http://localhost:3000",
  ),
  title: "邮件跟进清单 · Email Desk",
  description: "Eric's weekday email follow-up board",
  icons: {
    icon: [{ url: `${base}/favicon.png?v=girl5`, type: "image/png", sizes: "64x64" }],
        apple: [{ url: `${base}/apple-touch-icon.png?v=girl5`, sizes: "180x180" }],
  },
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
