"use client";

import { useCallback, useState } from "react";
import { Download, Share2 } from "lucide-react";
import DeskMark from "@/components/DeskMark";
import { smoothScrollTo } from "@/lib/smooth-scroll";

type Props = { title: string };

export default function AppHeader({ title }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  };

  const onLogo = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
    smoothScrollTo("top", 260);
  }, []);

  const onShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url, text: title });
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("链接已复制");
    } catch {
      flash("复制失败");
    }
  }, [title]);

  const onPdf = useCallback(() => {
    flash("打印 → 另存为 PDF");
    window.setTimeout(() => window.print(), 200);
  }, []);

  return (
    <>
      <header className="print:hidden sticky top-0 z-[var(--z-sticky-nav)] border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[var(--banner-height)] max-w-[var(--measure)] items-center justify-between gap-3 px-4 sm:px-5">
          <a
            href="#top"
            onClick={onLogo}
            className="flex min-w-0 items-center gap-2 rounded-[var(--radius-sm)] text-[var(--pipe)] outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
            aria-label="回到顶部"
          >
            <DeskMark size={18} />
            <span className="truncate text-[13px] font-semibold tracking-tight text-[var(--ink)]">
              Email Desk
            </span>
          </a>

          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-[12px] font-medium text-[var(--mute)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
            >
              <Share2 size={15} strokeWidth={1.75} aria-hidden />
              <span className="hidden sm:inline">分享</span>
            </button>
            <button
              type="button"
              onClick={onPdf}
              className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-[12px] font-medium text-[var(--mute)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
            >
              <Download size={15} strokeWidth={1.75} aria-hidden />
              <span className="hidden sm:inline">导出</span>
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="print:hidden fixed bottom-6 left-1/2 z-[var(--z-toast)] -translate-x-1/2 rounded-full bg-[var(--ink)] px-4 py-2 text-xs text-[var(--surface)]">
          {toast}
        </div>
      )}
    </>
  );
}
