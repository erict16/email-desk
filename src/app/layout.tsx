import type { Metadata } from "next";
import "./globals.css";

const isProd = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(
    isProd
      ? "https://erict16.github.io/email-desk/"
      : "http://localhost:3000",
  ),
  title: "邮件跟进清单 · Email Desk",
  description: "Eric's weekday email follow-up board",
  icons: {
    icon: [{ url: "favicon.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "apple-touch-icon.png", sizes: "180x180" }],
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
