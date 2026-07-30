"use client";

import type { BlockerCategory, ZoneFilter } from "@/lib/blocker-classify";
import { Factory, FileText, Users } from "lucide-react";

type Props = {
  zone: ZoneFilter;
  onZone: (z: ZoneFilter) => void;
  categories: Set<BlockerCategory>;
  onToggleCategory: (c: BlockerCategory) => void;
  counts: { all: number; blocked: number; mine: number; waiting: number };
  hideDone: boolean;
  onHideDone: (v: boolean) => void;
  doneCount: number;
};

const ZONES: { id: ZoneFilter; label: string; short: string; emoji?: string }[] =
  [
    { id: "all", label: "All", short: "全部" },
    { id: "blocked", label: "仅看卡点", short: "卡点", emoji: "🔥" },
    { id: "mine", label: "要我动", short: "要我动", emoji: "⚡" },
    { id: "waiting", label: "等对方", short: "等待", emoji: "⏳" },
  ];

const CATS: {
  id: BlockerCategory;
  label: string;
  short: string;
  icon: typeof Users;
}[] = [
  { id: "customer", label: "Customer", short: "客户", icon: Users },
  { id: "factory", label: "Factory / Eng", short: "工厂", icon: Factory },
  { id: "docs", label: "Documentation", short: "单证", icon: FileText },
];

export default function FilterBar({
  zone,
  onZone,
  categories,
  onToggleCategory,
  counts,
  hideDone,
  onHideDone,
  doneCount,
}: Props) {
  const countFor = (z: ZoneFilter) => {
    if (z === "all") return counts.all;
    if (z === "blocked") return counts.blocked;
    if (z === "mine") return counts.mine;
    return counts.waiting;
  };

  return (
    <div
      id="block-info"
      className="mb-5 space-y-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)] sm:mb-6 sm:space-y-3 sm:p-4"
    >
      {/* Zone chips — horizontal scroll on mobile */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ZONES.map((z) => {
          const active = zone === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onZone(z.id)}
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-colors sm:gap-1.5 sm:px-3 ${
                active
                  ? "bg-[var(--primary-soft)] text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                  : "bg-[var(--surface-2)] text-[var(--mute)]"
              }`}
            >
              {z.emoji && <span aria-hidden>{z.emoji}</span>}
              <span className="sm:hidden">{z.short}</span>
              <span className="hidden sm:inline">{z.label}</span>
              <span className="tabular-nums opacity-70">{countFor(z.id)}</span>
            </button>
          );
        })}
      </div>

      {/* Category + done toggle */}
      <div className="flex flex-col gap-2 border-t border-[var(--line)] pt-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1.5 sm:pt-3">
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <span className="hidden shrink-0 self-center text-[11px] font-medium uppercase tracking-wide text-[var(--faint)] sm:mr-1 sm:inline">
            卡点类型
          </span>
          {CATS.map((c) => {
            const on = categories.has(c.id);
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onToggleCategory(c.id)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[12px] font-medium transition-colors sm:gap-1.5 sm:px-2.5 ${
                  on
                    ? "border-[var(--primary)]/40 bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "border-[var(--line)] text-[var(--mute)]"
                }`}
              >
                <Icon size={13} aria-hidden />
                <span className="sm:hidden">{c.short}</span>
                <span className="hidden sm:inline">{c.label}</span>
              </button>
            );
          })}
          {categories.size > 0 && (
            <button
              type="button"
              onClick={() => {
                for (const c of [...categories]) onToggleCategory(c);
              }}
              className="shrink-0 self-center text-[11px] text-[var(--faint)]"
            >
              清除
            </button>
          )}
        </div>

        {doneCount > 0 && (
          <button
            type="button"
            onClick={() => onHideDone(!hideDone)}
            className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium sm:ml-auto sm:w-auto sm:text-center ${
              hideDone
                ? "bg-[var(--surface-2)] text-[var(--faint)]"
                : "text-[var(--mute)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {hideDone
              ? `显示已勾选 (${doneCount})`
              : `隐藏已勾选 (${doneCount})`}
          </button>
        )}
      </div>
    </div>
  );
}
