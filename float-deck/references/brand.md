# Float brand guidelines

Float is the AI-native strategy & implementation brand of **Reify ApS**. Everything
Float produces sits on near-black "ink", uses a Fraunces display serif, and is
accented by a small, disciplined palette of mint / tide / coral. The feel is
calm, premium, editorial — closer to a design studio's deck than a corporate
slide template. Restraint is the brand: one italic accent per heading, one
texture, generous whitespace.

---

## 1. Colour tokens

These are the canonical CSS custom properties. They live at the top of `deck.css`
and are duplicated inline in print/PDF documents. Never hardcode hex values in
markup — always reference the variable.

```css
:root {
  /* Palette */
  --ink:         #0A0E14;   /* page background (near-black, slightly blue) */
  --ink-soft:    #11161E;   /* card / panel background */
  --ink-line:    #1C232E;   /* borders, rules, dividers */
  --cream:       #F2EDE3;   /* primary text, headings */
  --cream-soft:  #E8E1D2;   /* body copy */
  --cream-dim:   #A39E91;   /* muted metadata, captions, labels */
  --mint:        #B8F2D6;   /* PRIMARY accent — the Float signature */
  --mint-bright: #6BE3A8;   /* rare brighter mint for emphasis */
  --tide:        #7AA8E0;   /* SECONDARY accent — blue, "process" track */
  --coral:       #FF8B6B;   /* WARNING / caution / "here most people stop" */

  /* Semantic aliases (use these in component CSS) */
  --bg: var(--ink);  --text: var(--cream);  --accent: var(--mint);
  --secondary: var(--tide);  --warning: var(--coral);
  --rule: var(--ink-line);  --card-bg: var(--ink-soft);
}
```

### How to use colour
- **Mint is the brand.** It is the default accent: italic heading words, list
  bullets (`/`), badges, the logo, primary borders. Use it most.
- **Tide** is the *second* voice — use it to distinguish a parallel/secondary
  track or an "upgrade" option, never decoratively. If mint says "this", tide
  says "the other thing".
- **Coral is a spotlight, not a colour.** Reserve it for caution, a revision
  flag, a single "here's the catch" note. If coral appears more than once or
  twice per page, it has lost its meaning.
- Body copy is `--cream-soft`; headings are `--cream`; metadata/labels are
  `--cream-dim`. Pure white is never used.

### Accent backgrounds
Tint cards/notes with the accent at very low alpha over ink, e.g.
`background: rgba(184, 242, 214, 0.06)` (mint) or `rgba(122, 168, 224, 0.03)`
(tide) or `rgba(255, 139, 107, 0.05)` (coral). Pair with a 2px top or left
border in the same hue at higher alpha.

---

## 2. Typography

Three families, each with one job. Loaded from Google Fonts.

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

| Family | Variable | Role |
|---|---|---|
| **Fraunces** (300, 400 + italics) | `--font-display` | All headings (h1–h4), big numbers, accent words, hero subtitles. Light weight, tight tracking. |
| **Inter** (300/400/500) | `--font-body` | Body copy, list items, descriptions. Never on the hero face. |
| **JetBrains Mono** (400/500) | `--font-mono` | Eyebrows, labels, captions, badges, footer meta, page numbers. Always UPPERCASE + tracked. |

Base `html` carries `font-feature-settings: "ss01", "cv11"`. Numeric content
adds `"tnum"` + `font-variant-numeric: tabular-nums` (the `.tabular-nums` class).

### Type rules
- **One italic accent word per heading.** Wrap it in `<em class="accent">` —
  renders mint + Fraunces italic. This is the single most recognisable Float
  move. Don't put two accents in one heading; don't skip it on the main heading.
- Headings: `font-weight: 300`, `letter-spacing: -0.03em` to `-0.04em`,
  line-height ~0.95–1.0. Big and airy, not bold.
- Eyebrows: `--font-mono`, `~0.7rem`, `letter-spacing: 0.20em`, uppercase,
  `--cream-dim` (or `--tide`/`--coral` variant). Always sits above the heading.
- Lists use a mint `/` marker (not bullets/checkmarks) via `::before`.

---

## 3. Texture — grain overlay

Every Float surface carries a faint film grain. It's what stops the dark
background looking flat/digital.

- **Web:** add `class="grain"` to `<body>`. `deck.css` paints a fixed
  `feTurbulence` SVG noise at `opacity: 0.06`, `mix-blend-mode: screen`.
- **Print/PDF:** the live SVG filter is expensive to repaint, so the PDF
  pipeline swaps it for a pre-baked PNG tile (`float-pdf/assets/grain-tile.png`)
  at `opacity ~0.045`, `mix-blend-mode: normal`. Same look, cheap to render.

Keep grain subtle — it should be felt, not seen. If you can clearly see noise,
it's too strong.

---

## 4. Logo

The Float mark is a thin-ring circle with a horizon of two drifting waves
(mint→tide gradient). Asset: `float-deck/assets/float-logo.svg`.

- Always pair the mark with the **"Float" wordmark** set in Fraunces 300, mint,
  `letter-spacing: -0.02em`, sat to the right of the mark with `gap: ~0.6rem`.
- On web, the waves drift via `.float-wave--back/.float-wave--front` (keyframes
  in `deck.css`). For print, drop the classes so it's static.
- The ring uses `currentColor` — set `color: var(--mint)` on the lockup wrapper.
- Position: top-right corner of the first/title surface. On a web deck use the
  `.slide-logo-lockup` utility inside an `.inner.slide-logo-inner`. On a PDF page
  use the `.logo-lockup` absolute lockup (see the PDF skill template).
- When the same page inlines the SVG more than once, give each copy unique ids
  (`float-circle-2`, `float-grad-2`, …) so `clipPath`/`gradient` refs don't
  collide.

---

## 5. Voice & copy

- **Language:** Most Float client material is **Danish**. Match the language of
  the request. Keep `lang="da"` (or `en`) correct on `<html>`.
- **Tone:** plain, senior, confident. Short declarative sentences. No hype, no
  exclamation marks, no emoji. State the value, then the mechanism.
- Eyebrows are scene-setting metadata ("FORSLAG · LØSNINGSAFDÆKNING", "ØKONOMI",
  "NÆSTE SKRIDT"), not sentences.
- Numbers carry the argument — let big Fraunces figures (volumes, prices, levels)
  do the talking; keep surrounding prose lean.
- One idea per surface. If a slide/page is getting crowded, split it.

---

## 6. Layout principles

- **Generous margins, vertical centring.** Content breathes; nothing touches the
  edges. Web slides centre content in a `max-width: 1200px` `.inner`.
- **Cards** (`--ink-soft` fill, `--ink-line` border, ~1rem radius) carry a 2px
  accent top-border to signal category (mint = primary, tide = secondary,
  coral = caution).
- **Reveal on scroll** (web): add `class="reveal"` to elements; they fade/rise in
  when their slide becomes active, staggered by child order.
- Consistent footer meta on print pages: left = "Float · AI-native strategi &
  implementering", right = "NN / NN · Section name", mono + `--cream-dim`.

---

## 7. Quick checklist before shipping

- [ ] Exactly one `<em class="accent">` italic word in each heading
- [ ] Eyebrow (mono, uppercase, tracked) above each heading
- [ ] Mint is the dominant accent; tide only for a genuine second track; coral ≤2 uses
- [ ] `class="grain"` on body (web) / baked grain (PDF)
- [ ] Float logo lockup top-right of the title surface, wordmark in Fraunces 300 mint
- [ ] No pure white, no bold headings, no emoji
- [ ] Correct `lang` and language matches the client
