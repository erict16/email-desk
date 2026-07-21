"use client";

import { useCallback, useState } from "react";
import TwinClocks from "@/components/TwinClocks";

type Props = { title: string };

export default function AppHeader({ title }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  };

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
    flash("打印对话框 → 另存为 PDF");
    window.setTimeout(() => window.print(), 200);
  }, []);

  return (
    <>
      <header className="print:hidden sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--card)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="logo.png"
              alt="Hermes Girl"
              width={36}
              height={36}
              className="h-9 w-9 rounded-2xl bg-[#e8f5e9] object-cover shadow-sm ring-1 ring-black/5"
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-[var(--fg)]">
                Email Desk
              </div>
              <TwinClocks />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-[var(--line)] bg-white px-2.5 text-xs font-medium text-[var(--fg)] hover:bg-neutral-50 dark:bg-[var(--card)]"
            >
              分享
            </button>
            <button
              type="button"
              onClick={onPdf}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[var(--fg)] px-2.5 text-xs font-medium text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              PDF
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="print:hidden fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--fg)] px-3.5 py-1.5 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
