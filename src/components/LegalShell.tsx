import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { siteBase } from "@/lib/brand";

/** Shared chrome for Privacy / Terms — quiet, readable. */
export default function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const base = siteBase();

  return (
    <div id="top" className="min-h-full">
      <AppHeader title={`${title} · Email Desk`} />
      <main className="mx-auto w-full max-w-[var(--measure)] px-4 pb-16 pt-6 sm:px-6">
        <p className="mb-6">
          <Link
            href={`${base}/`}
            className="text-[13px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--ink)]"
          >
            ← Email Desk
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Last updated: 22 July 2026</p>
        <div className="legal-prose mt-8 space-y-5 text-[14px] leading-relaxed text-[var(--muted)]">
          {children}
        </div>
      </main>
    </div>
  );
}
