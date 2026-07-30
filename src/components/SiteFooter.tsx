import Link from "next/link";
import { siteBase } from "@/lib/brand";

const HUB_URL = "https://erict16.github.io/huaming-hub/";
const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";

export default function SiteFooter() {
  const base = siteBase();
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto">
      <div className="mx-auto flex w-full max-w-[var(--measure)] flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--line)] px-4 py-6 text-[12px] sm:px-5">
        <p className="tabular-nums text-[var(--faint)]">© {year} Eric Tan</p>
        <nav
          className="flex flex-wrap gap-x-4 text-[var(--mute)]"
          aria-label="页脚"
        >
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--pipe)]"
          >
            Hub
          </a>
          <a
            href={SELECTOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--pipe)]"
          >
            选型
          </a>
          <Link
            href={`${base}/privacy/`}
            className="transition-colors hover:text-[var(--ink)]"
          >
            隐私
          </Link>
          <Link
            href={`${base}/terms/`}
            className="transition-colors hover:text-[var(--ink)]"
          >
            条款
          </Link>
        </nav>
      </div>
    </footer>
  );
}
