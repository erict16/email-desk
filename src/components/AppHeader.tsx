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
};

export default function AppHeader({
  title,
  updated,
  tzLabel = "北京时间",
  stats,
  query,
  onQueryChange,
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
      <header className="print:hidden sticky top-0 z-[var(--z-sticky)] border-b border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:py-2.5">
          {/* brand + clock */}
          <div className="flex min-w-0 items-center justify-between gap-3 lg:justify-start lg:gap-4">
            <a
              href="#top"
              onClick={onLogo}
              className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                <Inbox size={18} strokeWidth={2} aria-hidden />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className="truncate text-[14px] font-semibold tracking-tight text-[var(--ink)]">
                  Email Desk
                </span>
                <span className="mt-1 hidden text-[10px] tabular-nums text-[var(--faint)] sm:block">
                  {clock || tzLabel}
                  {updated ? ` · ${updated}` : ""}
                </span>
              </span>
            </a>

            {/* mobile counters */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <StatPill href="#mine" n={stats.mine} label="动" tone="action" />
              <StatPill href="#wait" n={stats.waiting} label="等" tone="wait" />
              <StatPill
                href="#pipeline"
                n={stats.orders}
                label="管"
                tone="pipe"
              />
            </div>
          </div>

          {/* search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="搜索 PO / 客户 / 状态…"
              className="h-9 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] py-2 pl-9 pr-9 text-[13px] text-[var(--ink)] placeholder:text-[var(--faint)] outline-none transition-colors focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20"
              aria-label="搜索看板"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--faint)] hover:text-[var(--ink)]"
                aria-label="清除搜索"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* desktop counters + actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <StatPill href="#mine" n={stats.mine} label="要我动" tone="action" />
            <StatPill href="#wait" n={stats.waiting} label="等待" tone="wait" />
            <StatPill
              href="#pipeline"
              n={stats.orders}
              label="管线"
              tone="pipe"
            />
          </div>

          <div className="flex shrink-0 items-center gap-0.5 self-end lg:self-auto">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--mute)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
              aria-label={theme === "dark" ? "切换亮色" : "切换暗色"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] sm:w-auto sm:gap-1.5 sm:px-2.5"
              aria-label="分享"
            >
              <Share2 size={15} />
              <span className="hidden text-[12px] font-medium sm:inline">
                分享
              </span>
            </button>
            <button
              type="button"
              onClick={onPdf}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] sm:w-auto sm:gap-1.5 sm:px-2.5"
              aria-label="导出 PDF"
            >
              <Download size={15} />
              <span className="hidden text-[12px] font-medium sm:inline">
                导出
              </span>
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="print:hidden fixed bottom-6 left-1/2 z-[var(--z-toast)] -translate-x-1/2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--ink)] shadow-[var(--shadow-hover)]">
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums transition-opacity hover:opacity-85 ${colors}`}
    >
      <span>{n}</span>
      <span className="font-medium opacity-90">{label}</span>
    </a>
  );
}
