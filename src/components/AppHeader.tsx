"use client";

import { useCallback, useState } from "react";
import { asset } from "@/lib/asset";
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
      {/* N5 floating pill nav */}
      <header className="print:hidden sticky top-0 z-[var(--z-sticky-nav)] px-3 pt-2.5 sm:px-4">
        <div className="mx-auto flex h-11 max-w-[var(--measure)] items-center justify-between gap-3 rounded-full border border-[var(--line)] bg-white/95 px-3.5 shadow-[var(--shadow-whisper)] backdrop-blur-md sm:px-4 dark:bg-[var(--card)]/95">
          <a
            href="#top"
            onClick={onLogo}
            className="flex min-w-0 items-center gap-2 rounded-full outline-none transition-opacity duration-150 hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
            aria-label="回到顶部"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("logo.png")}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover object-top ring-1 ring-[var(--line)]"
            />
            <span className="truncate text-[13px] font-semibold tracking-tight text-[var(--ink)]">
              Email Desk
            </span>
          </a>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium text-[var(--muted)] transition-colors duration-150 hover:bg-[var(--paper-2)] hover:text-[var(--ink)] active:bg-[var(--line)]"
            >
              <ShareIcon />
              分享
            </button>
            <button
              type="button"
              onClick={onPdf}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 text-[12px] font-medium text-[var(--paper)] transition-opacity duration-150 hover:opacity-90 active:opacity-80"
            >
              <DownloadIcon />
              下载
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="print:hidden fixed bottom-5 left-1/2 z-[var(--z-toast)] -translate-x-1/2 rounded-full bg-[var(--ink)] px-3.5 py-1.5 text-xs text-[var(--paper)] shadow-[var(--shadow-card)]">
          {toast}
        </div>
      )}
    </>
  );
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
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
