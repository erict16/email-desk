# Email Desk — design system

**Family with Huaming Hub** (same cold paper + cobalt).  
**Job:** scan 要我动 / 等对方 / 管线 without chrome noise.

---

## Tokens (Hub-aligned)

| Role | Token | Hex |
|------|-------|-----|
| Page | `--bg` / `--paper` | `#f5f7fa` |
| Surface | `--surface` / `--card` | `#ffffff` |
| Soft | `--paper-2` | `#eef2f6` |
| Ink | `--ink` | `#0f2438` |
| Mute | `--mute` | `#4a5d70` |
| Faint | `--faint` | `#738496` |
| Line | `--line` | `#dce3eb` |
| Accent | `--pipe` / `--accent` | `#0a4a82` |
| Accent soft | `--action-bg` / `--pipe-soft` | `#e8f0f7` |
| Action text | `--action-ink` | `#0a4a82` |
| Urgent | `--urgent` | `#b42318` |
| Urgent soft | `--urgent-soft` | `#fef3f2` |
| Wait bg | `--wait-bg` | `#eef2f6` |
| Wait ink | `--wait-ink` | `#4a5d70` |
| Radius | `--radius` | `6px` |
| Measure | `--measure` | `40rem` |

Accent ≤ 5% of UI. Surfaces = white + 1px line + 6px radius only. No heavy shadows.

---

## Spacing (8px grid — locked)

| Token | Value | Use |
|-------|-------|-----|
| `--gap-stack` | `8px` | Inside card, related lines |
| `--gap-block` | `12px` | Title block → spine |
| `--gap-card` | `10px` | Between cards in a list |
| `--gap-lane` | `28px` | Between order stage groups |
| `--gap-section` | `36px` | Between major board sections |
| `--pad-card-x` | `16px` | Card horizontal |
| `--pad-card-y` | `14px` | Card vertical |
| Main top | `24px` | Below header |
| Section head → list | `16px` | After heading |

---

## Type

System UI stack (CJK-safe). No display Google fonts.

| Role | Size | Weight |
|------|------|--------|
| Page title | 20px | 600 |
| Section | 15px | 600 |
| Stage label | 13px | 600 |
| Card title | 15px | 600 |
| Spine / body | 13px | 400–500 |
| Meta / people | 12px | 400 |
| Tag | 11px | 500 |
| Focus count | 22px | 600 |

---

## Chrome

- **Header:** sticky white, hairline, lucide Inbox + Email Desk; ghost 分享/导出
- **Footer:** one line on page canvas
- **Focus:** compact counter row (not tall dashboard tiles)
- **Stage head:** one line — `label · hint` with real gap + count right
- **Cards:** spine is hero line; meta ≤ 1–2 lines

---

## IA

要我动 · 等对方 · 管线 · 稍后 · 会  
`ball` / `wait` · searchable titles · FYI off board  
