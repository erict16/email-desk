/** Public asset path respecting Next.js basePath (GitHub Pages /email-desk). */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  // cache-bust when logo updates
  const v = "girl9";
  const joiner = clean.includes("?") ? "&" : "?";
  return `${base}/${clean}${joiner}v=${v}`;
}
