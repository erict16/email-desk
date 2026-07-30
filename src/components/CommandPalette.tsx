"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import { Search, CornerDownLeft } from "lucide-react";
import { matchesQuery } from "@/lib/filter-board";

export type PaletteEntry = {
  item: BoardItem;
  zone: "mine" | "waiting" | "later" | "order";
  zoneLabel: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  entries: PaletteEntry[];
  onSelect: (entry: PaletteEntry) => void;
  onCopy: (title: string) => void;
};

export default function CommandPalette({
  open,
  onClose,
  entries,
  onSelect,
  onCopy,
}: Props) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const list = entries.filter((e) => matchesQuery(e.item, q));
    return list.slice(0, 40);
  }, [entries, q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setIdx(0);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[idx]) {
        e.preventDefault();
        onSelect(filtered[idx]);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, idx, onClose, onSelect]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[600] flex items-end justify-center bg-black/50 px-0 pt-0 backdrop-blur-sm sm:items-start sm:px-4 sm:pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex max-h-[min(88dvh,100%)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-hover)] sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[var(--line)] sm:hidden" />
            <div className="flex items-center gap-2 border-b border-[var(--line)] px-3">
              <Search size={16} className="text-[var(--faint)]" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索 PO、联系人、状态…"
                enterKeyHint="search"
                className="h-12 w-full bg-transparent text-[16px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)] sm:text-[14px]"
              />
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-md px-2 py-1 text-[12px] font-medium text-[var(--mute)] sm:hidden"
              >
                关闭
              </button>
              <kbd className="hidden rounded border border-[var(--line)] px-1.5 py-0.5 text-[10px] text-[var(--faint)] sm:inline">
                esc
              </kbd>
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1">
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center text-[13px] text-[var(--faint)]">
                  无匹配项
                </li>
              )}
              {filtered.map((e, i) => (
                <li key={`${e.zone}-${e.item.title}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(e);
                      onClose();
                    }}
                    onMouseEnter={() => setIdx(i)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13px] ${
                      i === idx
                        ? "bg-[var(--primary-soft)] text-[var(--ink)]"
                        : "text-[var(--ink)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {e.item.title}
                    </span>
                    <span className="shrink-0 text-[11px] text-[var(--faint)]">
                      {e.zoneLabel}
                    </span>
                    <button
                      type="button"
                      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] text-[var(--primary)] hover:bg-[var(--surface)]"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onCopy(e.item.title);
                      }}
                    >
                      复制
                    </button>
                    {i === idx && (
                      <CornerDownLeft
                        size={12}
                        className="shrink-0 text-[var(--faint)]"
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-[var(--line)] px-3 py-2 text-[10px] text-[var(--faint)]">
              ↑↓ 选择 · Enter 跳转 · 复制标题用于邮箱搜索
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
