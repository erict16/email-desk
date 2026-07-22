/** Fast smooth scroll (~280ms). Prefer over CSS scroll-behavior for snappier feel. */
export function smoothScrollTo(
  target: HTMLElement | "top",
  durationMs = 280,
): void {
  if (typeof window === "undefined") return;

  const startY = window.scrollY || window.pageYOffset;
  let endY = 0;

  if (target === "top") {
    endY = 0;
  } else {
    const header = document.querySelector("header.sticky") as HTMLElement | null;
    const offset = (header?.offsetHeight ?? 56) + 8;
    const rect = target.getBoundingClientRect();
    endY = startY + rect.top - offset;
  }

  const distance = endY - startY;
  if (Math.abs(distance) < 1) return;

  const start = performance.now();
  // easeOutCubic — quick settle
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    window.scrollTo(0, startY + distance * ease(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function scrollToHash(hash: string, durationMs = 280): void {
  if (!hash || hash === "#" || hash === "#top") {
    smoothScrollTo("top", durationMs);
    return;
  }
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (el) smoothScrollTo(el, durationMs);
  else smoothScrollTo("top", durationMs);
}
