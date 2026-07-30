import Link from "next/link";
import { siteBase } from "@/lib/brand";

const HUB_URL = "https://erict16.github.io/huaming-hub/";
const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";

/**
 * Docs-style one-line footer — no logo block, no blurb essay.
 */
export default function SiteFooter() {
  const base = siteBase();
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-3 px-4 py-6 text-[12px] text-[var(--faint)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="tabular-nums">© {year} Eric Tan</p>
        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-[var(--mute)]"
          aria-label="页脚"
        >
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--pipe)]"
          >
            Hub
          </a>
          <a
            href={SELECTOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--pipe)]"
          >
            选型
          </a>
          <Link href={`${base}/privacy/`} className="hover:text-[var(--ink)]">
            隐私
          </Link>
          <Link href={`${base}/terms/`} className="hover:text-[var(--ink)]">
            条款
          </Link>
        </nav>
      </div>
    </footer>
  );
}
