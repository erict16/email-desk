/** Shared brand / site constants for Email Desk. */

export const SITE_NAME = "Email Desk";
export const SITE_TITLE = "邮件跟进清单 · Email Desk";
export const SITE_DESCRIPTION = "Eric's weekday email follow-up board";

/** GitHub Pages project base (production only). */
export const REPO_BASE = "/email-desk";

/**
 * Cache-bust query for static icons/logo. Bump when any file under public/
 * icons or logo.png changes (e.g. girl11 → girl12).
 */
export const ASSET_V = "girl11";

export function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}

/** basePath for metadata URLs and asset() — empty in dev. */
export function siteBase(): string {
  return isProd() ? REPO_BASE : "";
}

export function siteOrigin(): string {
  return isProd()
    ? "https://erict16.github.io/email-desk/"
    : "http://localhost:3000";
}
