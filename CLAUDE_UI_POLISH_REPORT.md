# PAANX Beta v0.1 — UI Polish Report

Scope: **UI/UX + visual design only.** No backend, DB, admin, rider/seller apps,
payment gateway. Cart / search / checkout logic untouched. Product schema and
prices not edited. No images downloaded. PAANX-only isolation maintained.

---

## 1. UI changes made

- Replaced the old **emerald/green** theme with a **royal deep palette**
  (oxblood → mahogany → black-cherry → espresso) plus **champagne gold** accents
  on a **warm ivory** canvas. Green fully removed; no purple used.
- Introduced an **Apple-style glass system**: frosted ivory glass cards
  (`.glass`) and deep smoked-royal glass panels (`.glass-royal`) with blur,
  inner sheen highlights, and layered depth shadows.
- Added premium **button system**: `.btn-royal` (glossy oxblood gradient with a
  moving champagne sheen on hover, press-scale, disabled state) and `.btn-gold`
  (champagne CTA).
- Added tasteful **micro-interactions**: card hover-lift (`.card-lift`, desktop
  only), image zoom-on-hover, entrance `rise` animation, button press feedback,
  add-to-cart "Added ✓" confirmation state. All gated behind
  `prefers-reduced-motion`.
- Home hero rebuilt as a smoked-glass panel with depth glows, "Delhi NCR ·
  Private Beta" badge, champagne wordmark, premium tagline, dual CTAs, and glass
  stat cards.
- SEO: expanded `<head>` metadata (title, description, keywords, OpenGraph).

## 2. Design system colors

| Token | Hex | Use |
|-------|-----|-----|
| royal-500 | `#8f2f27` | oxblood mid |
| royal-700 | `#5a1719` | mahogany |
| royal-900 | `#350e10` | primary deep / buttons |
| royal-950 | `#230709` | espresso / headings |
| gold-200 | `#ead6a6` | badge/text on dark |
| gold-400 | `#cba75a` | champagne accent |
| gold-600 | `#96712f` | gold text on light |
| ivory | `#f6efe1` | warm background |
| cream | `#fbf6ec` | card base |
| foreground | `#241413` | ink text |

Background = warm ivory with subtle radial oxblood + champagne depth glows.
Tokens defined in `src/app/globals.css` via Tailwind v4 `@theme`, usable as
`bg-royal-900`, `text-gold-400`, `border-royal-900/10`, etc.

## 3. Pages polished

Home, Search, Category, Product detail, Cart, Checkout, Age gate, Legal,
Order success — all 9.

## 4. Components polished

Header, BottomNav (safe-area aware, active pill), ProductCard (compact glass,
18+/bestseller/limited/sold-out pills, sheen add button), ProductImage
(designed champagne-monogram fallback, not a broken placeholder), CategoryRail
(luxury glass pills), FloatingCart (royal glass), TrustStrip, SearchInput
(glass, gold focus ring), PriceBadge (bold price + strike MRP + % off),
AgeGate (royal glass modal, ARIA dialog), ProductGrid (designed empty state),
ProductPurchase.

## 5. Mobile improvements

- Sticky bottom nav with `env(safe-area-inset-bottom)` padding + active pill.
- Floating cart bar sits above the nav; thumb-reachable.
- Compact 2-col product grid; inputs ≥44px tap height; 16px base text (no
  iOS auto-zoom).
- Horizontal category rail scrolls with hidden scrollbar; no horizontal overflow.
- Search present in mobile header row.

## 6. Files changed

CSS: `src/app/globals.css`
Pages: `src/app/layout.tsx`, `page.tsx`, `search/page.tsx`,
`category/[slug]/page.tsx`, `product/[slug]/page.tsx`, `cart/page.tsx`,
`checkout/page.tsx`, `age-gate/page.tsx`, `legal/page.tsx`,
`order-success/page.tsx`
Components: `Header`, `BottomNav`, `ProductCard`, `ProductImage`,
`CategoryRail`, `FloatingCart`, `TrustStrip`, `SearchInput`, `PriceBadge`,
`AgeGate`, `ProductGrid`, `ProductPurchase`

Not touched: `CartProvider.tsx`, `lib/search.ts`, `lib/format.ts`, data files
(`data/products.ts`, `data/categories.ts`) — logic/data owned elsewhere.

## 7. Build result

- `npm run lint` → clean (no errors/warnings).
- `npm run build` → **success**, Next.js 16.2.10, TypeScript passed, all 10
  routes generated (`/`, `/age-gate`, `/cart`, `/category/[slug]`, `/checkout`,
  `/legal`, `/order-success`, `/product/[slug]`, `/search`, `/_not-found`).

### Concurrency note
During this pass the **data layer was refactored in parallel** (a separate
process replaced `data/products.ts` with the researched catalog and split
category helpers into a new `data/categories.ts`). UI code was aligned to the
resulting export surface:
- `stock` enum is now `"in_stock" | "limited" | "out_of_stock"` (ProductCard /
  product page use `"limited"`).
- `mrp` is optional — `PriceBadge` guards for it.
- Fixed a pre-existing break: category page used removed `category.count`; now
  derives count from `getProductsByCategory(slug).length`.
- Home secondary CTA repointed from removed `paan-kits` slug to
  `paan-ingredients`.

---

# Second Pass — Ultra-Luxury Escalation

Goal: push from "clean premium" to "investor-demo, fashion-house" luxury.
Routes, build, cart/search/checkout/age-gate logic all preserved. PAANX-only.

## A. Exact luxury upgrades made

- **Editorial serif type system.** Added **Fraunces** (display serif, incl.
  italic) as `--font-serif` + `.font-display` utility. Applied to the wordmark,
  hero headline, every page `<h1>/<h2>`, product titles and card names — instant
  couture/editorial voice vs. the previous all-sans look.
- **Richer material system** in `globals.css`:
  - `.glass` / `.glass-royal` rebuilt with a **top champagne hairline** (`::before`),
    inner top-sheen + inner shadow, deeper lacquer shadows, radial oxblood glow
    inside the royal variant.
  - New `.lacquer` solid deep panel, `.rule-gold` hairline divider, `.sheen-sweep`
    looping glass shimmer, animated `.text-champagne` (flowing gold shimmer).
  - Buttons upgraded: `.btn-royal` now has bronze rim + inner bevel + gloss sweep;
    `.btn-gold` is a real champagne-metal gradient with white sheen sweep.
  - Added `bronze`, `cigar`, `pearl`, `obsidian` tokens; deepened `royal-950`.
- **Hero rebuilt** (see C).
- **Home = merchandised storefront** (see below).
- **Category-tinted image fallback** (see product-card notes).

## B. Colors / material system used

Deep oxblood `#8f2f27` → mahogany `#5a1719` → black-cherry `#451315` →
espresso `#1e0708`; champagne gold `#cba75a`/`#f7edd4`; smoked bronze
`#8a5f30`/`#a9793f`; cigar `#4a2c1c`; warm ivory `#f4ecdb`, cream `#fbf6ec`,
pearl `#fdfaf3`, obsidian `#150a0a`. No green/purple. Surfaces = frosted glass
+ lacquer over ivory with radial oxblood/champagne/cigar depth glows and a
faint grain dot-texture in the hero.

## C. Hero improvements

- Layered smoked-glass panel (`rounded-[2rem]`, blur, oxblood radial, dot-grain
  overlay, two colored depth-glow orbs).
- Two-line **serif headline** — champagne "PAANX" + italic "the paan lounge,
  delivered." — dramatic hierarchy.
- Refined beta pill (glowing gold dot), stronger supporting copy, dual CTAs
  (champagne primary + glass ghost), compact glass stat trio with serif numerals.

## D. Product card improvements

- Collectible framing: inset rounded **image window** with border + inset
  highlight + glossy top glare; image scales 1.06 on hover.
- Serif product name, tighter brand eyebrow, refined price block, uppercase
  tracked add button.
- Elegant stock/■bestseller pills (bestseller now a gold-gradient chip).
- `.card-lift` deepened (−5px, gold border, richer shadow).
- **Image fallback** redesigned: cream field + **per-category tint**, concentric
  champagne medallion rings, gradient monogram medallion, "PAANX" caption —
  reads as intentional packaging, not an empty box.

## E. Mobile improvements

- Weightier sticky glass header (blur-2xl, champagne hairline, serif wordmark).
- Category rail = sculpted glass pills with gold status dot; horizontal scroll,
  no overflow.
- Larger tap targets (44–48px), 16px+ base text, safe-area bottom nav retained.
- Hero + section rhythm scale down cleanly; 2-col card grid stays legible.

## F. Interaction improvements

- Animated champagne shimmer on wordmark; gloss sweep on both button types;
  hover lift + image zoom; `.sheen-sweep` available for feature surfaces.
- All motion still gated behind `prefers-reduced-motion` (shimmer, sweeps, lifts
  disabled).

## G. Build result (second pass)

- `npm run lint` → clean.
- `npm run build` → **success**, Next.js 16.2.10, TypeScript passed, all 10
  routes generated. Fonts loaded via `next/font` (self-hosted, `display:swap`,
  no layout-shift).

---

# Third Pass — Dark iOS-Glass Redesign (palette-driven)

Full theme pivot per attached palette + feedback: went **dark**, added a real
scroll-reveal motion engine, and rebuilt surfaces as true iOS frosted glass.

## Palette (exact hexes from the reference)

| Name | Hex | Role |
|------|-----|------|
| Carbon powder | `#101211` | app background |
| Plum wine | `#48252F` | signature accent / primary surfaces (`royal-700`) |
| Golden sandlewood | `#857861` | muted accent / eyebrows (`gold-500`) |
| Almond light | `#E7D4BB` | primary text + light accents (`gold-200`, foreground) |

Tokens repointed in `globals.css`: `royal-*` = plum-wine ramp, `gold-*` =
sandlewood→almond ramp, `--background` = carbon, `--foreground` = almond. Body
uses carbon with plum + sandlewood radial cinematic glows. No green, no purple,
no white blandness.

## True iOS glass

`.glass` / `.glass-royal` rebuilt as genuine frosted panels: low-alpha almond
fill, `backdrop-blur(26–28px) saturate(170–180%)`, thin bright top-edge
highlight, inner shadow for depth — the Apple control-center / lock-screen look
over the dark carbon canvas. Header + bottom nav are `backdrop-blur-2xl`
translucent bars with a champagne hairline.

## Motion — no more static site

- New **`Reveal.tsx`** (IntersectionObserver): every home section + every
  product card fades/lifts/pops in on scroll, with per-item stagger (70ms).
- **Floating ambient orbs** in the hero (`float-slow`), **glass sheen sweep**
  across the hero, animated **champagne shimmer** wordmark, card hover-lift,
  button gloss sweep, add-to-cart confirm.
- All motion respects `prefers-reduced-motion` (reveals resolve to visible,
  animations disabled).

## Reskinned

Home (hero + 5 merchandised rows), Search, Category, Product, Cart, Checkout,
Legal, Age gate, Order success. Components: Header, BottomNav, ProductCard,
ProductImage (dark medallion fallback with per-category tint), CategoryRail,
TrustStrip, FloatingCart, SearchInput, PriceBadge, ProductGrid (reveal-wrapped),
ProductPurchase.

## Build result (third pass)

- `npm run lint` → clean.
- `npm run build` → **success**, Next.js 16.2.10, TypeScript passed, all 10
  routes generated.
- Live dev preview was unstable in this environment (port 3000 already held by
  another node process; preview renderer dropped the connection). Production
  build is the source of truth for compile/type correctness.

---

# Fourth Pass — Sharp/Matte fixes (direct feedback)

Addressed six specific complaints; verified against the live production server.

1. **Font was AI-slop serif.** Dropped Fraunces (italic serif = the tell).
   Display font is now **Archivo** (sharp grotesk), tight tracking, used matte.
2. **"Stop the shine."** Removed the champagne shimmer animation, glass edge
   highlight lines, button gloss sweeps, image glare overlays, and white inset
   highlights. Surfaces are now matte frosted glass (blur only, no gloss).
   Verified: `champagne-flow` and `sheen-sweep` return 0 matches in shipped CSS.
3. **Hero header too thick + small.** Rebuilt: `PAANX` at `text-6xl md:text-[7.5rem]`,
   weight 600 (not 900), uppercase, tight tracking; tagline is a separate thin
   line (no italic). Big and sharp, not thick-and-small.
4. **Boxes too round.** One sharp radius system: `rounded-[4px]` for cards /
   panels / buttons / inputs, `rounded-[3px]` for chips. No more `2rem` blobs.
5. **Product images zoomed/cropped (Sprite).** `object-cover` → `object-contain`
   with padding + backdrop, so the whole product is visible. Verified on
   `/product/sprite-750ml`.
6. **Empty desktop side-gutters.** Added `SideOrnament` — a hand-drawn
   **Rajasthani jharokha / jali** motif (ogee arches + paisley/ambi) as fixed
   low-opacity sandlewood line-work rails on `xl+` screens, filling the gutters.

Also: removed em-dashes from metadata (design-taste rule); container tightened
to `max-w-6xl` so the ornament rails have room.

Build: `npm run lint` clean, `npm run build` success (all 10 routes). Verified
live on the production server (`next start`): served HTML/CSS contain the carbon
theme, Archivo, the jali ornament, sharp radii, matte surfaces, and zero
em-dashes.

## 8. Remaining visual limitations

- **Product images are placeholders.** `image` is empty for all catalog items,
  so every card shows the designed monogram fallback. Real pack shots (see
  `public/products/README.md` workflow) will complete the premium look.
- No skeleton loaders (catalog is static/local, so not needed yet); add when a
  real async data source lands.
- Dark mode not implemented (light royal theme only) — out of scope for beta.

_Resolved in second pass:_ display serif (Fraunces) now drives headings/wordmark;
`priceType` renders a clean label ("Verified MRP" / "Beta price") on the product
page.
