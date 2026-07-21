import type { Metadata } from "next";
import "./globals.css";

const isProd = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(
    isProd
      ? "https://erict16.github.io/email-desk/"
      : "http://localhost:3000",
  ),
  title: "📧 邮件跟进清单 · Email Desk",
  description: "Eric's weekday email follow-up board",
  icons: {
    icon: [{ url: "favicon.svg", type: "image/svg+xml" }],
    apple: "favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        {children}
      </body>
    </html>
  );
}
