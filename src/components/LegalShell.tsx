import Link from "next/link";
import { Inbox } from "lucide-react";
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
      <header className="sticky top-0 z-50 border-b border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-[var(--measure)] items-center gap-2 px-4 sm:px-6">
          <Link
            href={`${base}/`}
            className="flex items-center gap-2 text-[var(--ink)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
              <Inbox size={16} aria-hidden />
            </span>
            <span className="text-[13px] font-semibold">Email Desk</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 sm:px-6">
        <p className="mb-6">
          <Link
            href={`${base}/`}
            className="text-[13px] text-[var(--mute)] hover:text-[var(--primary)]"
          >
            ← Email Desk
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[var(--faint)]">
          Last updated: 22 July 2026
        </p>
        <div className="legal-prose mt-8 space-y-5 text-[14px] leading-relaxed text-[var(--mute)]">
          {children}
        </div>
      </main>
    </div>
  );
}
