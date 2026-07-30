### Task 9: Hub downloads + products polish

**Files:**
- Modify: `~/Github/huaming-hub/src/components/DownloadExplorer.tsx`
- Modify: `~/Github/huaming-hub/src/components/DownloadsPage.tsx`
- Modify: `~/Github/huaming-hub/src/components/ProductsPage.tsx`
- Modify: `~/Github/huaming-hub/src/components/SiteFooter.tsx` (if needed)

**Requirements:**
- Model / code cells: `font-family: var(--font-mono)`; tabular feel
- Sticky search bar if not already
- Products: family groups; mono for type codes; no new routes
- Keep official PDF links behavior

- [ ] **Step 1: Apply mono + spacing polish on table/list.**

- [ ] **Step 2: Build**

```bash
cd ~/Github/huaming-hub && npm run build && npm run build:gh
```

Expected: both succeed (`build:gh` sets basePath).

- [ ] **Step 3: Commit**

```bash
git add src/components/DownloadExplorer.tsx src/components/DownloadsPage.tsx src/components/ProductsPage.tsx src/components/SiteFooter.tsx
git commit -m "style(hub): mono model column and catalogue polish"
```

---
