import Link from "next/link";
import { SITE_NAME, siteBase } from "@/lib/brand";

/**
 * Minimal footer — Linear/Notion quiet style.
 * Shown on every page via root layout.
 */
export default function SiteFooter() {
  const base = siteBase();
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto border-t border-[var(--line)] bg-[var(--card)]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <Link
            href={`${base}/`}
            className="text-[13px] font-semibold tracking-tight text-[var(--fg)] transition-opacity hover:opacity-70"
          >
            {SITE_NAME}
          </Link>
          <p className="mt-0.5 text-[12px] text-[var(--muted)]">
            Personal email follow-up board
          </p>
        </div>

        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--muted)]"
          aria-label="Footer"
        >
          <Link
            href={`${base}/privacy/`}
            className="transition-colors hover:text-[var(--fg)]"
          >
            Privacy
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700" aria-hidden>
            ·
          </span>
          <Link
            href={`${base}/terms/`}
            className="transition-colors hover:text-[var(--fg)]"
          >
            Terms
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700" aria-hidden>
            ·
          </span>
          <span className="tabular-nums">© {year}</span>
        </nav>
      </div>
    </footer>
  );
}
