/**
 * @deprecated Replaced by FocusStrip in Task 5 (Today / Pipeline / Later IA).
 * Kept only so old imports fail loudly if reintroduced without intent.
 * Do not use — import FocusStrip instead.
 */
export type StatTone = "urgent" | "follow" | "orders";

export type StatItem = {
  key: string;
  id: string;
  label: string;
  tone: StatTone;
  value: number;
};

/** @deprecated Use FocusStrip */
export default function StatsNav(_props: { stats: StatItem[] }) {
  return null;
}
