"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Download,
  Inbox,
  Moon,
  Search,
  Share2,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { smoothScrollTo } from "@/lib/smooth-scroll";

export type HeaderStats = {
  mine: number;
  waiting: number;
  orders: number;
  later: number;
};

type Props = {
  title: string;
  updated?: string;
  tzLabel?: string;
  stats: HeaderStats;
  query: string;
  onQueryChange: (q: string) => void;
  onOpenPalette?: () => void;
};

export default function AppHeader({
  title,
  updated,
  tzLabel = "北京时间",
  stats,
  query,
  onQueryChange,
  onOpenPalette,
}: Props) {
  const { theme, toggle } = useTheme();
  const [toast, setToast] = useState<string | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const bj = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      const sg = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Singapore",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      setClock(`BJ ${bj} · SST ${sg}`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

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
      <header className="print:hidden sticky top-0 z-[var(--z-sticky)] border-b border-[var(--glass-border)] bg-[var(--glass)] pt-[env(safe-area-inset-top,0px)] shadow-[0_1px_0_rgb(15_23_42/0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--glass)]">
        <div className="mx-auto max-w-[var(--measure)] px-3 py-2.5 sm:px-6 sm:py-2.5">
          {/* Row 1: brand + clock (desktop) + actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#top"
              onClick={onLogo}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] sm:flex-none"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                <Inbox size={18} strokeWidth={2} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-semibold tracking-tight text-[var(--ink)]">
                  Email Desk
                </span>
                <span className="mt-0.5 block text-[10px] tabular-nums text-[var(--faint)] sm:hidden">
                  {clock || tzLabel}
                </span>
              </span>
            </a>

            {/* desktop clock — center-right between brand and icons */}
            <div className="hidden min-w-0 flex-1 items-center justify-end sm:flex">
              <span className="truncate rounded-md bg-[var(--surface-2)] px-2.5 py-1 text-[11px] tabular-nums text-[var(--mute)]">
                {clock || tzLabel}
                {updated ? ` · 更新 ${updated}` : ""}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                aria-label={theme === "dark" ? "切换亮色" : "切换暗色"}
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <button
                type="button"
                onClick={onShare}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                aria-label="分享"
              >
                <Share2 size={16} />
              </button>
              <button
                type="button"
                onClick={onPdf}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                aria-label="导出 PDF"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Row 2: search */}
          <div className="relative mt-2 min-w-0">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="筛选 PO / 客户…"
              enterKeyHint="search"
              className="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] py-2 pl-9 pr-16 text-[16px] text-[var(--ink)] placeholder:text-[var(--faint)] outline-none focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 sm:h-9 sm:text-[13px]"
              aria-label="筛选看板"
            />
            <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
              {query ? (
                <button
                  type="button"
                  onClick={() => onQueryChange("")}
                  className="rounded-md p-1.5 text-[var(--faint)] hover:text-[var(--ink)]"
                  aria-label="清除搜索"
                >
                  <X size={16} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onOpenPalette?.()}
                className="rounded-md border border-[var(--line)] px-2 py-1 text-[10px] font-medium text-[var(--faint)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                title="Command palette"
              >
                ⌘K
              </button>
            </div>
          </div>

          {/* Row 3: counters — horizontal scroll on narrow screens */}
          <div className="-mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <StatPill href="#mine" n={stats.mine} label="要我动" tone="action" />
            <StatPill href="#wait" n={stats.waiting} label="等待" tone="wait" />
            <StatPill
              href="#pipeline"
              n={stats.orders}
              label="管线"
              tone="pipe"
            />
            {stats.later > 0 && (
              <StatPill
                href="#later"
                n={stats.later}
                label="稍后"
                tone="pipe"
              />
            )}
          </div>
        </div>
      </header>

      {toast && (
        <div className="print:hidden fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[var(--z-toast)] max-w-[min(90vw,20rem)] -translate-x-1/2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-center text-xs font-medium text-[var(--ink)] shadow-[var(--shadow-hover)]">
          {toast}
        </div>
      )}
    </>
  );
}

function StatPill({
  href,
  n,
  label,
  tone,
}: {
  href: string;
  n: number;
  label: string;
  tone: "action" | "wait" | "pipe";
}) {
  const colors =
    tone === "action"
      ? "bg-[var(--action-soft)] text-[var(--action-ink)]"
      : tone === "wait"
        ? "bg-[var(--wait-soft)] text-[var(--wait-ink)]"
        : "bg-[var(--primary-soft)] text-[var(--primary)]";

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        const id = href.replace("#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", href);
      }}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tabular-nums ${colors}`}
    >
      <span>{n}</span>
      <span className="font-medium opacity-90">{label}</span>
    </a>
  );
}
