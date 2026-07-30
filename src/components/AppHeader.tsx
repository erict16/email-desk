"use client";

import { useCallback, useState } from "react";
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
      <header className="print:hidden sticky top-0 z-[var(--z-sticky-nav)] border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-[var(--banner-height)] max-w-[var(--measure)] items-center justify-between gap-3 px-4 sm:px-5">
          <a
            href="#top"
            onClick={onLogo}
            className="flex min-w-0 items-center gap-2.5 rounded outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
            aria-label="回到顶部"
          >
            <DeskMark size={26} />
            <span className="truncate text-[13px] font-semibold tracking-tight text-[var(--ink)]">
              Email Desk
            </span>
          </a>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-[12px] font-medium text-[var(--mute)] transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
            >
              <ShareIcon />
              <span className="hidden sm:inline">分享</span>
            </button>
            <button
              type="button"
              onClick={onPdf}
              className="inline-flex h-8 items-center gap-1.5 rounded bg-[var(--ink)] px-3 text-[12px] font-medium text-[var(--surface)] transition-opacity hover:opacity-85"
            >
              <DownloadIcon />
              PDF
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="print:hidden fixed bottom-5 left-1/2 z-[var(--z-toast)] -translate-x-1/2 rounded-full bg-[var(--ink)] px-3.5 py-1.5 text-xs text-[var(--surface)]">
          {toast}
        </div>
      )}
    </>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v12m0 0l-4-4m4 4l4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
