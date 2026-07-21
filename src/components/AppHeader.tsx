"use client";

import { useCallback, useState } from "react";

type Props = {
  title: string;
};

export default function AppHeader({ title }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const onShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url, text: title });
        return;
      }
    } catch {
      /* user cancelled */
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("链接已复制");
    } catch {
      flash("复制失败，请手动复制地址栏");
    }
  }, [title]);

  const onPdf = useCallback(() => {
    // Native print → Save as PDF (no extra dependency)
    flash("请在打印对话框选择「另存为 PDF」");
    window.setTimeout(() => window.print(), 250);
  }, []);

  return (
    <>
      <header
        className="print:hidden sticky top-0 z-40 border-b border-neutral-200/90 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90"
        data-testid="app-header"
      >
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="text-xl leading-none" aria-hidden>
              📧
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
                Email Desk
              </div>
              <div className="truncate text-[11px] text-neutral-400">
                邮件跟进
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              title="分享链接"
            >
              <ShareIcon />
              <span className="hidden sm:inline">分享</span>
            </button>
            <button
              type="button"
              onClick={onPdf}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-900 px-3 text-xs font-medium text-white transition hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              title="下载 PDF"
            >
              <DownloadIcon />
              <span className="hidden sm:inline">下载 PDF</span>
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="print:hidden fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-800 shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
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
        d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"
        stroke="currentColor"
        strokeWidth="1.8"
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
        d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
