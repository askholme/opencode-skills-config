# WORKFLOW_STATE.md

Source of truth for the float-slides skill build. Planner owns this file.

## Status
- Phase: **COMPLETE** — all 7 tasks (0–7) implemented + reviewed (both code reviewers approved each).
- Debate verdict was APPROVE-WITH-CHANGES; all 5 must-fixes folded into the plan and built.
- Deliverable: `float-slides/` skill (SKILL.md, assets/deck-template.html ~4007 lines,
  float-logo.svg, references/{brand.md, components.md, storytelling.md, _upstream/}).
- Next Agent: planner → return to user (summary + next steps). Optional ADR pending user.

### Reconciled mismatches (plan vs. actual build — both benign, build is correct)
- Plan §A listed `grain-tile.b64.txt` as a separate file; actual build **inlines** the
  baked-grain base64 directly in deck-template.html's print CSS (better for single-file goal).
  SKILL.md tree reflects the actual files. No `scripts/` folder exists (zero-Node confirmed).
- storytelling.md documents 6 presentation frameworks (the 6 noskillish FORMATS from its
  marketing/README), not the single six-beat structure inside the upstream deck file — this
  matches the Task 7 intent (the 6 formats the user referenced).

## Request (verbatim intent)
Build a new skill that fuses the **noskillish/slides** architecture (single self-contained
HTML file, in-browser editor `?edit`, `?embed`, print-to-PDF via `P`, broad component
library + storytelling formats) with the **Float** brand/layout (dark ink, Fraunces,
mint/tide/coral, grain, wave logo, one-italic-accent rule). Then generate PDFs from the
same file afterward **without rebuilding into separate printable components**.

## Decisions locked with user (Q&A)
1. Packaging: **single self-contained HTML** (inline CSS + JS; only Google Fonts remote).
2. Orientation/nav: each slide is a fixed **16:9 frame**, presented via **vertical
   scroll-snap** between frames (Float feel) + nav dots; arrow keys + swipe also work.
3. PDF: **browser print-to-PDF** (`P` / Download PDF). Same file, no Node, no rebuild.
   Print CSS maps 1 slide → 1 landscape 16:9 page (13.333in × 7.5in).
4. Deliverable: **new skill `float-slides`**; leave `float-deck` + `float-pdf` untouched.
5. Components: **full 31-component parity** with noskillish, re-skinned to Float brand.
6. Editor + embed: **full `?edit` + `?embed`** ported (inline text, drag-reorder,
   media swap, save-in-place; embed hides chrome).
7. Grain in printed PDF: **auto-swap live SVG grain → baked PNG tile** in print
   (reuse float-pdf's grain approach via a print-only `@media print` rule with an
   inlined base64 PNG data-URI; no Node).
8. Fonts: **Google Fonts CDN** (Fraunces + Inter + JetBrains Mono), documented offline note.
9. On-screen fit: slides **fill the viewport** (Float feel); the fixed 16:9 framing is
   applied **only in print CSS**. (User chose this over on-screen letterboxing.)
10. Brand reference: **full copy** of brand.md inside float-slides (self-contained skill).
11. **NEW — "publish/lock" output:** must be able to generate a **final HTML with the edit
    functionality turned OFF** — a clean, distributable deck file that still presents,
    embeds, and prints-to-PDF, but has the `?edit` editor removed/disabled so recipients
    can't enter edit mode. (Scope item added at approval.)

## Key findings (grounding)
### noskillish/slides architecture
- One HTML file. `<style>` block (tokens + 31 components + nav/print CSS), body = slides,
  two `<script>` blocks: (a) **core engine**, (b) **`?edit` editor**.
- Core engine (lines ~1938–1996): `slides = .slide`; `show(i)` toggles `.active` and
  sets `display:flex` (others `display:none`, absolute-positioned); `next/prev`; keyboard
  (←/→/Space/PageUp/Down/Home/End/**P**); touch swipe; `downloadPDF()` = `window.print()`;
  `?embed` flag hides chrome. Exposes **`window.show()`** and **`window.refreshSlides()`**.
- Editor (`?edit`, lines ~1998–2768): theme-adaptive via `--ed-*` tokens, **auto-detects
  dark background** (relevant: Float is dark) and switches to `ed-dark` chrome. Inline
  plaintext editing (`contenteditable=plaintext-only` on text leaves), thumbnail rail
  (reorder/dup/delete/drag), image/video replace (file/drop/paste/link, base64 embed,
  downscale >1600px), undo, dirty tracking, autosave.
- **Save (`splice()` + File System Access):** rewrites only changed slides back to disk
  byte-for-byte for the rest. **Anchor = one `<!-- ===== N. NAME ===== -->` HTML comment
  per `<section class="slide">`.** Uses `data-src-idx`. This serialization is **presentation-
  agnostic** — it operates on `deck > .slide` DOM order, NOT on how slides are displayed.
- Print CSS: `@page { size: 13.333in 7.5in; margin:0 }`; `@media print` forces every
  `.slide` to `display:flex`, fixed `13.333in × 7.5in`, `break-after:page`. Dark slides
  re-asserted with `!important`. `print-color-adjust: exact`.

### CRITICAL architectural tension (the crux for the debater)
noskillish presentation = **one `.slide.active`, rest `display:none`, absolute-positioned**
(replace navigation, no scroll). User wants **vertical scroll-snap between 16:9 frames**.
These two presentation models conflict. The editor + save + print all depend on the
**`show()`/`refreshSlides()` API** and DOM order, NOT on the absolute/`display:none` layout.
→ Plan: replace ONLY the screen-presentation layer (scroll container + `scroll-snap` + nav
dots + IntersectionObserver to drive `current`), while **preserving the `show()`/
`refreshSlides()` contract** so the editor and print path keep working unchanged. Editor
thumbnail rail computes scale from `deck.clientWidth/Height` — must stay sane when the deck
becomes a scroller (use per-slide frame dimensions, not the tall scroll container).

### Float brand tokens (from float-deck/references/brand.md)
- `--ink #0A0E14` (bg), `--ink-soft #11161E` (card), `--ink-line #1C232E` (border),
  `--cream #F2EDE3` (headings), `--cream-soft #E8E1D2` (body), `--cream-dim #A39E91` (meta),
  `--mint #B8F2D6` (PRIMARY accent), `--tide #7AA8E0` (secondary track), `--coral #FF8B6B` (caution).
- Fonts: Fraunces (headings/accents/numbers), Inter (body), JetBrains Mono (eyebrows/labels).
- Rules: one `<em class="accent">` italic mint word per heading; eyebrow above each heading;
  mint dominant, tide for a real 2nd track, coral ≤2/surface; no pure white, no bold
  headings, no emoji; grain subtle (`class="grain"`).
- Logo: thin-ring circle + two mint→tide waves + "Float" wordmark (Fraunces 300 mint),
  top-right of title slide. Duplicate SVG copies need unique clipPath/gradient ids.

### Token mapping (noskillish → Float) — replaces the noskillish "headline pattern"
| noskillish | Float equivalent |
|---|---|
| bg `#f5f5f3` (light) | `--ink #0A0E14` (dark) — **invert the whole system** |
| text `#1a1a1a` | `--cream` / `--cream-soft` |
| dim text `#a0a09a/#b5b5b0` | `--cream-dim` |
| surface `#fafaf8` / `#fff` cards | `--ink-soft` + `--ink-line` border + 2px accent top-border |
| dark slide/callout `#1a1a1a` (inverted) | a **mint-tinted panel** `rgba(184,242,214,0.06)` or brighter mint accent (dark-on-dark needs a different emphasis device than noskillish's invert-to-black) |
| accent = black, weight 500 | accent = **mint, Fraunces italic** (`em.accent`) |
| headline "bold-then-dim" (`span.dim` gray) | Float "one italic mint accent" — **drop bold-then-dim**, adopt `em.accent`; `span.dim` can remain as a muted continuation in `--cream-dim` but is NOT the signature |
| Inter everywhere | Fraunces headings / Inter body / Mono eyebrows |

## Plan (architecture)

### Goal
A `float-slides/` skill whose `assets/deck-template.html` is a **single self-contained
HTML file** that: presents as Float-branded **16:9 scroll-snap** slides; supports
`?edit` and `?embed`; and prints to a faithful landscape-16:9 **PDF via `P`** with baked
grain — all from one file, no rebuild, no Node.

### A. File/skill structure
```
float-slides/
├── SKILL.md                     # workflow, when-to-use, hard rules (mirrors float-deck tone)
├── assets/
│   ├── deck-template.html       # THE single self-contained deck (style + 31 components + 2 scripts)
│   ├── float-logo.svg           # standalone wave logo (copy from float-deck)
│   └── grain-tile.b64.txt       # base64 of float-pdf/assets/grain-tile.png, for the print @media rule
│                                # (or inline the data-URI directly in deck-template.html's print CSS)
└── references/
    ├── brand.md                 # FULL COPY of float-deck/references/brand.md (decision #10)
    ├── components.md            # the 31 components, Float-skinned, copy-paste, per-slide anchor + EMPHASIS TIER col
    ├── storytelling.md          # the 6 noskillish formats, condensed (optional ref)
    └── _upstream/               # VENDORED noskillish/slides @ pinned commit (R5) — read-only reference
```
**NO Node anywhere.** Zero build tooling — present, edit, publish, and print are all pure
browser. (Publish is an in-browser button, decision below.)

### B. The single HTML file — internal structure
1. `<head>`: meta, title, **Google Fonts** link (Fraunces+Inter+JetBrains Mono), inline `<style>`.
2. `<style>` sections, in order:
   - **Tokens**: Float `:root` custom props (the brand set above) + the `--ed-*` editor
     tokens; base `html/body` dark, grain.
   - **Grain**: live SVG `feTurbulence` overlay (`body.grain::before`, fixed, opacity ~0.06,
     mix-blend screen) — copy float-deck's approach.
   - **Presentation — WINDOW-AS-SCROLLER (R1, mirrors `float-deck/deck.css`):** the **window**
     scrolls (`html { scroll-snap-type: y mandatory }`); `<div id="deck">` is a non-scrolling
     wrapper (kept only for the editor's selector — `display:contents` or plain block, NO
     `height:100vh`/`overflow`). Each `.slide` is a full-viewport section (`min-height:100vh`,
     `scroll-snap-align:start`), **always `display:flex`** (NOT `display:none`). Keep the
     `.active` class (editor + nav dot rely on it) driven by `IntersectionObserver({root:null})`.
     `show(i)` = `slides[i].scrollIntoView()` on the default viewport. Optional desktop Lenis
     like float-deck. → All editor coupling patches disappear; editor ports VERBATIM.
   - **Safe-area frame (R3):** inside each `.slide`, a `.slide-frame` =
     `aspect-ratio:16/9; width:min(100vw, calc(100vh*16/9)); margin:auto`. Authors compose
     INSIDE `.slide-frame`. On screen the surrounding area is the same ink+grain so it reads
     full-bleed (satisfies decision #9). In print, `.slide-frame` IS the page → no clip/overflow.
   - **31 components**, Float-skinned, each assigned to one of the **4 emphasis tiers (R4, see §D)**.
     Re-skin only — do NOT restructure markup/class names (keeps the editor text-leaf walker
     and components.md stable, keeps parity simple).
   - **Nav dots** (Float-style, right side) + progress + pdf/edit buttons.
   - **Print CSS**: `@page { size:13.333in 7.5in; margin:0 }`; `@media print` lays each
     `.slide-frame` as a fixed 16:9 page, `break-after:page`, disables scroll-snap, forces
     dark bg + `print-color-adjust:exact`; **swaps live grain → baked PNG** via
     `body.grain::before { background-image:url("data:image/png;base64,…") !important;
     mix-blend-mode:normal !important; opacity:.045 !important }` and hides nav/edit chrome.
3. `<body class="grain">` → `<div id="deck">` → N `<section class="slide">` (each with an inner
   `.slide-frame`), each section preceded by the `<!-- ===== N. NAME ===== -->` anchor comment
   (required by the save serializer). Title slide carries the logo lockup.
4. Two `<script>` blocks, the editor one wrapped in **`<!-- EDITOR:START -->` … `<!-- EDITOR:END -->`**
   marker comments (R2 — deterministic cut for publish):
   - **Core engine (adapted):** keep `show()`, `next/prev`, keyboard (incl. **P**), swipe,
     `downloadPDF()`, `?embed`, **and `window.refreshSlides()`** — `show(i)` scrolls slide i
     into view; `.active` set via IntersectionObserver. Nav-dot click → `show(i)`.
     Reveal-on-scroll (`.reveal`) optional, Float-style.
   - **Editor (`?edit`) — ported VERBATIM** from vendored noskillish (presentation-agnostic;
     window-scroller removes the need for patches). Only sanity-check: dark auto-detect lands
     on `ed-dark` for ink bg (it will — bg luminance < 128); rail offset uses
     `body.ed-on { padding-left }` not a scroll-container margin.

### C-bis. Publish / lock (final HTML with editor OFF)  [NEW REQUIREMENT — R2 resolved]
Recipients must not be able to enter edit mode. Published file stays a single self-contained
HTML that still presents, embeds, and prints, but the `?edit` editor code is **gone from disk**.
Deterministic cut point: the editor `<script>` is wrapped in `<!-- EDITOR:START -->` /
`<!-- EDITOR:END -->`, and the Edit button carries a known id/`data-ed-ui` for removal.
**Chosen mechanism = Option 1 — in-browser "Publish" button (zero Node, USER-CONFIRMED).**
In `?edit` mode, a `Publish` toolbar button:
  1. Takes the current in-memory document HTML (after any pending edits are flushed, reusing
     the editor's existing serialize-current-DOM path so edits are included),
  2. Deterministically **slices out everything between `<!-- EDITOR:START -->` and
     `<!-- EDITOR:END -->`** (string slice on the markers — NOT regex on `</script>`), and
     removes the Edit/Publish buttons by id,
  3. Writes the result via the File System Access API ("Save As" → `<name>.final.html`) in
     Chromium, or **downloads a copy** in other browsers.
This is a NEW small serializer (it does NOT reuse `splice()`), budgeted as such in Task 6.
True "off": the editor code is absent from the published file; `?edit` does nothing.
Acceptance: published file has NO editor script between the markers; appending `?edit` does
nothing; it still navigates, `?embed` works, and `P` still produces the PDF.

### C. PDF path (no rebuild)
- Default: press **P** / Download PDF → `window.print()`. Print CSS already turns each slide
  into one 16:9 page with baked grain. Document the Chrome + "Background graphics: ON" tips.
- No separate "printable components" — same DOM, same file. (This is the user's core ask.)
- Optional later: a thin Playwright wrapper could target the same file for max grain
  fidelity, but it is OUT of v1 scope (YAGNI; float-pdf already exists for heavy cases).

### D. Brand fidelity specifics — 4-tier emphasis ladder (R4)
Since Float is already dark ink, noskillish's "invert to black" emphasis is meaningless.
Replace it with a **4-tier ladder**; every one of the 31 components is mapped to exactly one
tier (mapping lives in `references/components.md`, tier column):
1. **Base** — `--ink` bg, 1px `--ink-line` border, `--cream-soft` text. (default cards: stack,
   logo, image cards, update, testimonial, output, etc.)
2. **Raise** — `--ink-soft` bg, `--ink-line` border, 2px `--mint` top-border. (`.callout`,
   `.spec-block`, feature cards.)
3. **Mint panel** — `rgba(184,242,214,0.06)` bg, `rgba(184,242,214,0.18)` border, `--mint`
   accent text. (former `.dark`/`.stat-dark`/`.quote-dark` emphasis cards.)
4. **Hero** — full-bleed, `--mint-bright` accent, Fraunces display size, optional radial mint
   wash. (`.jeduf .hero`, title/cover, closing.)
- Apply `em.accent` (mint Fraunces italic) as the heading signature; `span.dim` continuation
  (if used) is `--cream-dim`, NOT the signature. Eyebrows → JetBrains Mono uppercase tracked.
- Logo lockup on the cover; unique SVG clipPath/gradient ids if duplicated across slides.

### E. Acceptance (whole skill)
- Opening `deck-template.html` shows Float-branded 16:9 slides that scroll-snap vertically,
  with nav dots, arrow/swipe nav, fullscreen-able.
- `?edit` works: edit text in place, reorder/dup/delete, swap an image; Save writes back
  (Chromium) / downloads a copy (other); diffs stay slide-scoped.
- `?embed` hides chrome, keeps nav.
- Press **P** → a landscape 16:9 PDF, one page per slide, dark bg printed, grain baked,
  text crisp (Fraunces/Inter), no nav/edit chrome in the PDF.
- All 31 components present and on-brand (mint dominant, one accent/heading, etc.).
- No build step; only remote dep is Google Fonts.

## Open risks / for debater to challenge
1. **Scroll-snap vs editor/print coupling** — is preserving `show()/refreshSlides()` while
   swapping presentation actually clean, or does the editor make hidden assumptions
   (thumbnail scale, rail offset, `display:none` reliance) that break under a scroller?
2. **One giant single file vs maintainability** — 31 components + full editor + Float CSS in
   one HTML is large. Is single-file worth it vs. the existing multi-file float-deck? (User
   chose single-file for editor/diff benefits — confirm the editor truly needs single-file.)
3. **Dark-native re-skin of "invert-to-black" components** — does forcing 31 light-system
   components onto dark ink produce enough emphasis variety, or do several components
   collapse visually (e.g. `.callout` vs `.dark` vs `.stat-dark` all look the same on ink)?
4. **Print fidelity** — does Chrome print the 16:9 page + radial gradients + baked grain
   faithfully without the Playwright path? Risk of washed dark bg if "Background graphics" off.
5. **Scope size** — full 31-component parity + full editor is a large build. Is a smaller
   v1 (core components + editor) materially safer, or is parity cheap since it's mostly CSS re-skin?
6. **Publish/lock mechanism** — which of the 3 options (C-bis) is simplest AND truly turns
   the editor off? Option 1 reuses save plumbing + removes code with no Node; is the
   serialize-and-strip reliable enough in-browser, or is a 20-line Node strip script (Opt 3)
   actually the lower-risk "off"? Debater to recommend.
7. **Viewport-fill on screen but 16:9 in print** — content authored to look right full-
   viewport may overflow/clip when forced into a 7.5in-tall print page (and vice-versa).
   How do we keep WYSIWYG-enough so the PDF isn't surprising? (Author guidance? a preview
   mode? cap content to the 16:9 safe area even when filling viewport?)

## Debate Notes

### Verdict
**APPROVE-WITH-CHANGES.** The plan is fundamentally sound and the locked decisions are coherent. But four design choices (scroller topology, publish/lock mechanism, viewport-vs-print WYSIWYG, and dark-native emphasis variety) have a strictly simpler and safer formulation than the one currently in the plan, and one structural gap (noskillish source not vendored into this repo) needs to be closed before implementation starts. Fix the five items below and proceed.

### Context the planner should have flagged
- **noskillish/slides is NOT in this workspace.** I searched the repo — there is no vendored copy. Every claim about its internals (line ranges 1938–2768, `splice()` anchor format, `window.show()/refreshSlides()` contract, `data-src-idx`, `ed-on` rail offset, `ed-dark` auto-detect, contenteditable text-walker) is currently second-hand. This is not a reason to rework the plan, but it IS a reason to **vendor noskillish into `float-slides/references/_upstream/` (or a tarball)** as task 0 of implementation, BEFORE any code touches the editor port. Otherwise the implementor is coding against a memory.
- Float's existing `float-deck/assets/deck.css` already solves "vertical scroll-snap of slides" with **window-as-scroller** (`html { scroll-snap-type: y mandatory }` + `.slide { scroll-snap-align: start }`). The plan instead proposes a NEW `.deck { height:100vh; overflow-y:auto }` inner scroller. The inner-scroller choice is what creates most of the editor-coupling problems below. Window-scroller is the simpler precedent already shipping in this repo.

### Problems in the current plan (with concrete failure traces)

**P1. Inner-scroller `.deck` is the wrong scroll topology, and it is the root cause of risk #1.**
The plan says: `.deck = vertical scroll container (height:100vh; overflow-y:auto; scroll-snap-type: y mandatory)`. Concrete failures this causes:
- Editor's thumbnail scale reads `deck.clientWidth/clientHeight`. With an inner scroller, `clientWidth` is fine but `clientHeight` is just one viewport (not "tall"). The plan's fix ("use per-slide frame dimensions") is correct but is a patch to the editor, which the plan elsewhere promises to port "nearly verbatim." That's a contradiction. Every patch you add to the editor port is a future merge-conflict against upstream noskillish.
- `body.ed-on .deck { margin-left: <rail-width> }` shifts the SCROLL CONTAINER. That means the snap viewport (the scroll port) is offset, and `scroll-snap` recalculates against the offset port. Active-slide detection via IntersectionObserver also needs `root: deck`, not `null`. Two more editor patches.
- noskillish's `show(i)` likely calls `scrollIntoView` (or sets `scrollTop`) on `window`/document. On an inner scroller it needs to call it on `deck`. Patch #3.
- Programmatic `show(i)` and `scroll-snap-type: mandatory` actively fight each other during edit-mode reorders: the snap engine will pull scroll back to the nearest snap point mid-animation. This is a known Chromium behavior with `mandatory` + smooth-scroll-into-view on a snap container.

**Simpler alternative:** use the SAME scroller Float already uses — **`html` is the scroller**, slides are direct children of `body` (still wrapped in `<div id="deck">` for the editor's selector, but the div is `display:contents` or just a non-scrolling wrapper). All four editor patches above disappear. `body.ed-on { padding-left: <rail-width> }` works without breaking snap. `IntersectionObserver({root:null})` works. `show(i)` calls `slides[i].scrollIntoView()` on the default viewport. This is exactly how `float-deck/deck.css` is structured — proven in-tree.

**P2. The publish/lock plan picks the wrong option.**
The plan leans Option 1 (in-browser "Publish" that uses the editor's `splice()` plumbing to write a sibling file with the editor `<script>` removed). Problems:
- `splice()` works because it rewrites byte-identical regions between known anchors. Removing the ~770-line editor script means deleting a region that does NOT match the slide-anchor pattern. You'd be writing a NEW serializer just for publish — that's NOT "reusing existing save plumbing," it's an entirely new code path that happens to share a File System Access handle.
- DOM/regex stripping of a `<script>` block from a document while that very script is running is fragile in edge cases (script content containing `</script>` in a string literal, comments, source maps). noskillish controls its own source so it's tractable, but it's not a "free" reuse.
- Option 2 (`?lock` / `data-locked`) is explicitly weaker — the editor code still ships, anyone can flip the flag. The plan correctly notes this.
- Option 3 (Node strip script) is rejected because it "reintroduces Node." But locked decision #1 only forbids Node **at runtime / on the default path**. A publish step is not the runtime path — it's a one-shot author action. The plan's own SKILL.md will already document a publish step regardless of which option is chosen.

**Simpler alternative:** **Option 3 (tiny Node strip script: `float-slides/scripts/publish.mjs`, ~20 lines).** It is a regex/marker-based slice between two HTML comments (`<!-- ===== EDITOR START ===== -->` / `<!-- ===== EDITOR END ===== -->`) plus removal of the edit button by marker. This is:
- a true "off" (the code is gone from disk, not gated),
- testable (snapshot the input, snapshot the output, diff),
- impossible for a recipient to re-enable,
- and the Node dependency is only invoked at author publish time, not at recipient runtime. The no-build constraint is preserved for the end user.

If you genuinely want zero Node anywhere in the skill, then do Option 1 but **be honest in the plan** that it's a new serializer, budget it as such, and use the same comment markers as Option 3 to slice the script block deterministically (not regex-strip).

Either way: **define the `<!-- EDITOR START/END -->` markers in the deck template** so whichever publish path you pick has a deterministic cut. This is the real must-fix.

**P3. "Fill viewport on screen, fixed 16:9 only in print" is a live WYSIWYG hazard.**
Locked decision #9 is the user's call and I respect it. But the plan's only mitigation is "Author guidance?" with a question mark. That is not a safeguard. Concrete failure: a slide authored on a 16:10 laptop (1.6 ratio) fills `100vw × 100vh`. The print page is 16:9 (1.778). The bottom ~10% of content is below the print page's `7.5in` bound and gets clipped silently. Author finds out only when they hit `P`.

**Simpler alternative:** the slide's **content area** is constrained to a 16:9 safe-area on screen (centered, with the leftover viewport space filled by Float's own ink background + grain — visually still "full-bleed Float" because everything outside the safe area is the same dark ink). Specifically: each `.slide` is `min-height:100vh` with a child `.slide-frame` of `aspect-ratio:16/9; width:min(100vw, calc(100vh * 16/9)); margin:auto;`. On screen this looks full-bleed because the surrounding ink matches. In print, `.slide-frame` IS the page. WYSIWYG is preserved at near-zero cost. This is not "letterboxing" in the visible sense — the letterbox bars are the same color as the slide.

**P4. Dark-native emphasis variety is under-specified — needs one concrete decision before component implementation.**
The token table maps `.dark` / `.callout` / `.stat-dark` / `.quote-dark` / `.jeduf .hero` all to roughly "mint-tinted panel" or "brighter mint." Five components → one device collapses three or four of them into visually indistinguishable cards on ink. The plan acknowledges this in risk #3 but doesn't resolve it.

**Simpler alternative:** define a **4-tier emphasis ladder** in the plan NOW, before any component is built, so each of the 31 components can be slotted deterministically:
1. **Base**: `--ink` bg, `--ink-line` 1px border, `--cream-soft` text. (Default cards.)
2. **Raise**: `--ink-soft` bg, `--ink-line` border, 2px `--mint` top-border. (`.callout`, `.spec-block`.)
3. **Mint panel**: `rgba(184,242,214,0.06)` bg, `rgba(184,242,214,0.18)` border, `--mint` accent text. (`.dark`, `.stat-dark`, `.quote-dark`.)
4. **Hero**: full-bleed, `--mint-bright` accent, Fraunces display-size, optional radial gradient wash. (`.jeduf .hero`, title slide.)

That's 4 visually distinct tiers, each tied to a Float token already in `deck.css`. Map every one of the 31 components to a tier in `references/components.md` BEFORE writing CSS. This is a one-page exercise; doing it after writing CSS is rework.

**P5. Noskillish source is not vendored.**
See "Context" above. Add as task 0 of implementation. Pinned commit, in `references/_upstream/`, gitignored from any rebuild but present for the implementor to read.

### Non-problems (planner had these right)
- **Single-file packaging.** The editor's `splice()` serializer requires the source-of-truth to be one HTML file (so byte-identical regions can be preserved between anchors). Multi-file would force a real build step and break the "save-in-place" promise. Not a false constraint. Approve as-is.
- **Full 31-component parity in v1.** It IS mostly CSS re-skin once P4's emphasis ladder is defined. Cutting components would create the asymmetric "noskillish parity except…" problem for documentation. Approve as-is.
- **Browser print-to-PDF as the default path.** float-pdf exists for the rare heavy case. Approve as-is. (Document the "Background graphics: ON" Chrome setting prominently in SKILL.md — that's the one realistic print failure mode.)
- **Editor ported nearly verbatim.** Right instinct. The patches needed reduce from ~3 to ~0 if you adopt P1 (window scroller).

### Must-fix list for the planner (before implementation)
1. **Switch to window-as-scroller** (drop `.deck { height:100vh; overflow-y:auto }`). Mirror `float-deck/deck.css`'s topology. Update §B.2 "Slide shell + scroll-snap presentation" accordingly. This eliminates ~3 editor patches.
2. **Pick Option 3 for publish/lock** (tiny `scripts/publish.mjs`), OR commit to Option 1 with explicit `<!-- EDITOR START/END -->` markers and budget it as a new serializer. Either way, **add the EDITOR START/END marker comments to the deck template spec in §B**. Recommend Option 3 for simplicity and true "off."
3. **Adopt the safe-area-frame approach for WYSIWYG** (`.slide-frame` with `aspect-ratio:16/9` centered inside a full-bleed `.slide`, ink+grain in the surrounding area). Update §B.2 and §D.
4. **Define the 4-tier emphasis ladder in the plan NOW**, and update the token-mapping table to reference tiers instead of ad-hoc per-component mappings. Add a column to `references/components.md` spec for "tier."
5. **Add Task 0: vendor noskillish/slides into `references/_upstream/` at a pinned commit** before any editor port begins. The implementor needs the actual source, not the planner's memory of it.

### Items explicitly out of scope of this debate
- Locked decisions #1–#11 (per debater instructions). The above changes refine HOW to execute those decisions; they do not relitigate WHAT was decided.

## Task Briefs

All five debate must-fixes are folded into the Plan above. Decisions: **window-as-scroller**,
**in-browser Publish (zero Node)**, **safe-area frame**, **4-tier emphasis ladder**, **vendor
noskillish first**. Implement in order; each task is self-contained. The skill lives at
`/home/ask/sync/projects/dev/opencode-skills-config/float-slides/`.

Reference material already in-repo (read, don't modify): `float-deck/assets/deck.css`
(window-scroller + grain + Float tokens + Lenis), `float-deck/assets/deck.js` (IntersectionObserver
nav-dot engine), `float-deck/assets/float-logo.svg`, `float-deck/references/brand.md`,
`float-pdf/assets/grain-tile.png` (baked grain) + `float-pdf/scripts/render-pdf.mjs` (how grain
is swapped for print). Brand HARD RULES (apply throughout): dark ink bg, Fraunces 300 headings,
ONE `<em class="accent">` mint-italic word per heading, eyebrow above each heading, mint dominant
/ tide = real 2nd track / coral ≤2 per surface, no pure white, no bold headings, no emoji, subtle
grain.

---

### Task 0 — Scaffold skill + vendor noskillish source (R5)
**Context:** Nothing exists at `float-slides/` yet. The implementor must build the editor against
REAL noskillish source, not notes.
**Objective:** Create the skill folder skeleton and vendor the upstream deck.
**Scope:**
- Create `float-slides/`, `float-slides/assets/`, `float-slides/references/`,
  `float-slides/references/_upstream/`.
- Fetch noskillish/slides `deck.html` (the default theme, single-file) at a **pinned commit**
  from https://github.com/noskillish/slides and save it as
  `references/_upstream/noskillish-deck.html`. Record the commit SHA in a one-line
  `references/_upstream/SOURCE.md` (URL + SHA + date). This is read-only reference.
- Copy `float-deck/assets/float-logo.svg` → `float-slides/assets/float-logo.svg`.
- Copy `float-deck/references/brand.md` → `float-slides/references/brand.md` verbatim
  (decision #10: full copy).
**Non-goals / Later:** No HTML/CSS/JS authoring yet. Don't modify the vendored file ever.
**Acceptance:** Folders exist; vendored deck + SOURCE.md present; logo + brand.md copied.

---

### Task 1 — Brand shell: tokens, grain, window-scroller, safe-area frame (R1, R3)
**Context:** This establishes the presentation skeleton of `assets/deck-template.html` BEFORE
components or scripts. Mirror `float-deck/assets/deck.css` topology.
**Objective:** A `deck-template.html` that renders an empty/2-slide Float-branded deck: dark ink,
grain, window-as-scroller vertical snap, safe-area 16:9 content frame, fonts wired.
**Scope (in `assets/deck-template.html`):**
- `<head>`: meta, title, Google Fonts link for Fraunces (ital 300/400) + Inter (300/400/500) +
  JetBrains Mono (400/500), inline `<style>`.
- `:root` Float tokens (copy the canonical set from brand.md §1) + the `--ed-*` editor tokens
  (copy names from vendored deck so the ported editor finds them).
- Grain: `body.grain::before` live SVG `feTurbulence`, fixed, opacity ~0.06, mix-blend screen
  (copy float-deck/deck.css approach).
- **Window-as-scroller (R1):** `html { scroll-snap-type: y mandatory }`; `#deck` is a
  non-scrolling wrapper (NO height/overflow); `.slide { min-height:100vh; scroll-snap-align:start;
  display:flex; align-items:center; justify-content:center }` — always displayed, never
  `display:none`.
- **Safe-area frame (R3):** `.slide-frame { aspect-ratio:16/9; width:min(100vw, calc(100vh*16/9));
  margin:auto }` — content goes inside this. Surrounding area is the same ink+grain.
- Body: `<body class="grain"> <div id="deck"> <section class="slide"><div class="slide-frame">…
  </div></section> ×2 </div>`, each section preceded by `<!-- ===== N. NAME ===== -->`.
- Title slide (slide 1) includes the Float logo lockup (inline SVG, mint, top of the frame) +
  eyebrow + `h1` with one `<em class="accent">` + lede + caption, all reusing brand type rules.
**Non-goals / Later:** No JS yet (static check only). No other components yet. No print CSS yet.
**Constraints:** No inner `.deck` scroller. No `display:none` on slides. Don't restructure the
class names the editor will later key on.
**Acceptance:** Opening the file in a browser shows two full-viewport Float slides; scrolling
snaps between them; content sits in a centered 16:9 area framed by ink; fonts load; grain subtle.

---

### Task 2 — Emphasis ladder + all 31 components, Float-skinned (R4)
**Context:** Task 1's shell is ready. Now port noskillish's 31 components as CSS + copy-paste
HTML, re-skinned to Float. Re-skin ONLY — keep noskillish's class names and markup structure so
the editor's text-leaf walker and parity stay intact.
**Objective:** All 31 components render on-brand inside `.slide-frame`, each mapped to one of the
4 emphasis tiers.
**Scope:**
- In `deck-template.html` `<style>`: add the **4-tier emphasis ladder** (Base / Raise / Mint
  panel / Hero — see Plan §D for exact token values) and the 31 component rules, re-skinned from
  the vendored deck's CSS using the token table (Plan "Token mapping"). Replace every light-system
  value (`#f5f5f3`, `#1a1a1a`, `#a0a09a`, `#fafaf8`, invert-to-black) with the Float token / tier.
- Headings get `em.accent` (mint Fraunces italic); drop noskillish's "bold-then-dim" as the
  signature (a muted `span.dim` continuation in `--cream-dim` is allowed but secondary).
- Add one example slide per component into the template body (so the template doubles as a
  component showcase, like float-deck), each with its `<!-- ===== N. NAME ===== -->` anchor and
  inside a `.slide-frame`.
- Write `references/components.md`: for each of the 31 components, the copy-paste HTML + a
  **"Emphasis tier" column/note** + which Float classes it uses. Mirror float-deck/components.md
  tone.
**Non-goals / Later:** No editor/nav JS. No print CSS. Don't invent new components beyond the 31.
**Constraints:** Mint dominant; tide only for genuine 2nd-track components (e.g. two-col "other
track", jeduf side); coral ≤2 per slide. One accent per heading. No emoji, no bold headings,
no pure white.
**Acceptance:** Every one of the 31 components appears on-brand; the 4 tiers are visually
distinct on ink (Base/Raise/Mint-panel/Hero don't collapse); components.md documents all 31 with
tiers.

---

### Task 3 — Core engine JS: nav, scroll-snap activation, keyboard/swipe, embed, print trigger
**Context:** Components render but the deck is static. Port + adapt the core engine. Keep the
`window.show()` / `window.refreshSlides()` contract (the editor depends on it).
**Objective:** Working navigation, nav dots, progress, fullscreen/zoom, `P`/Download-PDF, swipe,
`?embed`.
**Scope (first `<script>` in `deck-template.html`):**
- Build the engine modeled on `float-deck/assets/deck.js` (IntersectionObserver `{root:null,
  threshold:0.6}` sets `.active`, builds nav dots from `.slide[data-label]`, click-to-go) PLUS
  the noskillish core API surface: expose **`window.show(i)`** (= `slides[i].scrollIntoView({
  behavior:'smooth'})`), **`window.refreshSlides()`** (`slides = #deck > .slide`), `next/prev`,
  keyboard (←/→/Space/PageUp/PageDown/Home/End and **P** → `downloadPDF()`), touch swipe,
  `downloadPDF()` = `window.print()`, and `?embed` (hide nav/edit/pdf chrome, keep nav working).
- Keep fullscreen + zoom from float-deck/deck.js. Reveal-on-scroll (`.reveal`) optional.
- Add the nav-dots/progress/PDF/Edit button DOM + the `<!-- EDITOR:START -->`…`<!-- EDITOR:END -->`
  marker comments around the (still-empty) second script block, so Task 5/6 drop in cleanly.
- Add the Edit button (`id` known for publish removal) that sets `?edit`.
**Non-goals / Later:** No editor logic (Task 5). No publish (Task 6). No print CSS (Task 4).
**Constraints:** Do NOT toggle `display:none` to navigate (breaks scroll-snap + editor). `show()`
must scroll, not hide. Engine must be content-agnostic (no hardcoded slide strings).
**Acceptance:** Arrow keys/swipe/nav-dot/Home/End navigate via scroll-snap; progress + active dot
track the current slide; fullscreen works; `?embed` hides chrome; pressing `P` opens the print
dialog.

---

### Task 4 — Print CSS: 16:9 PDF pages with baked grain (no rebuild)
**Context:** `P` opens the dialog but the print layout isn't defined. Map each `.slide-frame` to
one landscape 16:9 page; swap live grain → baked PNG for fidelity.
**Objective:** `P` → a clean landscape-16:9 PDF, one page per slide, dark bg printed, grain baked,
no chrome.
**Scope (in `deck-template.html` `<style>`):**
- `@page { size: 13.333in 7.5in; margin: 0 }`.
- `@media print`: disable window scroll-snap; lay each `.slide` static and its `.slide-frame` at
  exactly `13.333in × 7.5in` with `break-after: page` (last slide `auto`); force dark ink bg +
  `print-color-adjust: exact` / `-webkit-print-color-adjust: exact`; hide nav, progress, edit,
  pdf chrome, and editor UI (`[data-ed-ui]`, rail, toolbar).
- **Grain swap:** in `@media print`, override `body.grain::before` to use the baked PNG as an
  inlined base64 data-URI (`background-image:url("data:image/png;base64,…") !important;
  mix-blend-mode:normal !important; opacity:.045 !important`). Generate the base64 from
  `float-pdf/assets/grain-tile.png` and inline it (this keeps the file self-contained; no
  external asset, no Node at runtime).
**Non-goals / Later:** No Playwright path (out of scope). Don't change on-screen grain.
**Constraints:** Single file — the baked grain must be inlined (data-URI), not a separate file
reference.
**Acceptance:** `P` in Chrome (Background graphics ON) yields a landscape 16:9 PDF; one page per
slide; ink bg printed (not white); grain visible but subtle; Fraunces/Inter crisp; no nav/edit
chrome on the page; content not clipped (safe-area frame == page).

---

### Task 5 — Port the `?edit` in-browser editor VERBATIM (R1 makes this clean)
**Context:** With window-as-scroller, the editor needs no presentation patches. Port it from the
vendored source between the EDITOR markers.
**Objective:** `?edit` gives inline text editing, thumbnail rail (reorder/dup/delete/drag), image/
video swap (file/drop/paste/link, base64 embed + downscale), undo, dirty tracking, save-in-place
(File System Access) / download fallback, autosave — theme-adapted to Float's dark ink.
**Scope:**
- Copy the editor `<script>` from `references/_upstream/noskillish-deck.html` into the
  `<!-- EDITOR:START -->`…`<!-- EDITOR:END -->` block of `deck-template.html`.
- Verify against the real source: it relies on `window.show()`/`window.refreshSlides()` (provided
  in Task 3), `#deck > .slide` order, and the `<!-- ===== N. NAME ===== -->` per-slide anchors
  (present from Tasks 1–2). The `splice()` save preserves byte-identical regions between anchors.
- Sanity-only adjustments: confirm dark auto-detect adds `ed-dark` (ink bg luminance < 128 — it
  will); confirm the rail offset uses padding (`body.ed-on { padding-left }`) not a scroll-
  container margin, so window scroll-snap is unaffected; confirm thumbnail scale uses a slide's
  rendered frame size and looks right with full-viewport slides.
- Ensure the `--ed-*` tokens referenced by the editor exist (added in Task 1).
**Non-goals / Later:** Publish button (Task 6). Do NOT refactor the editor's logic — port as-is.
**Constraints:** No Node. Keep edits surgical so upstream diffs stay legible.
**Acceptance:** `?edit`: click-edit text persists; rail reorders/duplicates/deletes/drag-reorders
slides and nav stays in sync; hover an image → replace via upload/drop/paste/link; Cmd/Ctrl+S
saves in place (Chromium, after one-time file pick) or downloads a copy elsewhere; editor chrome
is dark-themed; saved file diffs are slide-scoped.

---

### Task 6 — In-browser "Publish" (final HTML with editor OFF, zero Node)
**Context:** Recipients must not be able to edit. Add a Publish action that emits a clean file
with the editor code removed. Markers (`<!-- EDITOR:START/END -->`) already wrap the editor.
**Objective:** A `Publish` button in `?edit` writes `<name>.final.html` whose editor script is
gone; `?edit` does nothing on it; it still presents, embeds, and prints.
**Scope:**
- Add a `Publish` button to the editor toolbar (known id).
- Implement a small serializer (NOT a reuse of `splice()`): take the current document HTML with
  pending edits flushed (reuse the editor's existing "serialize current DOM to source" path so
  edits are included), then **string-slice out everything between `<!-- EDITOR:START -->` and
  `<!-- EDITOR:END -->`** (inclusive of the script, exclusive cut on the marker strings — do not
  regex `</script>`), and remove the Edit + Publish buttons by id.
- Write via File System Access "Save As" → suggested name `<name>.final.html` (Chromium) or
  trigger a download of the same bytes (other browsers).
**Non-goals / Later:** No Node script. Don't alter the original file (publish produces a NEW file).
**Constraints:** Single-file output; the published file must remain self-contained and zero-build.
**Acceptance:** Click Publish → a `.final.html` downloads/saves; opening it: navigation, `?embed`,
and `P`/PDF all work; appending `?edit` does nothing; the file contains NO content between the
EDITOR markers and no Edit/Publish buttons.

---

### Task 7 — SKILL.md + references polish
**Context:** Tie the skill together with docs in the float-deck/float-pdf house style.
**Objective:** A complete, discoverable skill.
**Scope:**
- Write `float-slides/SKILL.md`: front-matter (name + description with trigger phrases like
  float-deck's), when-to-reach-for-this vs float-deck/float-pdf, workflow (scaffold from template →
  compose from components.md → `?edit` to refine → `P` for PDF → Publish for the locked final),
  "what's bundled" tree, how the engine/editor/publish work, and the brand HARD RULES.
- Add `references/storytelling.md`: the 6 noskillish formats (TED six-beat, Sequoia pitch, MBB
  SCR, product launch, board update, sales) condensed to a usable outline each.
- Document the print tip prominently: Chrome + **Background graphics: ON**.
- Document offline-fonts note (self-host Fraunces/Inter/JetBrains Mono if presenting offline).
**Non-goals / Later:** No new components or JS.
**Acceptance:** SKILL.md reads coherently and matches the actual files; storytelling.md present;
print + offline notes documented.

---

## Files To Change
- `float-slides/assets/deck-template.html` — Task 6 additions: `<!-- EDITBTN:START/END -->` markers around Edit button in `#deck-chrome`; `Publish` button (`id="edPublish"`) added to toolbar `bar.innerHTML` and `restoreToolbar()`; `publish()` async function added inside editor IIFE; file grows from ~3896 → 4014 lines
- `float-slides/SKILL.md` — Task 7: new file; YAML front-matter + 7 sections (intro, when-to-use table, workflow, bundled tree, how-it-works, hard rules, no-build note)
- `float-slides/references/storytelling.md` — Task 7: new file; 6 narrative formats with beat sequences and component suggestions

## Implementation Notes (Task 6)
- **EDITBTN markers:** `<!-- EDITBTN:START -->` / `<!-- EDITBTN:END -->` added around the Edit button in `#deck-chrome` static markup (lines 2792–2794); publish slices this range to remove the Edit button from the published file
- **Publish button:** `<button id="edPublish">Publish</button>` added to `bar.innerHTML` (initial toolbar) and `restoreToolbar()` (re-render path); `$('edPublish').addEventListener('click', publish)` wired in both places; `offerDownload()` intentionally omits it (recovery state)
- **`publish()` function:** dedicated DOM-serialize path (does NOT call `splice()`); clones `documentElement`, strips `[data-ed-ui]` nodes, unwraps `[data-ed-wrap]`, removes contenteditable/spellcheck attrs, drops dirty/srcIdx datasets, removes `ed-on`/`ed-dark` body classes, prepends `<!DOCTYPE html>\n`; then slices EDITOR and EDITBTN marker ranges using `indexOf` with split marker strings (`'<!' + '-- EDITOR:START -->'`) to avoid literal match confusion while running inside the EDITOR block; hard-fails with error status if either marker pair is missing or inverted; writes via `showSaveFilePicker` (Chromium) or Blob+`<a download>` fallback; `saving = true` guard with `try/finally`; `blur()` before serializing
- **Slice test (Node.js, throwaway file deleted):** 19 assertions all passed — no EDITOR/EDITBTN markers, no `has('edit')` guard, no `editBtn`/`edPublish` ids, no editor IIFE functions (`liveSlides`, `makeThumb`, `splice`, `doSave`), no `saving = true`; core engine (`window.show`, `window.refreshSlides`), components (`.slide-frame`, `.tier-hero`), print CSS (`@media print`, `@page`), and grain data-URI all present; both script blocks pass `node --check`

## Current Status
Implementation complete, reviewed — Task 7 approved by both code-reviewer and claude-code-reviewer. All 7 tasks complete.

## Next Agent
**claude-tester** — verify all Task 7 deliverables: `float-slides/SKILL.md` present with well-formed YAML front-matter (name + description trigger phrases); "What's bundled" tree matches actual files; print "Background graphics: ON" tip prominent in Workflow step 6; Publish + ?edit + ?embed + P all described accurately; `float-slides/references/storytelling.md` present with all 6 formats (TED, Sequoia, MBB SCR, product launch, board update, sales) each with beats + component suggestions; offline-fonts note present; no claims contradicting the actual build (autosave 2s, 1600px image cap, anchor format `<!-- ========== N. NAME ========== -->`, suggestedName `<name>.final.html`, etc.).

## Implementation log

### Task 0 — 2026-06-30

**Files created:**
- `float-slides/` — skill root directory
- `float-slides/assets/` — assets directory
- `float-slides/references/` — references directory
- `float-slides/references/_upstream/` — vendored upstream directory
- `float-slides/references/_upstream/noskillish-deck.html` — vendored noskillish/slides deck at pinned commit `eb7ee5801c6913d0b03f3ea6e256e4cd9f241b08`
- `float-slides/references/_upstream/SOURCE.md` — records repo URL, pinned SHA, and date
- `float-slides/assets/float-logo.svg` — verbatim copy of `float-deck/assets/float-logo.svg`
- `float-slides/references/brand.md` — verbatim copy of `float-deck/references/brand.md`

**Pinned SHA:** `eb7ee5801c6913d0b03f3ea6e256e4cd9f241b08`

**Verification:**
- `noskillish-deck.html` starts with `<!DOCTYPE html>`, contains 23 occurrences of `class="slide"`, and 3 occurrences of `?edit` (editor script present) — 2768 lines total
- `SOURCE.md` records the SHA, repo URL, and date
- `float-logo.svg` copied verbatim (diff-identical to source)
- `brand.md` copied verbatim (diff-identical to source)

**Deviations:** None. Task 0 scope followed exactly; no HTML/CSS/JS authored; float-deck/ and float-pdf/ untouched.

### Task 1 — 2026-06-30

**Files created:**
- `float-slides/assets/deck-template.html` — brand/presentation shell (312 lines)

**What was built:**
- `<head>`: charset/viewport meta, `<title>Float — TITLE HERE</title>`, Google Fonts link for Fraunces (ital,wght 0,300;0,400;1,300;1,400), Inter (300;400;500), JetBrains Mono (400;500) with display=swap, inline `<style>`.
- `:root` with all canonical Float tokens (--ink, --ink-soft, --ink-line, --cream, --cream-soft, --cream-dim, --mint, --mint-bright, --tide, --coral + semantic aliases + font-family vars).
- All 6 `--ed-*` tokens declared with Float dark-theme values: `--ed-panel`, `--ed-ink`, `--ed-inv`, `--ed-line`, `--ed-dim`, `--ed-view-bg` — names copied exactly from vendored noskillish-deck.html.
- Grain: `body.grain::before` SVG feTurbulence overlay — byte-for-byte copy of float-deck/deck.css approach (same data-URI, 0.06 opacity, mix-blend-mode:screen, z-index:999, 200×200 tile).
- Window-as-scroller (R1): `html:not(.lenis-on) { scroll-snap-type: y mandatory }` + `scroll-snap-stop: always` on slides + `prefers-reduced-motion` fallback disabling snap. `#deck` is a plain `position:relative` wrapper with no height/overflow. `.slide { min-height:100vh; display:flex; ... }` — always displayed, never `display:none`.
- Safe-area frame (R3): `.slide-frame { aspect-ratio:16/9; width:min(100vw, calc(100vh*16/9)); margin:auto; position:relative; padding:5% 6% }`.
- Type utilities: `.eyebrow` (mono, uppercase, tracked, --cream-dim), `h1`/`h2` (Fraunces 300, tight tracking), `em.accent` (mint, Fraunces italic), `.lede` (Fraunces 300 light subtitle), `.caption` (mono small, --cream-dim), `.slide-logo-lockup` + `.logo-wordmark`.
- Float logo wave drift keyframes + reduced-motion override (needed for title-slide logo animation).
- Two slides with anchor comments matching vendored noskillish format: `<!-- ========== N. NAME ========== -->` (10 equals signs each side — this is what the save serializer preserves).
- Slide 1 (COVER): inline SVG logo lockup with unique ids (float-circle-1, float-grad-1) + eyebrow + h1 with one `<em class="accent">` + lede + caption.
- Slide 2 (SECTION): eyebrow + h2 with one `<em class="accent">` + lede.
- `<!-- EDITOR:START -->` / `<!-- EDITOR:END -->` marker comments in body for Task 5/6.
- No JavaScript, no print CSS (Tasks 3 and 4 respectively).

**Key choices:**
- **Grain reuse:** Copied float-deck/deck.css's exact SVG data-URI feTurbulence approach verbatim — same URL-encoded SVG, same 200×200 tile, same 0.06 opacity, same mix-blend-mode:screen. No invention.
- **--ed-* names mirrored:** All 6 names (`--ed-panel`, `--ed-ink`, `--ed-inv`, `--ed-line`, `--ed-dim`, `--ed-view-bg`) extracted from vendored noskillish-deck.html via grep and declared with Float dark-theme values (cream for ink, ink for inv, etc.) so the editor's `ed-dark` auto-detect path finds them.
- **Anchor comment format:** Used `<!-- ========== N. NAME ========== -->` (10 equals signs) matching the vendored noskillish deck exactly. The save serializer's regex `\n([ \t]*<!--[^\n]*-->)[ \t]*\n?$` captures any comment preceding a `<section class="slide">` — the exact format is preserved as-is, not parsed.
- **SVG hex values:** Kept hardcoded hex in SVG gradient stops (matching float-deck/deck-template.html convention — SVG `stop-color` attributes don't support CSS custom properties in all browsers; the outer ring uses `currentColor` which IS token-driven via `color: var(--mint)` on the lockup wrapper).
- **Lede font:** Set to Fraunces 300 (display) for both slides — brand.md §2 says Fraunces is for "hero subtitles" and the lede is the subtitle-level element. Task 2 can refine per-component if needed.

**Deviations:** None from Task 1 scope. No JS, no print CSS, no components beyond the two demo slides.

**Verification performed (static):**
- File starts with `<!DOCTYPE html>` ✓
- `scroll-snap-type: y mandatory` on `html:not(.lenis-on)` ✓
- `#deck` has no height/overflow (only `position:relative; z-index:1`) ✓
- `.slide` has `min-height:100vh`, `scroll-snap-align:start`, `display:flex` — never `display:none` ✓
- `.slide-frame` has `aspect-ratio:16/9` + `width:min(100vw, calc(100vh*16/9))` ✓
- Both slides have anchor comments `<!-- ========== N. NAME ========== -->` ✓
- Each heading has exactly one `<em class="accent">` ✓
- All 6 `--ed-*` token names match vendored noskillish-deck.html exactly ✓
- No `<script>` blocks ✓
- `<html lang="da">` ✓
- Both reviewers (code-reviewer + claude-code-reviewer) approved ✓

### Task 2 — 2026-06-30

**Files modified:**
- `float-slides/assets/deck-template.html` — expanded from 312 → ~2460 lines; added 4-tier emphasis ladder CSS + 31 component CSS rules + 32 showcase slides (31 components + 4b step-stack variant)

**Files created:**
- `float-slides/references/components.md` — ~1180-line component reference with table of contents, tier assignments, Float classes, and copy-paste HTML for all 31 components

**What was built:**

*CSS additions (in `<style>`):**
- 4-tier emphasis ladder helper classes (`.tier-base`, `.tier-raise`, `.tier-mint`, `.tier-hero`) with visually distinct token combos; applied to `.slide-frame` for slides 2 and 3
- 32 component CSS sections (J through AO), each labelled with component number and tier assignment
- All noskillish light-system values replaced with Float tokens: `#f5f5f3` → `--ink`, `#1a1a1a` → `--cream`/`--cream-soft`, `#a0a09a`/`#b5b5b0` → `--cream-dim`, `#fafaf8`/`#fff` cards → `--ink-soft` + `--ink-line`, invert-to-black emphasis → appropriate tier
- Added `h3`, `h4`, `h5`, `.subtitle`, `.meta`, `span.dim` type utilities
- Kept all upstream class names identical (`.quote-slide`, `.two-col`, `.col-stack`, `.step`, `.three-col`, `.cap-list`, `.callout`, `.dot-flow`, `.stack-grid`, `.spec-block`, `.jeduf`, `.jeduf-col.hero`, `.timeline`, `.stat-card.stat-dark`, `.quote-card.quote-dark`, `.logo-grid`, `.code-frame`, `.testimonial-grid`, `.logo-bar`, `.feature-cards`, `.update-row`, `.art-overlay`, `.split`, `.hero-frame`, `.image-cards`, `.caption-slide`, `.image-quote`, `.photo-grid`)
- `.art-overlay-bg` uses token-derived rgba values (no hardcoded hex)

*HTML additions (in `<body> #deck`):**
- 32 `<section class="slide">` elements, each preceded by `<!-- ========== N. NAME ========== -->` anchor comment (10 equals each side)
- All slide-level headings (h1/h2) have exactly one `<em class="accent">` (28 instances total); h3/h4/h5 sub-labels inside cards do not (consistent with float-deck convention)
- `quote-slide` class correctly on `<section>` (not `<h1>`) matching upstream
- Closing slide uses `class="slide dark quote-slide"` matching upstream pattern
- spec-block has direct h4/p children (no extra wrapper div) matching upstream

**Tier assignments (31 components → tier):**
- **Tier 4 Hero:** 1 Cover, 13 JEDUF hero centre col, 19 Dark slide, 20 Closing
- **Tier 3 Mint panel:** 2 Quote slide (`.slide-frame.tier-mint`), 15 stat-dark cards, 16 quote-dark card
- **Tier 2 Raise:** 3 Eyebrow+Headline+Subtitle (`.slide-frame.tier-raise`), 7 Dark callout, 10 Spec block, 18 Code slide, 23 Feature card row
- **Tier 1 Base:** 4 Two-column, 4b Step stack, 5 Three-column, 6 Capability list, 8 Dot flow, 9 Stack grid, 11 Product slide, 12 Collage slide, 13 JEDUF flanking cols, 14 Timeline, 15 Stat grid (base cards), 16 Quote pair (base card), 17 Logo grid, 21 Testimonial grid, 22 Logo bar, 24 Update row, 25 Art overlay, 26 Split slide, 27 Hero image, 28 Image card row, 29 Caption slide, 30 Image+quote, 31 Photo grid

**Images/placeholders:** Kept upstream Unsplash URLs for image components (26 Split, 27 Hero image, 28 Image card row, 29 Caption slide, 30 Image+quote, 31 Photo grid). Component 12 Collage uses a `.placeholder` div (no binary assets added). Art overlay (25) uses a CSS gradient background (token-derived rgba values).

**Tide usage:** Only for genuine 2nd-track components — `.col-tide` in two-col (the "other side"), `.jeduf-col:not(.hero)` labels/titles (the flanking extremes). Never decorative.

**Coral usage:** Only `.step.kill` (one use per slide max, well within ≤2/slide rule).

**Deviations / interpretations:**
- `.slide-frame` replaces noskillish's `.slide-inner` — this is a Task 1 design decision (the safe-area 16:9 frame) that was already reviewed and approved before Task 2 began
- `<span class="eyebrow">` replaces noskillish's `<div class="eyebrow">` — also a Task 1 decision; editor walker handles both since SPAN is in the INLINE set
- Component 13 JEDUF is a "mixed tier" slide: flanking cols = Tier 1 Base with tide labels, hero centre col = Tier 4 Hero treatment (radial mint wash + mint border-top + mint labels)
- Components 15 (stat-dark) and 16 (quote-dark) are "mixed tier" slides: base cards + one Tier 3 Mint panel emphasis card per slide
- No new JS authored (Tasks 3/4 scope)

**Review corrections applied:**
- Slide 3 h1 now has `<em class="accent">Én linje</em>` (was missing)
- spec-block extra wrapper `<div>` removed (now matches upstream direct-child structure)
- `.art-overlay-bg` hardcoded hex replaced with token-derived rgba values
- Slides 2 and 3 now use `.slide-frame.tier-mint` / `.slide-frame.tier-raise` (no inline styles)
- components.md "Inline accents" section fixed to show `span.dim` paired with `em.accent`

**Verification performed (static):**
- All 31 components have CSS rules (32 sections including 4b) ✓
- All 32 showcase slides have correct `<!-- ========== N. NAME ========== -->` anchors ✓
- components.md documents all 31 with tier each ✓
- 4 tiers use distinct token combos: Base (`--ink` bg) vs Raise (`--ink-soft` + 2px mint top) vs Mint panel (`rgba(184,242,214,0.06)` bg) vs Hero (radial gradient wash) ✓
- Every slide-level heading (h1/h2) has exactly one `em.accent` (28 instances) ✓
- No emoji ✓
- No pure white (`#fff`/`#ffffff`/`white`) in Float component CSS ✓
- No stray light-theme hex values (`#f5f5f3`, `#1a1a1a`, `#a0a09a`, `#b5b5b0`, `#fafaf8`, etc.) ✓
- No hardcoded hex in component CSS (outside `:root` and SVG stop-color) ✓
- No bold headings (font-weight 300 throughout) ✓
- Class names match vendored upstream ✓
- `quote-slide` class on `<section>` (not `<h1>`) ✓
- Closing uses `class="slide dark quote-slide"` matching upstream ✓
- No `<script>` blocks added ✓
- EDITOR:START/END markers preserved ✓
- Both reviewers (code-reviewer + claude-code-reviewer) approved ✓

### Task 3 — 2026-06-30

**Files modified:**
- `float-slides/assets/deck-template.html` — expanded from ~2462 → ~2968 lines; added nav/chrome CSS, data-label attributes, Chrome DOM, and core engine script

**What was built:**

*CSS additions (in `<style>`, before `</style>`):**
- `#slide-nav` — fixed right-side nav dots container (mirrors float-deck/deck.css exactly)
- `.nav-dot` / `.nav-dot:hover` / `.nav-dot.active` — dot styles (mint active, scale 1.5)
- `#progress` — fixed top progress bar (mint, 2px, transitions on width)
- `#deck-chrome` — fixed bottom-left PDF+Edit button row
- `.chrome-btn` — mono uppercase button style (on-brand: cream-dim, ink-line border)
- `#zoom-controls` — hidden by default, shown in `.is-fullscreen` (mirrors float-deck)
- `#fs-btn` — fullscreen toggle button (mirrors float-deck/deck.css)
- Responsive: `#slide-nav` tucks to 0.5rem on narrow viewports

*HTML additions (data-label on all slides):**
- All 32 `<section class="slide">` elements now have `data-label="…"` (Danish labels matching component names: "Forside", "Citat", "Overskrift", etc.)

*Chrome DOM (after `</div><!-- /#deck -->`, before `<!-- EDITOR:START -->`):**
- `<div id="progress">` — progress bar
- `<nav id="slide-nav" aria-label="Slide-navigation">` — nav dot container (engine fills it)
- `<div id="deck-chrome">` — PDF button (`onclick="downloadPDF()"`) + Edit button (`id="editBtn"`, sets `?edit`)
- `<div id="zoom-controls">` — zoom in/out/level (visible only in fullscreen)
- `<button id="fs-btn">` — fullscreen toggle with expand/compress SVG icons

*Engine `<script>` (before `<!-- EDITOR:START -->`):**
- Shared mutable state (`slides`, `currentIndex`, `observer`, `navEl`, `progressEl`, `deckEl`) declared at IIFE top
- `window.show(i)` — assigned synchronously; `slides[i].scrollIntoView({behavior:'smooth'})` with clamping; no-op if slides empty
- `window.refreshSlides()` — assigned synchronously; lazily resolves `deckEl` via `getElementById` (works before DOMContentLoaded since script is after `#deck`); unobserves old slides, re-queries, rebuilds dots, re-observes
- `window.next()` / `window.prev()` — assigned synchronously; call `window.show(currentIndex ± 1)`
- `DOMContentLoaded`: populates `slides`, wires `?embed`, builds nav dots, sets up IntersectionObserver, keyboard, touch, fullscreen, zoom
- IntersectionObserver `{root:null, threshold:0.6}` — sets `.active` on current slide, updates nav dots + progress
- Keyboard: ArrowDown/PageDown/ArrowRight/Space → next; ArrowUp/PageUp/ArrowLeft → prev; Home/End; P → downloadPDF(); guard for INPUT/TEXTAREA/SELECT/BUTTON/contentEditable
- Touch swipe: horizontal-only (vertical delegated to native scroll-snap to avoid double-advance bug)
- `?embed`: hides nav, progress, chrome, fs-btn, zoom-controls; navigation still works
- Fullscreen + zoom: mirrors float-deck/deck.js exactly
- `downloadPDF()` — global function; sets title to `'float-slides'`, calls `window.print()`, restores title

**Lenis decision:** Omitted for v1. Native scroll-snap is sufficient and keeps the file self-contained (no additional CDN deps beyond Google Fonts). The `html:not(.lenis-on)` CSS guard from Task 1 remains in place for future opt-in.

**data-label scheme:** All 32 slides labeled in Danish matching their component name (e.g. "Forside", "Citat", "Overskrift", "To kolonner", "Trin-stak", "Tre kolonner", "Kapabilitetsliste", "Callout", "Dot-flow", "Stack-grid", "Spec-blok", "Produkt", "Collage", "JEDUF", "Tidslinje", "Stat-grid", "Citat-par", "Logo-grid", "Kode", "Mørkt panel", "Afslutning", "Testimonials", "Logo-bar", "Feature-kort", "Opdateringer", "Art-overlay", "Split", "Hero-billede", "Billedkort", "Billedtekst", "Billede + citat", "Fotogrid").

**Review corrections applied:**
- Globals (`window.show`, `window.refreshSlides`, `window.next`, `window.prev`) moved to synchronous IIFE top (not inside DOMContentLoaded) so editor can call them immediately
- `window.next` and `window.prev` exposed on window (noskillish API surface)
- `downloadPDF()` title changed from `'float-deck'` to `'float-slides'`
- Vertical swipe branch removed (conflicts with native scroll-snap; would double-advance slides)
- `window.refreshSlides()` lazily resolves `deckEl` so it works before DOMContentLoaded

**Verification performed (static):**
- `window.show` assigned synchronously at IIFE top ✓
- `window.refreshSlides` assigned synchronously at IIFE top ✓
- `window.next` / `window.prev` assigned synchronously ✓
- All globals assigned before `document.addEventListener('DOMContentLoaded', ...)` ✓
- Navigation never sets `display:none` on slides ✓
- IntersectionObserver `{root:null, threshold:0.6}` ✓
- 32 slides with `data-label` ✓
- P key triggers `downloadPDF()` ✓
- `?embed` hides nav/progress/chrome/fs-btn/zoom-controls ✓
- Keyboard guard: INPUT/TEXTAREA/SELECT/BUTTON/contentEditable ✓
- Engine script before `<!-- EDITOR:START -->` ✓
- `id="editBtn"` sets `location.pathname + '?edit'` ✓
- `<!-- EDITOR:START -->` / `<!-- EDITOR:END -->` markers intact ✓
- `downloadPDF()` uses `'float-slides'` title ✓
- Horizontal-only swipe (no vertical branch) ✓
- Both reviewers (code-reviewer + claude-code-reviewer) approved ✓

### Task 4 — 2026-06-30

**Files modified:**
- `float-slides/assets/deck-template.html` — expanded from ~2968 → ~3121 lines; added `@page` rule + `@media print` block (~153 lines of CSS + 126,096-char base64 grain data-URI)

**Print approach:**
- `@page { size: 13.333in 7.5in; margin: 0 }` — landscape 16:9, matches PowerPoint widescreen
- `@media print` block: disables `scroll-snap-type` on `html`; lays `.slide` as `display:block; position:static; min-height:0; break-after:page`; sets `.slide-frame` to `width:13.333in; height:7.5in; aspect-ratio:auto; margin:0`; forces dark bg via `var(--ink)` + `print-color-adjust:exact`; hides all chrome + editor UI

**Blank-trailing-page prevention:**
- `.slide { min-height: 0 !important }` overrides the screen-mode `min-height: 100vh` that would otherwise create a blank page after each slide's content
- `.slide:last-child { break-after: auto; page-break-after: auto }` prevents a trailing blank page after the final slide

**Grain-per-page method — `.slide-frame::before` (position:absolute):**
- The live `body.grain::before` is `position:fixed` — in print, fixed elements only appear on the first page. Suppressed with `display:none !important`.
- Baked grain applied instead via `.slide-frame::before { position:absolute; inset:0; background-image:url("data:image/png;base64,…"); background-repeat:repeat; background-size:200px 200px; mix-blend-mode:normal; opacity:0.045 }`.
- `position:absolute` on `.slide-frame::before` is scoped to each `.slide-frame` (which is `position:relative`), so every printed page gets its own grain tile. No collision with on-screen `::before` usage (`.slide-frame` has no on-screen `::before`).
- `mix-blend-mode:normal; opacity:0.045` matches `float-pdf/scripts/render-pdf.mjs` exactly for print parity.

**Inlined base64:**
- Generated from `float-pdf/assets/grain-tile.png` (94,570 bytes) via `base64 -w0`
- Resulting base64 string: 126,096 chars
- Verified: decodes to valid PNG (magic bytes `89 50 4E 47`)
- No external path reference to `grain-tile.png` in the deck file

**Tier/background re-assertions:**
- `.tier-hero`, `.slide.dark`, `.tier-mint`, `.tier-raise`, `.jeduf-col.hero` all re-asserted with `!important` and `print-color-adjust:exact` so radial gradients and mint-panel tints print faithfully
- All colour values use CSS custom properties (`var(--ink)`, `var(--cream)`, `var(--ink-soft)`) — no hardcoded hex in the print block (rgba mint-wash literals remain as no token exists for them)

**Deviations:** None. CSS-only task; engine script, EDITOR markers, and component markup untouched.

**Verification performed (static):**
- `@page { size: 13.333in 7.5in; margin: 0 }` ✓
- `scroll-snap-type: none !important` in `@media print` ✓
- `.slide { min-height: 0 !important; break-after: page }` ✓
- `.slide:last-child { break-after: auto }` ✓
- `.slide-frame { width: 13.333in !important; height: 7.5in !important; aspect-ratio: auto !important }` ✓
- `#slide-nav, #progress, #deck-chrome, #fs-btn, #zoom-controls, [data-ed-ui], .ed-rail, .ed-toolbar, .ed-imgbar { display: none !important }` ✓
- `print-color-adjust: exact` and `-webkit-print-color-adjust: exact` ✓
- `var(--ink)`, `var(--cream)`, `var(--ink-soft)` used (no hardcoded hex) ✓
- `body.grain::before { display: none !important }` ✓
- `.slide-frame::before` with `data:image/png;base64,iVBORw0KGgo…` (126,096 chars) ✓
- `mix-blend-mode: normal !important; opacity: 0.045 !important` ✓
- No `grain-tile.png` external reference ✓
- `<!-- EDITOR:START -->` / `<!-- EDITOR:END -->` markers intact ✓
- On-screen grain (SVG feTurbulence, line 85) untouched ✓
- Both reviewers (code-reviewer + claude-code-reviewer) approved ✓

### Task 5 — 2026-06-30

**Files modified:**
- `float-slides/assets/deck-template.html` — expanded from ~3121 → 3892 lines; editor IIFE inserted between EDITOR markers; 3 reconciliation edits outside the editor block

**Editor port:**
- Copied the `?edit` IIFE verbatim from `references/_upstream/noskillish-deck.html` lines 1998–2765 into the `<!-- EDITOR:START -->` … `<!-- EDITOR:END -->` block (lines 3116–3889 in the output file)
- The IIFE is syntactically complete; only one `</script>` in the block (the legitimate closing tag); no string literal breaks; Node.js `--check` passes on both script blocks

**Deck selector reconciliation — option (a): added `class="deck"` to `<div id="deck">`:**
- The vendored editor uses `document.querySelector('.deck')` to find the deck wrapper
- Our wrapper was `<div id="deck">` with no class; added `class="deck"` so both `#deck` (engine) and `.deck` (editor) resolve to the same element
- Engine's `#deck` selector unaffected; editor body kept verbatim

**Additional reconciliation edits (outside editor block):**
- `class="edit-btn"` added to Edit button (`id="editBtn"`) so the editor's injected `body.ed-on .edit-btn { display: none }` rule hides it in edit mode
- First slide source markup changed to `class="slide active tier-hero"` so `ensureActive()` produces byte-identical output for the first slide when untouched (preserves the "untouched slides stay byte-identical" save contract)

**Sanity adjustments inside editor block (3 total, all documented with comments):**
1. `dh = innerHeight` instead of `deck.clientHeight` in `makeThumb()`: with window-as-scroller, `deck.clientHeight` = N×100vh (total scroll height), not one viewport height; `innerHeight` gives the correct single-slide viewport height for thumbnail aspect ratio
2. `body.ed-on { padding-left: ${RAIL_W}px }` instead of `body.ed-on .deck { width: calc(100vw - ${RAIL_W}px); margin-left: ${RAIL_W}px }`: Task Brief explicitly prefers body padding for window-as-scroller topology so the scroll viewport (`html`) is unambiguously unaffected
3. Print reset updated from `body.ed-on .deck { width: auto; margin-left: 0 }` to `body.ed-on { padding-left: 0 }` to match the padding approach

**Contract verification:**
- `window.show(i)` and `window.refreshSlides()` assigned synchronously by engine before editor IIFE runs ✓
- `liveSlides()` = `deck.querySelectorAll(':scope > .slide')` — finds all 32 `.slide` children of `#deck.deck` ✓
- Anchor regex `/\n([ \t]*<!--[^\n]*-->)[ \t]*\n?$/` matches `<!-- ========== N. NAME ========== -->` format ✓
- Slide regex `/^([ \t]*)<section class="slide[^>]*>/` matches `<section class="slide tier-hero" data-label="Forside">` etc. ✓
- All 6 `--ed-*` tokens declared in `:root` (`--ed-panel`, `--ed-ink`, `--ed-inv`, `--ed-line`, `--ed-dim`, `--ed-view-bg`) match all 6 referenced in editor CSS ✓
- `detectDark()` probes `document.body` bg: `#0A0E14` → luminance ≈ 13.5 < 128 → `ed-dark` applies automatically ✓
- `?edit` guard at line 3130: `if (!new URLSearchParams(location.search).has('edit')) return;` ✓
- `<!-- EDITOR:START -->` at line 3116, `<!-- EDITOR:END -->` at line 3889 ✓

**Deviations:** 3 documented sanity adjustments inside editor block (required by window-as-scroller topology or Task Brief explicit preference); 3 reconciliation edits outside editor block (deck class, edit-btn class, first-slide active). No logic refactored.

**Verification performed (static):**
- `?edit` guard present ✓
- `class="deck"` on `#deck` ✓
- `class="edit-btn"` on Edit button ✓
- First slide `class="slide active tier-hero"` ✓
- All 6 `--ed-*` tokens declared == referenced ✓
- `dh = innerHeight` in `makeThumb()` ✓
- `body.ed-on { padding-left }` (not `.deck { margin-left }`) ✓
- `detectDark()` present ✓
- Only one `</script>` in editor block ✓
- Node.js `--check` passes on both script blocks ✓
- EDITOR markers intact and wrap only the editor script ✓
- Both reviewers (code-reviewer + claude-code-reviewer) approved ✓

### Task 6 — 2026-06-30

**Files modified:**
- `float-slides/assets/deck-template.html` — expanded from ~3896 → 4014 lines; EDITBTN markers added around Edit button; Publish button added to toolbar; `publish()` function added inside editor IIFE

**Publish UI:**
- `<button id="edPublish" title="Publish: export a locked final HTML with the editor removed.">Publish</button>` added to `bar.innerHTML` (initial toolbar build, line ~3664) and `restoreToolbar()` (re-render path, line ~3685)
- `$('edPublish').addEventListener('click', publish)` wired in both places; `offerDownload()` intentionally omits it (recovery state)

**Source derivation method:**
- Dedicated DOM-serialize path — does NOT call `splice()` (satisfies Task Brief "NOT a reuse of `splice()`")
- Clones `document.documentElement`, strips `[data-ed-ui]` nodes (toolbar, rail, imgbar, injected style), unwraps `[data-ed-wrap]` spans, removes `contenteditable`/`spellcheck` attrs, drops `data-ed-dirty`/`data-src-idx` dataset keys, removes `ed-on`/`ed-dark` body classes, prepends `<!DOCTYPE html>\n`
- Mirrors `downloadCopy()` cleanup pattern (the editor's existing DOM→source path)
- `document.activeElement.blur()` called before clone to flush pending contenteditable state

**EDITBTN markers:**
- `<!-- EDITBTN:START -->` / `<!-- EDITBTN:END -->` added around the Edit button in `#deck-chrome` static markup (lines 2792–2794)
- Publish slices this range (inclusive) to remove the Edit button from the published file

**Marker slicing approach:**
- Marker strings split in JS source (`'<!' + '-- EDITOR:START -->'`) to avoid literal match confusion while `publish()` runs inside the EDITOR block
- Hard-fail guards: if either EDITOR or EDITBTN marker pair is missing or inverted, `publish()` sets an error status and returns early — does NOT write the file
- `saving = true` guard with `try/finally { saving = false }` prevents double-click races and blocks auto-save during publish

**File-write path:**
- `showSaveFilePicker` (Chromium) with `suggestedName = baseName + '.final.html'`; `baseName` derived from `location.pathname`
- Blob + `<a download>` fallback for other browsers

**Slice test (Node.js, throwaway `/tmp/deck.final.test.html` deleted):**
All 19 assertions passed:
- No EDITOR:START/END markers ✓
- No `has('edit')` guard ✓
- No `editBtn` id ✓
- No EDITBTN markers ✓
- `window.show`, `window.refreshSlides` present ✓
- `.slide-frame`, `.tier-hero` present ✓
- `@media print`, `@page` present ✓
- Grain data-URI present ✓
- No `edPublish` button ✓
- No `liveSlides`, `makeThumb`, `splice`, `doSave` functions ✓
- No `saving = true` ✓
- No `splice(diskText)` call ✓

**JS syntax:** Both script blocks pass `node --check` ✓

**Deviations / interpretations:**
- Task prompt's detailed design called for fileHandle+splice() path; Task Brief said "NOT a reuse of splice()". Resolved by using DOM-serialize exclusively (consistent behavior, simpler, satisfies Task Brief literally, mirrors `downloadCopy()` pattern)
- EDITBTN hard-fail is strict (Edit button is cosmetic vs. editor IIFE removal which is the real lock), but loud failure beats silent partial strip

**Both reviewers (code-reviewer + claude-code-reviewer) approved ✓**

### Task 7 — 2026-06-30

**Files created:**
- `float-slides/SKILL.md` — 211 lines; YAML front-matter + 7 sections
- `float-slides/references/storytelling.md` — 145 lines; 6 narrative formats

**What was built:**

*`float-slides/SKILL.md`:*
- YAML front-matter: `name: float-slides`; `description` with trigger phrases ("Float deck they can edit in the browser", "single-file slide deck", "deck with an in-browser editor", "Float slides to PDF", "noskillish-style Float deck", "self-contained HTML presentation", "deck that embeds in a webpage")
- "When to reach for this vs. float-deck vs. float-pdf" table: float-slides = single-file + in-browser editor + print-to-PDF; float-deck = multi-file + Lenis + no editor; float-pdf = Playwright-rendered landscape-A4 PDF
- Workflow: 7 steps (brand → copy template → compose from components → ?edit → ?embed → P/PDF → Publish)
- "What's bundled" tree matching actual files (SKILL.md, deck-template.html, float-logo.svg, brand.md, components.md, storytelling.md, _upstream/)
- "How it works": engine (window scroll-snap, IntersectionObserver, public API), safe-area frame (CSS snippet), editor (?edit, anchor comments, ed-dark auto-detect, padding-left rail offset), Publish (DOM-serialize path, EDITOR/EDITBTN marker slicing, showSaveFilePicker + Blob fallback)
- Hard rules: 10 brand rules from brand.md
- "No build step / no Node" section with offline-fonts note and Google Fonts download URLs

*`float-slides/references/storytelling.md`:*
- 6 formats: TED six-beat (Hook/Empathy/Insight/Evidence/Vision/Close), Sequoia/VC pitch (Problem/Solution/Market/Product/Traction/Team/Ask), MBB SCR (Situation/Complication/Resolution/Evidence/Next steps), Product launch (Stage/Reveal/Demo/Impact/CTA), Board update (Summary/KPIs/Progress/Risks/Decisions), Sales deck (Pain/Cost of inaction/Solution/Proof/Proposal/Close)
- Each format: when to use + beat table with suggested component numbers + notes

**Claims verified against deck-template.html:**
- Autosave debounce: 2 seconds (line 3151: `setTimeout(..., 2000)`) — corrected from initial draft which said "30-second"
- Image downscale: 1600px (`MAX_IMG_DIM = 1600`, line 3465) ✓
- Anchor format: `<!-- ========== N. NAME ========== -->` (10 equals each side) ✓
- `?edit` guard: `URLSearchParams(location.search).has('edit')` (line 3132) ✓
- `?embed` guard: `URLSearchParams(window.location.search).has('embed')` (line 2955) ✓
- P key: `e.key === 'p' || e.key === 'P'` → `downloadPDF()` (lines 3015–3017) ✓
- Publish suggestedName: `baseName + '.final.html'` (line 3957) ✓
- EDITOR markers: `<!-- EDITOR:START -->` line 3118, `<!-- EDITOR:END -->` line 4004 ✓
- EDITBTN markers: lines 2792–2794 ✓
- Float logo: inlined as SVG markup in template; `float-logo.svg` is standalone asset only ✓
- `@page { size: 13.333in 7.5in; margin: 0 }` ✓
- IntersectionObserver `{root: null, threshold: 0.6}` (line 2982) ✓
- `window.show`, `window.refreshSlides`, `window.next`, `window.prev` all assigned synchronously ✓

**Mismatches found between plan and actual build (for planner to reconcile):**
- The upstream noskillish deck has ONE storytelling format (a six-beat: Open → Act 1 → Act 2 → Act 3 → Act 4 → Close), not 6 separate formats. The Task Brief asked for 6 formats (TED, Sequoia, MBB, etc.) which are standard presentation frameworks, not derived from the upstream. `storytelling.md` was written as a general reference document mapping these 6 frameworks to float-slides components — this is the correct interpretation of the Task Brief.
- The plan's "What's bundled" tree in §A listed `grain-tile.b64.txt` as a separate file; the actual build inlined the base64 directly in `deck-template.html` (no separate file). The SKILL.md tree reflects the actual files.
- The plan mentioned `float-slides/SKILL.md` would "mirror float-deck tone" — confirmed; the house style (YAML front-matter, plain prose, hard-rules section) is matched.

**Both reviewers (code-reviewer + claude-code-reviewer) approved ✓**
