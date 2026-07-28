import Link from "next/link";
import { SITE_NAME, siteBase } from "@/lib/brand";

/** Ft2 — single-line quiet footer */
export default function SiteFooter() {
  const base = siteBase();
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto">
      <div className="mx-auto w-full max-w-[var(--measure)] border-t border-[var(--line)] px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[12px] text-[var(--faint)]">
          <p className="min-w-0">
            <Link
              href={`${base}/`}
              className="font-medium text-[var(--muted)] transition-colors duration-150 hover:text-[var(--ink)]"
            >
              {SITE_NAME}
            </Link>
            <span className="mx-1.5 text-[var(--line-strong)]" aria-hidden>
              ·
            </span>
            <span>工作台</span>
          </p>
          <nav
            className="flex flex-wrap items-center gap-x-3 gap-y-1"
            aria-label="Footer"
          >
            <Link
              href={`${base}/privacy/`}
              className="transition-colors duration-150 hover:text-[var(--ink)]"
            >
              Privacy
            </Link>
            <Link
              href={`${base}/terms/`}
              className="transition-colors duration-150 hover:text-[var(--ink)]"
            >
              Terms
            </Link>
            <span className="tabular-nums">© {year}</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
