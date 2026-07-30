# Email Desk — design system

**Identity:** Executive productivity SaaS (Linear / Vercel / Raycast family)  
**Stack:** Next.js · Tailwind · Lucide · Framer Motion · Inter  
**Default theme:** Dark (`#0F172A` / cards `#1E293B`) · light toggle  

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

- Sticky **glass** header: brand · BJ/SST clock · search · counters · theme/share/export  
- **Meeting spotlight** banner  
- **Two columns (lg+):** left 要我动 + 等对方 · right pipeline Kanban/list  
- Mobile: stacked · pipeline horizontal scroll Kanban  

## Components

- Cards: `rounded-xl`, border, hover indigo ring + shadow, Framer enter  
- Title hover → Lucide Copy  
- Pipeline: 7-segment glow bar + stage badges  
- Search filters title/customer/people/tags/meta  

## Data

`content/board.md` only · ball-in-court IA unchanged  
