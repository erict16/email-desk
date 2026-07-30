/**
 * Email Desk mark — three inbox trays + a signal notch.
 * Geometric, no photo. Works light/dark via currentColor.
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
      {/* tile */}
      <rect width="32" height="32" rx="8" fill="var(--mark-bg, #0f6b5c)" />
      {/* tray stack */}
      <path
        d="M8 11h16M8 16h16M8 21h11"
        stroke="var(--mark-fg, #f4fbf8)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* signal notch — ball / act */}
      <circle cx="23" cy="21" r="2.25" fill="var(--mark-dot, #f0c14a)" />
    </svg>
  );
}
