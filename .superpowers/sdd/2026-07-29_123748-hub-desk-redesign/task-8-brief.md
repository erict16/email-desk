### Task 8: Hub i18n + Home IA

**Files:**
- Modify: `~/Github/huaming-hub/src/lib/i18n.ts`
- Modify: `~/Github/huaming-hub/src/components/HomePage.tsx`
- Modify: `~/Github/huaming-hub/src/components/SiteHeader.tsx` (nav labels order already Docs/Products — verify)

**Interfaces:**
- Home structure (no howto list):

```tsx
// 1. kicker + h1 + lead + primary CTAs (Docs primary, Products secondary, Selector secondary external)
// 2. Docs band: title + count + link /downloads
// 3. Series preview: map productSeries compact rows → /products
// 4. Selector one-line tool strip external
// Remove steps 01/02/03 howto section entirely
```

- Update `en.home` / `zh.home` strings: shorter lead; remove `howTitle`/`how1*` usage (can leave keys unused or delete).

- Copy pass: plain, no marketing hype (avoid-ai-writing).

- [ ] **Step 1: Update i18n strings** for docs-first home.

- [ ] **Step 2: Rewrite HomePage.tsx** per structure above. Import `productSeries` and `allDocuments` as today.

- [ ] **Step 3: Build EN + ensure zh pages still render**

```bash
cd ~/Github/huaming-hub && npm run build
# check out/index.html and out/zh/index.html exist
ls out/index.html out/zh/index.html out/downloads/index.html
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n.ts src/components/HomePage.tsx src/components/SiteHeader.tsx
git commit -m "feat(hub): docs-first home IA without howto block"
```

---
