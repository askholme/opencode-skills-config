---
name: float-pdf
description: Produce printable, emailable landscape-A4 PDF documents in the Float brand (Reify ApS's AI-native consulting brand) — proposals, offers/quotes ("forslag", "tilbud"), one-pagers, signed agreements with signature blocks, and standard-terms ("standardvilkår") appendices. Same dark-ink + Fraunces + mint/tide/coral look as the Float web deck, but laid out as fixed 297x210mm pages and rendered to PDF with Playwright/Chromium. Use this skill whenever the user wants a Float/Reify PDF proposal or offer, a print-ready or downloadable client document, a quote with a price card and signature page, or asks to "turn this into a PDF" / "make a printable version" of Float-styled content. Pairs with the float-deck skill (which builds the scrollable web version).
---

# Float PDF

Build Float-branded **landscape-A4 PDF documents**: proposals, offers/quotes,
agreements, and standard-terms appendices. Same brand system as the Float web
deck (near-black ink, Fraunces serif, mint/tide/coral, faint grain, wave logo),
but each "slide" is a fixed `297mm × 210mm` page that page-breaks cleanly and
renders to a real PDF via headless Chromium.

This is the companion to **float-deck**. If the user wants something to scroll
through / present on screen, use float-deck. If they want a file to print,
email, or sign, use this.

## Workflow

1. **Read the brand.** Skim `../float-deck/references/brand.md` if available (the
   colour tokens, type rules, one-italic-accent rule, grain, logo, and voice are
   identical). `assets/page.css` already embeds the tokens, so the PDF skill is
   self-contained if the deck skill isn't present.
2. **Scaffold from the template.** Copy `assets/page-template.html` and
   `assets/page.css` into the project (keep them together; the template links
   `page.css` relatively). The template ships four representative pages —
   situation (info cards), process (3 steps), pricing (anchor price card), and
   accept/signature — plus pointers for a terms appendix.
3. **Fill in real content in the client's language** (usually Danish). One idea
   per page, vertically centred. Every heading gets exactly one
   `<em class="accent">` italic word and an eyebrow above it. Update each page's
   `footer-meta` page number (`NN / TOTAL`) and section name.
4. **Per-page logo lockup needs unique SVG ids.** Each page duplicates the logo
   lockup; give every copy's `clipPath`/`linearGradient` unique ids
   (`float-circle-1/-2/-3…`, `float-grad-1/-2…`) so refs don't collide across
   pages. The template already does this — follow the pattern when adding pages.
5. **Add a terms appendix if needed.** For proposals/offers that reference
   "Reify ApS' standardvilkår", append the three terms pages from
   `references/terms.md` (the canonical §§ 1–12 markup, laid out with
   `.page--terms`). Keep the legal wording verbatim unless asked otherwise.
6. **Preview in a browser** (optional but recommended): the live SVG grain shows
   here. `python -m http.server 8000` → open the HTML.
7. **One-time renderer setup** (see "Setup" below). Skip if already done in this
   skill copy.
8. **Render the PDF:**
   ```sh
   node scripts/render-pdf.mjs path/to/document.html
   ```
   This loads the page, swaps the live SVG grain for the baked PNG tile (cheaper
   to render → snappier PDF), waits for fonts, and writes
   `document.pdf` at exactly 297×210mm with backgrounds printed. Flags:
   - `node scripts/render-pdf.mjs in.html out.pdf` — explicit output path.
   - `--no-grain` — disable grain entirely (lightest PDF).
   - `--grain-png <tile.png>` — use a specific baked tile.
   Consider rendering both a grained and a `--no-grain` variant when the client
   may further compress/print the file.

## What's bundled

```
float-pdf/
├── SKILL.md
├── assets/
│   ├── page.css            # Landscape-A4 layout + brand tokens + all print components.
│   ├── page-template.html  # 4-page starter (situation / process / pricing / signature).
│   └── grain-tile.png      # Pre-baked grain tile used at render time.
├── scripts/
│   ├── package.json        # Pins playwright; `npm run setup` installs it + Chromium here.
│   ├── render-pdf.mjs      # HTML -> PDF (Playwright). Bakes grain in, sets A4 landscape.
│   └── bake-grain.mjs      # Regenerate grain-tile.png (only if noise params change).
└── references/
    └── terms.md            # Reify ApS standardvilkår §§ 1–12, as 3 ready-to-paste terms pages.
```

## Page components (in page.css)

Compose pages from these — don't write new CSS unless genuinely needed:
- **`.page`** — the 297×210mm page shell with grain + radial-gradient background.
  `.page--terms` is the fine-print variant (top-aligned, 2-column).
- **`.logo-lockup`** — absolute top-right Float logo + wordmark (static for print).
- **Type:** `.eyebrow` (+`--tide`/`--coral`), `h1/h2/h3`, `em.accent`, `.lede`, `.caption`.
- **`.card-grid` + `.info-card`** (+`--tide`/`--alert`) — 2-up cards with
  `.card-tag`, `.prio-pill`, and a `.metric-row` of big Fraunces numbers.
- **`.steps` + `.step`** — 3-up numbered process with `.step-num`, `.step-list`.
- **Pricing:** `.price-card` (+`--anchor`/`--upgrade`), `.price-amount` with
  `.price-was`/`.price-now`, `.price-discount`, `.feature-list`. `.price-solo`
  centres a single card.
- **`.scope-note`** — mint left-border callout.
- **Signature:** `.sign-grid` + `.sign-card` (+`--counter`) with `.sign-field`s.
- **`.footer-meta`** — left brand line + right page number, on every page.

## Setup (one-time, self-contained)

The renderer uses **Playwright + headless Chromium** — Chromium is required
because the Float look relies on CSS the print engines can't reproduce
(`mix-blend-mode` grain, SVG `feTurbulence`, layered radial gradients,
OpenType features). Don't substitute WeasyPrint/wkhtmltopdf — they degrade the
design.

Everything installs **inside the skill's own `scripts/` folder**, so the skill
is portable and needs no external project. `scripts/package.json` pins the
version (`playwright@^1.58.2`). Run once per machine/skill copy:

```sh
cd scripts
npm run setup        # = npm install && npx playwright install chromium
```

This creates `scripts/node_modules/` (where the `.mjs` files resolve
`playwright` from) and downloads the Chromium binary. After that, run the
renderer from the skill root as usual:

```sh
node scripts/render-pdf.mjs path/to/document.html
```

Notes:
- **Check before installing.** If `scripts/node_modules/playwright` already
  exists, setup is done — skip it. First-time Chromium download is ~100–150 MB.
- **Where Chromium lives.** `npx playwright install chromium` caches the browser
  under `~/.cache/ms-playwright` (Linux) / `~/Library/Caches/ms-playwright`
  (macOS), shared across projects — so it's usually a fast no-op on subsequent
  installs even in a fresh skill copy.
- **Offline / restricted environments.** If `npm install` or the Chromium
  download is blocked, point the scripts at any existing Playwright install by
  running from a directory that has `playwright` in scope, or set
  `PLAYWRIGHT_BROWSERS_PATH` to a pre-downloaded browser cache. As a last
  resort, an existing system Chrome can be used via Playwright's `channel`
  option, but the default download is strongly preferred for fidelity.
- `scripts/node_modules/` should be git-ignored if the skill is committed.

## Hard rules (same brand discipline as float-deck)

- One italic mint `<em class="accent">` per heading; eyebrow above every heading.
- Mint dominant; tide only for a real secondary track/option; coral ≤2 per page.
- No pure white, no bold headings, no emoji. Fraunces 300 headings.
- Grain subtle (baked at ~0.045 opacity in the PDF).
- Each page = one idea, vertically centred, generous margins.
- Unique SVG ids per page for the logo lockup.
- Render at 297×210mm with `printBackground: true` (render-pdf.mjs handles this).
- Keep standardvilkår wording verbatim unless explicitly changed.
