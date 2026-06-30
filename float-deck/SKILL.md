---
name: float-deck
description: Build presentations, sales decks, pitch decks, proposals, and slide-style documents in the Float brand (Reify ApS's AI-native consulting brand) — dark "ink" background, Fraunces serif headings, mint/tide/coral accents, film-grain texture, and the Float wave logo. Use this skill whenever the user wants to create or edit a Float deck, a Reify/Float client presentation, a scrollable web slide deck, a sales/pitch/proposal slide document, or asks for "something in the Float style", "the consultancy deck style", or "the mint-on-black look". Produces a self-contained HTML deck (scroll-snap slides + Lenis smooth scroll) styled with the bundled deck-kit. For turning a deck into a printable landscape-A4 PDF, hand off to the companion float-pdf skill.
---

# Float deck

Build Float-branded slide decks and presentations as self-contained static HTML.
Float is **Reify ApS's** AI-native strategy & implementation brand: near-black
ink, Fraunces display serif, a small mint / tide / coral palette, faint grain,
and the Float wave logo. The result is a scrollable web deck (one full-viewport
slide per screen) with nav dots, keyboard navigation, fullscreen, and desktop
Lenis smooth-scroll — no build step, all dependencies from CDN.

## When to reach for this vs. float-pdf

- **float-deck (this skill):** the default. A scrollable/presentable web deck.
- **float-pdf (companion skill):** when the deliverable must be a printable,
  emailable **landscape-A4 PDF** (proposals, signed offers, terms appendices).
  The two share the exact same brand tokens — build the deck first, then hand
  off to float-pdf if a PDF is needed.

## Workflow

1. **Read the brand first.** Load `references/brand.md` — it is the source of
   truth for colour tokens, typography, the one-italic-accent rule, grain, logo
   usage, and voice. Don't improvise brand decisions; the restraint *is* the
   brand.
2. **Scaffold from the template.** Copy `assets/deck-template.html`,
   `assets/deck.css`, and `assets/deck.js` into the project. Keep them together
   (the template links `deck.css`/`deck.js` by relative path). Rename the HTML
   to something meaningful (e.g. `index.html`).
3. **Compose slides from components.** Build each slide from the ready-made
   blocks in `references/components.md` (title, agenda, card quad, two-track,
   level-ladder, counterpoint, team grid, CTA). Reuse classes from `deck.css` —
   do **not** write new CSS unless a genuinely new component is needed, and if
   so, follow the existing token/naming patterns.
4. **Write the copy in the client's language** (usually Danish). Set `lang`
   correctly. Keep the voice plain and senior (see brand.md §5). Give every
   heading exactly one `<em class="accent">` italic word and an eyebrow above it.
5. **Preview & verify.** Serve locally and check in a browser:
   ```sh
   python -m http.server 8000   # open http://localhost:8000/<file>.html
   ```
   Confirm: grain is subtle, mint dominates, tide only marks a real second
   track, coral used ≤twice, logo lockup top-right of the title slide, nav dots
   match slide count, headings each have one accent. For an automated visual
   check, screenshot slides with `assets/screenshot.mjs` (optional — needs the
   one-time Playwright setup below; the deck itself has no Node dependency).
6. **Need a PDF?** Switch to the **float-pdf** skill, which reuses these tokens
   to lay the content out as landscape-A4 pages and render via Playwright.

## What's bundled

```
float-deck/
├── SKILL.md
├── assets/
│   ├── deck.css            # Brand tokens + ALL components (~1080 lines). Don't rewrite — link it.
│   ├── deck.js             # Generic deck engine: nav dots, reveal-on-scroll, keyboard nav, fullscreen, zoom, Lenis opt-in.
│   ├── deck-template.html  # Working starter: title slide + content slide + controls + CDN wiring.
│   ├── float-logo.svg      # Standalone Float wave logo (also inlined in the template).
│   ├── screenshot.mjs      # Optional Playwright helper to screenshot each slide for review.
│   └── package.json        # Pins playwright for the OPTIONAL screenshot helper (`npm run setup`).
└── references/
    ├── brand.md            # READ FIRST. Tokens, type, grain, logo, voice, layout, checklist.
    └── components.md       # Copy-paste HTML for every deck component, keyed to deck.css classes.
```

## The deck itself needs no build step or Node

The deck is pure static HTML/CSS + vanilla JS with all runtime deps (fonts,
Tailwind-free `deck.css`, Lenis) loaded from CDN. Just open the HTML in a
browser or serve it with `python -m http.server`. **Node/Playwright is only
needed for the optional slide screenshots** — set it up once if you want them:

```sh
cd assets
npm run setup        # npm install && npx playwright install chromium
node screenshot.mjs ../path/to/deck.html
```

If you need a PDF, that's the **float-pdf** skill (which has its own renderer
setup).

## How the engine works (deck.js)

Self-initialises on `DOMContentLoaded`. HTML hooks it expects:
- `#deck` — container; add `data-lenis` to opt in to desktop Lenis smooth scroll.
- `.slide[data-label]` — each slide; `data-label` becomes its nav-dot label.
- `#slide-nav` — empty `<nav>`; the engine fills it with dots.
- `.reveal` — elements that fade/rise in when their slide becomes active
  (staggered by child order). Add `reveal--slow` for hero elements.
- `#fs-btn`, `#zoom-in/out`, `#zoom-level` — fullscreen + zoom controls.

Behaviour you get for free: scroll-snap slides (native on mobile, Lenis Snap on
desktop), arrow/Page key nav, nav-dot click-to-go, fullscreen with zoom,
reduced-motion fallbacks. There is an optional diagnostic slider/score and two
typewriter effects (`[data-typed]`, `.typewrite[data-text]`) if you need them.

## Hard rules (from brand.md — do not violate)

- **One italic mint accent per heading.** `<em class="accent">` — the signature move.
- **Mint is the default accent.** Tide only for a genuine parallel/secondary
  track. Coral is a spotlight for caution — ≤2 uses per surface.
- **No pure white, no bold headings, no emoji.** Headings are Fraunces 300.
- **Grain stays subtle** (`class="grain"` on `<body>`); felt, not seen.
- **Don't introduce a bundler, framework, or TypeScript.** Pure static HTML/CSS
  + vanilla JS, all deps from CDN — that's the whole point.
- **Reuse `deck.css`; don't fork the tokens.** New components extend it in the
  same style and stay copy-string-free so they remain reusable.
