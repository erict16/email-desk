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

const ZONES: { id: ZoneFilter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "blocked", label: "仅卡点" },
  { id: "mine", label: "要我动" },
  { id: "waiting", label: "等对方" },
];

const CATS: {
  id: BlockerCategory;
  label: string;
  icon: typeof Users;
}[] = [
  { id: "customer", label: "客户", icon: Users },
  { id: "factory", label: "工厂/工程", icon: Factory },
  { id: "docs", label: "单证", icon: FileText },
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
      className="mb-4 space-y-2 sm:mb-5 sm:space-y-2.5"
      role="search"
      aria-label="筛选看板"
    >
      {/* Zone chips — filter mode (header pills = jump to section) */}
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ZONES.map((z) => {
          const active = zone === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onZone(z.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                active
                  ? "bg-[var(--primary-soft)] text-[var(--primary)] ring-1 ring-[var(--primary)]/25"
                  : "text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
              }`}
            >
              <span>{z.label}</span>
              <span className="tabular-nums opacity-65">{countFor(z.id)}</span>
            </button>
          );
        })}
      </div>

      {/* Category + done — secondary row, no card chrome */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1.5">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <span className="hidden shrink-0 self-center text-[11px] text-[var(--faint)] sm:mr-1 sm:inline">
            卡点
          </span>
          {CATS.map((c) => {
            const on = categories.has(c.id);
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onToggleCategory(c.id)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium transition-colors ${
                  on
                    ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "text-[var(--mute)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <Icon size={13} aria-hidden />
                <span>{c.label}</span>
              </button>
            );
          })}
          {categories.size > 0 && (
            <button
              type="button"
              onClick={() => {
                for (const c of [...categories]) onToggleCategory(c);
              }}
              className="shrink-0 self-center px-1.5 text-[11px] text-[var(--faint)] hover:text-[var(--mute)]"
            >
              清除
            </button>
          )}
        </div>

        {doneCount > 0 && (
          <button
            type="button"
            onClick={() => onHideDone(!hideDone)}
            className={`w-full rounded-md px-2 py-1.5 text-left text-[12px] font-medium sm:ml-auto sm:w-auto sm:text-center ${
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
