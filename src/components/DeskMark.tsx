import { Inbox } from "lucide-react";

/**
 * Brand mark = lucide-react Inbox (not hand-drawn).
 * Matches GitHub/Linear-style app chrome: known icon set, currentColor.
 */
export default function DeskMark({
  size = 20,
  className = "",
  title = "Email Desk",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center text-[var(--pipe)] ${className}`}
      title={title}
      aria-hidden={title ? undefined : true}
    >
      <Inbox
        size={size}
        strokeWidth={2}
        absoluteStrokeWidth={false}
        aria-hidden
      />
    </span>
  );
}
