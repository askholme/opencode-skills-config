---
name: float-slides
description: Build Float/Reify-branded slide decks as a single self-contained HTML file with an in-browser editor, embeddable iframe mode, and browser print-to-PDF — all from one file, no build step, no Node at runtime. Use this skill whenever the user wants a Float deck they can edit in the browser, a single-file slide deck, a deck with an in-browser editor, Float slides to PDF, a noskillish-style Float deck, a self-contained HTML presentation, a deck that embeds in a webpage, or a Float/Reify branded presentation they can hand to a client as one file. Produces one self-contained HTML — present by opening it, append ?edit to edit in the browser, append ?embed to embed, press P to print to PDF, click Publish to export a locked final copy with the editor removed.
---

# Float slides

Build Float-branded **single-file slide decks**: one self-contained HTML file
that presents, edits, embeds, and prints to PDF — all in the browser, no build
step, no Node at runtime. Float is **Reify ApS's** AI-native strategy &
implementation brand: near-black ink, Fraunces display serif, a small
mint / tide / coral palette, faint grain, and the Float wave logo.

The deck ships 31 copy-paste components on a 4-tier emphasis ladder, a full
in-browser editor (`?edit`), and a Publish button that strips the editor and
produces a locked final HTML for recipients.

## When to reach for this vs. float-deck vs. float-pdf

| Skill | Deliverable | When to use |
|---|---|---|
| **float-slides (this skill)** | Single self-contained HTML | Default for new Float decks. One file: present + edit + embed + print-to-PDF. In-browser editor lets the author refine without a dev environment. Publish produces a locked copy for recipients. |
| **float-deck** | Multi-file HTML deck (HTML + CSS + JS) | The original Float web deck. Use when you need the multi-file structure, Lenis smooth-scroll, or the optional Playwright screenshot helper. No in-browser editor. |
| **float-pdf** | Landscape-A4 PDF via Playwright | When the deliverable must be a printable, emailable PDF (proposals, signed offers, terms appendices). Fixed 297×210mm pages rendered by headless Chromium. |

All three share the same brand tokens, type rules, and voice. Build in
float-slides first; hand off to float-pdf only if a Playwright-rendered PDF is
required (e.g. for print shops or signed agreements).

## Workflow

1. **Read the brand first.** Load `references/brand.md` — it is the source of
   truth for colour tokens, typography, the one-italic-accent rule, grain, logo
   usage, and voice. Don't improvise brand decisions; the restraint is the brand.

2. **Copy the template into the project.** Copy `assets/deck-template.html`
   into the project folder. Rename it to something meaningful
   (e.g. `client-kickoff.html`). The Float logo is already inlined as SVG
   markup inside the template — no separate file reference is needed.
   `assets/float-logo.svg` is a standalone asset for use in other contexts
   (e.g. embedding the logo in a webpage or document outside the deck).

3. **Compose slides from components.** Build each slide from the ready-made
   blocks in `references/components.md` (31 components, 4 emphasis tiers).
   Content goes inside `.slide-frame`. Each slide needs:
   - An `<!-- ========== N. NAME ========== -->` anchor comment before the
     `<section>` (required by the save serialiser — do not omit or reformat).
   - A `data-label="…"` attribute on the `<section>` (drives nav dots).
   - Exactly one `<em class="accent">` in each `h1`/`h2` heading.
   - A `.eyebrow` span above each heading.
   - Copy in the client's language (usually Danish). Set `lang="da"` on `<html>`.

4. **Refine in the browser with `?edit`.** Append `?edit` to the URL
   (e.g. `file:///path/to/deck.html?edit`) to enter edit mode:
   - Click any text to edit it inline (plaintext, no markup).
   - Thumbnail rail on the left: drag to reorder, click the dup/delete icons,
     drag slides to new positions.
   - Hover an image or video to replace it via file upload, drag-and-drop,
     paste, or URL. Images are downscaled to ≤1600px and embedded as base64.
   - **Save in place:** `Cmd/Ctrl+S` in Chromium (after a one-time file-picker
     prompt) writes the file back to disk byte-for-byte, preserving unchanged
     slides exactly. In other browsers it downloads a copy instead.
    - Autosave triggers after each edit (2-second debounce, only when a file
      handle is open).

5. **Embed with `?embed`.** Append `?embed` to hide the nav chrome, PDF button,
   and Edit button while keeping keyboard and swipe navigation. Use this URL in
   an `<iframe>` to embed the deck in a webpage or CMS.

6. **Export PDF by pressing P (or clicking the PDF button).**
   - Press **P** (or click the PDF button in the bottom-left chrome) to open the
     browser print dialog.
   - **Critical:** in Chrome/Chromium, expand "More settings" and turn on
     **Background graphics**. Without this, the dark ink background prints white
     and the deck is unreadable.
   - Print to PDF, landscape orientation, no margins (the print CSS sets
     `@page { size: 13.333in 7.5in; margin: 0 }` automatically).
   - Each slide maps to one landscape 16:9 page. Grain is baked in (the live SVG
     grain swaps to an inlined PNG tile in `@media print`).
   - For offline or restricted environments where Chrome is unavailable, the
     float-pdf skill renders the same brand via Playwright.

7. **Publish a locked final copy.** In `?edit` mode, click the **Publish**
   button in the toolbar:
   - The current document (with all edits flushed) is serialised.
   - Everything between `<!-- EDITOR:START -->` and `<!-- EDITOR:END -->` is
     sliced out (the editor script is gone from the file, not just disabled).
   - The Edit and Publish buttons are removed.
   - In Chromium, a "Save As" dialog suggests `<name>.final.html`. In other
     browsers, the file downloads automatically.
   - The published file still presents, embeds (`?embed`), and prints to PDF
     (`P`). Appending `?edit` does nothing — the editor code is absent.

## What's bundled

```
float-slides/
├── SKILL.md                          # This file.
├── assets/
│   ├── deck-template.html            # The deliverable: single-file deck (~4007 lines).
│   │                                 # HTML + inline CSS + 2 script blocks (engine + editor).
│   └── float-logo.svg                # Standalone Float wave logo (also inlined in the template).
└── references/
    ├── brand.md                      # READ FIRST. Tokens, type, grain, logo, voice, checklist.
    ├── components.md                 # 31 copy-paste components, tier assignments, Float classes.
    ├── storytelling.md               # 6 narrative formats with beat sequences + component mapping.
    └── _upstream/
        ├── noskillish-deck.html      # Vendored upstream source (read-only reference).
        └── SOURCE.md                 # Upstream URL + pinned commit SHA + date.
```

## How it works

### Presentation engine

The window itself is the scroll container (`html { scroll-snap-type: y mandatory }`).
Each `<section class="slide">` is `min-height: 100vh` with `scroll-snap-align: start`
— always `display: flex`, never hidden. An `IntersectionObserver` (`root: null`,
`threshold: 0.6`) tracks the current slide and drives the nav dots and progress bar.

Public API (used by the editor):

- `window.show(i)` — scroll slide `i` into view (smooth).
- `window.refreshSlides()` — re-query `#deck > .slide` after structural edits;
  rebuilds nav dots and re-observes.
- `window.next()` / `window.prev()` — advance one slide.

Keyboard: `←` / `→` / `Space` / `PageUp` / `PageDown` / `Home` / `End` navigate;
`P` triggers `downloadPDF()` (`window.print()`). Touch: horizontal swipe navigates
(vertical is handled natively by scroll-snap).

### Safe-area frame

Inside each `.slide`, a `.slide-frame` constrains content to a 16:9 safe area:

```css
.slide-frame {
  aspect-ratio: 16 / 9;
  width: min(100vw, calc(100vh * 16 / 9));
  margin: auto;
}
```

On screen the surrounding area is the same ink + grain, so the deck reads
full-bleed. In print, `.slide-frame` is exactly the page (`13.333in × 7.5in`).
Content authored inside `.slide-frame` is never clipped in the PDF.

### In-browser editor (`?edit`)

The editor IIFE lives between `<!-- EDITOR:START -->` and `<!-- EDITOR:END -->`
marker comments. It activates only when `?edit` is in the URL. It relies on:

- `window.show()` / `window.refreshSlides()` (provided by the engine).
- `#deck > .slide` DOM order for the thumbnail rail.
- `<!-- ========== N. NAME ========== -->` anchor comments before each
  `<section class="slide">` — the save serialiser uses these to locate slide
  boundaries and rewrite only changed slides, preserving the rest byte-for-byte.

The editor auto-detects the dark background and applies `ed-dark` chrome. The
thumbnail rail offsets the body with `padding-left` (not a scroll-container
margin) so the window scroll-snap viewport is unaffected.

### Publish (locked final HTML)

The Publish button (visible only in `?edit` mode) runs a dedicated serialiser
that does NOT reuse the save (`splice()`) path:

1. Clones `document.documentElement`, strips editor-injected DOM (`[data-ed-ui]`,
   `[data-ed-wrap]`), removes `contenteditable` / `spellcheck` attributes, drops
   editor dataset keys, removes `ed-on` / `ed-dark` body classes.
2. Slices out everything between `<!-- EDITOR:START -->` and `<!-- EDITOR:END -->`
   (inclusive) — the editor script is gone from the output.
3. Slices out the Edit button block (`<!-- EDITBTN:START -->` … `<!-- EDITBTN:END -->`).
4. Writes via `showSaveFilePicker` (Chromium) or Blob download (other browsers),
   suggested name `<name>.final.html`.

If either marker pair is missing or inverted, Publish hard-fails with an error
status and writes nothing.

## Hard rules (from brand.md — do not violate)

- **Dark ink background.** `--ink: #0A0E14`. Never use a light background.
- **Fraunces 300 headings.** No bold headings (`font-weight: 300` throughout).
- **One italic mint accent per heading.** `<em class="accent">` — exactly one
  per `h1` / `h2`. Not zero, not two.
- **Eyebrow above every heading.** `<span class="eyebrow">` in JetBrains Mono,
  uppercase, tracked.
- **Mint is the default accent.** Tide only for a genuine parallel/secondary
  track. Coral is a spotlight for caution — ≤2 uses per slide.
- **No pure white** (`#fff` / `white`) anywhere in component CSS.
- **No emoji.**
- **Grain stays subtle.** `class="grain"` on `<body>`; felt, not seen.
- **Correct `lang`.** Danish copy → `lang="da"` on `<html>`.
- **Unique SVG ids when the logo repeats.** Each inline SVG copy of the logo
  needs unique `clipPath` / `linearGradient` ids (`float-circle-2`, `float-grad-2`,
  …) so refs don't collide across slides.
- **Content inside `.slide-frame`.** Nothing touches the viewport edges; the
  safe-area frame is the authoring boundary.

## No build step / no Node

Present, edit, publish, and print are all pure browser operations. The only
remote dependency is Google Fonts (Fraunces + Inter + JetBrains Mono loaded via
`<link>` in `<head>`).

**Offline / restricted environments:** if presenting without internet access,
self-host the three font families and replace the Google Fonts `<link>` with
local `@font-face` declarations. Download from:

- Fraunces: https://fonts.google.com/specimen/Fraunces
- Inter: https://fonts.google.com/specimen/Inter
- JetBrains Mono: https://fonts.google.com/specimen/JetBrains+Mono
