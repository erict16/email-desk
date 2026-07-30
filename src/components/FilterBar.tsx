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

const ZONES: { id: ZoneFilter; label: string; emoji?: string }[] = [
  { id: "all", label: "All" },
  { id: "blocked", label: "仅看卡点", emoji: "🔥" },
  { id: "mine", label: "要我动", emoji: "⚡" },
  { id: "waiting", label: "等对方", emoji: "⏳" },
];

const CATS: {
  id: BlockerCategory;
  label: string;
  icon: typeof Users;
}[] = [
  { id: "customer", label: "Customer", icon: Users },
  { id: "factory", label: "Factory / Eng", icon: Factory },
  { id: "docs", label: "Documentation", icon: FileText },
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
      className="mb-6 space-y-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)] sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {ZONES.map((z) => {
          const active = zone === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onZone(z.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                active
                  ? "bg-[var(--primary-soft)] text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                  : "bg-[var(--surface-2)] text-[var(--mute)] hover:text-[var(--ink)]"
              }`}
            >
              {z.emoji && <span aria-hidden>{z.emoji}</span>}
              {z.label}
              <span className="tabular-nums opacity-70">{countFor(z.id)}</span>
            </button>
          );
        })}
        {doneCount > 0 && (
          <button
            type="button"
            onClick={() => onHideDone(!hideDone)}
            className={`ml-auto inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-medium ${
              hideDone
                ? "bg-[var(--surface-2)] text-[var(--faint)]"
                : "text-[var(--mute)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {hideDone ? `显示已勾选 (${doneCount})` : `隐藏已勾选 (${doneCount})`}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--line)] pt-3">
        <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-[var(--faint)]">
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
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                on
                  ? "border-[var(--primary)]/40 bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "border-[var(--line)] text-[var(--mute)] hover:border-[var(--primary)]/25"
              }`}
            >
              <Icon size={13} aria-hidden />
              {c.label}
            </button>
          );
        })}
        {categories.size > 0 && (
          <button
            type="button"
            onClick={() => {
              for (const c of [...categories]) onToggleCategory(c);
            }}
            className="text-[11px] text-[var(--faint)] hover:text-[var(--ink)]"
          >
            清除
          </button>
        )}
      </div>
    </div>
  );
}
