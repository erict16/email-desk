# Email Desk — design system

**Identity:** Executive productivity SaaS (Linear / Vercel / Raycast family)  
**Stack:** Next.js · Tailwind · Lucide · Framer Motion · Inter  
**Default theme:** Dark (`#0F172A` / cards `#1E293B`) · light toggle  
**Chrome language:** Chinese-first (filters, toasts, actions)

---

## Color

| Role | Dark | Light |
|------|------|-------|
| Page | `#0F172A` | `#F1F5F9` |
| Surface | `#1E293B` | `#FFFFFF` |
| Primary | Indigo `#6366F1` / `#818CF8` | same family |
| 要我动 | Amber `#F59E0B` | same |
| 等对方 | Cyan `#06B6D4` | same |
| P0 rail | Red `#EF4444` | same |
| Stages | slate → indigo → violet → emerald → cyan | badges |

## Layout

- Sticky **glass** header: brand · BJ/SST clock · search · **jump** counters · theme/share/export  
  - Jump chips = scroll to `#mine` / `#wait` / `#pipeline` / `#later` (稍后 = muted, not pipe indigo)
- Quiet page title (not a second product chrome) + optional meetings card
- **Filter row** (not a heavy card): zone filter · 卡点类型 · hide-done — separate job from header jumps
- **Two columns (lg+):** left 要我动 + 等对方 · right pipeline Kanban/list  
- Mobile: stacked · pipeline list default, optional Kanban  
- Skip link → `#main`

## Components

- Cards: `rounded-xl`, border, **quiet hover** (border + shadow only; no lift/translate)  
- Title click → copy for email search (toast CN)  
- Spine: 待办 · / 等待 · / 卡点 ·  
- Actions: 复制简报 (not Share Brief)  
- Pipeline: 7-segment bar + stage badges; `motion-safe` ping on current  
- Search filters title/customer/people/tags/meta  

## Data

`content/board.md` only · ball-in-court IA unchanged