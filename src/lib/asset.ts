import { ASSET_V, siteBase } from "@/lib/brand";

/** Public asset path respecting Next.js basePath (GitHub Pages /email-desk). */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || siteBase() || "";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  const joiner = clean.includes("?") ? "&" : "?";
  return `${base}/${clean}${joiner}v=${ASSET_V}`;
}
