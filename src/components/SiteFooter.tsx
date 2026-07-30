import Link from "next/link";
import DeskMark from "@/components/DeskMark";
import { SITE_NAME, siteBase } from "@/lib/brand";

const HUB_URL = "https://erict16.github.io/huaming-hub/";
const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";

/** Quiet footer — mark + tools, no chrome clutter */
export default function SiteFooter() {
  const base = siteBase();
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-[var(--measure)] px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <DeskMark size={32} />
            <div>
              <p className="text-[13px] font-semibold tracking-tight text-[var(--ink)]">
                {SITE_NAME}
              </p>
              <p className="mt-1 max-w-[16rem] text-[12px] leading-relaxed text-[var(--faint)]">
                个人邮件调度台 · 要我动 / 等对方 / 订单管线
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 text-[12px]">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--faint)]">
                工具
              </p>
              <nav className="flex flex-col gap-1.5" aria-label="工具">
                <a
                  href={HUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--mute)] transition-colors hover:text-[var(--signal)]"
                >
                  Huaming Hub
                </a>
                <a
                  href={SELECTOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--mute)] transition-colors hover:text-[var(--signal)]"
                >
                  选型器
                </a>
              </nav>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--faint)]">
                本站
              </p>
              <nav className="flex flex-col gap-1.5" aria-label="法律">
                <Link
                  href={`${base}/privacy/`}
                  className="font-medium text-[var(--mute)] transition-colors hover:text-[var(--ink)]"
                >
                  隐私
                </Link>
                <Link
                  href={`${base}/terms/`}
                  className="font-medium text-[var(--mute)] transition-colors hover:text-[var(--ink)]"
                >
                  条款
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-[var(--line)] pt-4 text-[11px] tabular-nums text-[var(--faint)]">
          © {year} Eric Tan · 公开调度视图，不含金额与机密附件
        </p>
      </div>
    </footer>
  );
}
