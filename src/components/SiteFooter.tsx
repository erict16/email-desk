import Link from "next/link";
import DeskMark from "@/components/DeskMark";
import { SITE_NAME, siteBase } from "@/lib/brand";

const HUB_URL = "https://erict16.github.io/huaming-hub/";
const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";

export default function SiteFooter() {
  const base = siteBase();
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-[var(--measure)] px-4 py-8 sm:px-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <DeskMark size={28} />
            <div>
              <p className="text-[13px] font-semibold tracking-tight text-[var(--ink)]">
                {SITE_NAME}
              </p>
              <p className="mt-1 max-w-[15rem] text-[12px] leading-relaxed text-[var(--faint)]">
                要我动 · 等对方 · 订单管线
              </p>
            </div>
          </div>

          <nav
            className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-medium text-[var(--mute)]"
            aria-label="页脚"
          >
            <a
              href={HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)]"
            >
              Hub
            </a>
            <a
              href={SELECTOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)]"
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

        <p className="mt-6 text-[11px] tabular-nums text-[var(--faint)]">
          © {year} Eric Tan
        </p>
      </div>
    </footer>
  );
}
