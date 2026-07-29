/** Normalize card titles for cross-list linking (triage ↔ order). */
export function titleKey(title: string): string {
  return title.trim().replace(/\s+/g, " ").toLowerCase();
}
