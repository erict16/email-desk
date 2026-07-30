/**
 * Email Desk mark — tray stack + red signal notch.
 * Ink-black tile; only accent is the urgent dot.
 */
export default function DeskMark({
  size = 28,
  className = "",
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="7" fill="var(--mark-bg, #18181b)" />
      <path
        d="M8 11h16M8 16h16M8 21h11"
        stroke="var(--mark-fg, #fafafa)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="23" cy="21" r="2.25" fill="var(--mark-dot, #dc2626)" />
    </svg>
  );
}
