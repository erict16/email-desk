import { titleKey } from "@/lib/title-key";

const KEY = "email-desk-local-done-v1";

export function loadLocalDone(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function saveLocalDone(done: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...done]));
  } catch {
    /* ignore */
  }
}

export function itemDoneKey(title: string): string {
  return titleKey(title);
}
