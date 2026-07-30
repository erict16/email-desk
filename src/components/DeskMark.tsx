/** Tray stack + red notch — ink tile (GitHub-dark logo language). */
export default function DeskMark({
  size = 24,
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
      <rect width="32" height="32" rx="6" fill="var(--mark-bg, #1f2328)" />
      <path
        d="M8 11h16M8 16h16M8 21h11"
        stroke="var(--mark-fg, #ffffff)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="23" cy="21" r="2.25" fill="var(--mark-dot, #cf222e)" />
    </svg>
  );
}
