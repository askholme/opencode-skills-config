# Repository scout report — float-slides focus

_Last updated: 2026-06-30 by @repo-scout_

Repo-level facts: see `ARCHITECTURE.md` for full stack + project structure.

## float-slides skill — scope of this report

The `float-slides/` directory is one of several "Float" sub-skills in this repo
(siblings: `float-deck/`, `float-pdf/`). It is an **HTML/CSS slide template +
reference docs** — no JavaScript runtime, no build step, no tests.

```
float-slides/
├── assets/
│   ├── deck-template.html     ← single-file brand shell (HTML + inline CSS, ~2.5K lines)
│   └── float-logo.svg         ← logo mark
└── references/
    ├── brand.md               ← Float brand rules: tokens, type, voice, checklist
    ├── components.md          ← 31 copy-paste HTML components (Tier 1-4)
    └── _upstream/
        ├── noskillish-deck.html  ← upstream source snapshot
        └── SOURCE.md             ← upstream URL + commit SHA
```

## Stack relevant to reviewing float-slides

- **HTML5 + inline CSS** (no preprocessor, no framework, no JS). All styling
  lives in the `<style>` block of `assets/deck-template.html`.
- **CSS custom properties** at `:root` for all colour/type tokens — never
  hardcode hex.
- **Google Fonts** loaded via `<link>`: Fraunces (display), Inter (body),
  JetBrains Mono (mono labels).
- **Language**: most Float client copy is Danish (`lang="da"` on `<html>`).
  Match the language of the request; keep `lang` correct.

## Conventions specific to float-slides

### Tokens (from `references/brand.md`, also in `:root` of `deck-template.html`)

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0A0E14` | page background |
| `--ink-soft` | `#11161E` | card / panel background |
| `--ink-line` | `#1C232E` | borders, rules |
| `--cream` | `#F2EDE3` | primary text, headings |
| `--cream-soft` | `#E8E1D2` | body copy |
| `--cream-dim` | `#A39E91` | muted metadata, captions |
| `--mint` | `#B8F2D6` | PRIMARY accent (the Float signature) |
| `--mint-bright` | `#6BE3A8` | rare brighter mint |
| `--tide` | `#7AA8E0` | SECONDARY accent (parallel track) |
| `--coral` | `#FF8B6B` | WARNING / "here's the catch" (≤2 uses/slide) |
| `--font-display` | Fraunces 300/400 + italic | all headings |
| `--font-body` | Inter 300/400/500 | body copy |
| `--font-mono` | JetBrains Mono 400/500 | eyebrows, labels, badges (UPPERCASE + tracked) |

**Rule: never hardcode hex in markup — always reference the variable.** See
`brand.md:14-16` and `components.md` inline examples (`var(--mint)` etc.).

### 4-tier emphasis ladder (from `components.md`)

Every component is assigned to exactly one tier:

| Tier | Background | Border | Use |
|---|---|---|---|
| 1 — Base | `--ink` | 1px `--ink-line` | default content slides |
| 2 — Raise | `--ink-soft` | 1px `--ink-line` + 2px `--mint` top | one insight, sections |
| 3 — Mint panel | `rgba(184,242,214,0.06)` | `rgba(184,242,214,0.18)` | hero numbers, quotes |
| 4 — Hero | radial mint wash over `--ink` | — | cover, dark, closing |

### Component rules (from `components.md` and `brand.md`)

- **Every heading must have exactly one `<em class="accent">`** — the Float
  signature. No two accents in one heading; don't skip on the main heading.
  `brand.md:77-79`, `components.md:1146-1155`
- **Eyebrow (mono, uppercase, tracked) sits above each heading.**
  `brand.md:82-83`
- **Lists use a mint `/` marker via `::before`** — not bullets/checkmarks.
  `brand.md:84`
- **Cards:** `--ink-soft` fill, `--ink-line` border, ~1rem radius, 2px accent
  top-border (mint = primary, tide = secondary, coral = caution).
  `brand.md:142-143`
- **No pure white** (`#fff`/`white`) anywhere in component CSS.
  `components.md:1178`
- **No bold headings** — `font-weight: 300` throughout. `components.md:1179`
- **No emoji.** `components.md:1180`
- **Slide content centred in `max-width: 1200px` `.inner`** with generous
  margins; nothing touches edges. `brand.md:140`
- **Grain overlay:** web = `class="grain"` on body (SVG `feTurbulence`,
  opacity 0.06, `mix-blend-mode: screen`); PDF swaps to pre-baked PNG tile.
  `brand.md:88-100`
- **Logo:** thin-ring circle + "Float" wordmark in Fraunces 300 mint,
  `letter-spacing: -0.02em`, sat to the right with `gap: ~0.6rem`. When the
  same page inlines the SVG more than once, give each copy **unique ids**
  (`float-circle-2`, `float-grad-2`, …) so `clipPath`/`gradient` refs don't
  collide. `brand.md:104-119`

### Voice & copy (from `brand.md` section 5)

- Plain, senior, confident. Short declarative sentences. No hype, no
  exclamation marks, no emoji.
- Eyebrows are scene-setting metadata (e.g. "FORSLAG · LØSNINGSAFDÆKNING"),
  not sentences.
- One idea per surface. If a slide is getting crowded, split it.

### Quick checklist (from `brand.md:151-159`)

- [ ] Exactly one `<em class="accent">` italic word in each heading
- [ ] Eyebrow (mono, uppercase, tracked) above each heading
- [ ] Mint dominant; tide only for a genuine second track; coral ≤2 uses
- [ ] `class="grain"` on body (web) / baked grain (PDF)
- [ ] Float logo lockup top-right of title surface, wordmark in Fraunces 300 mint
- [ ] No pure white, no bold headings, no emoji
- [ ] Correct `lang` and language matches the client

## File organisation (float-slides)

| File | Role |
|---|---|
| `assets/deck-template.html` | The actual deliverable: single-file HTML+CSS slide template containing all 31 components. ~2.5K lines. |
| `assets/float-logo.svg` | Float mark (thin-ring circle with mint→tide wave gradient). |
| `references/brand.md` | Authoritative brand rules: tokens, type, voice, layout, checklist. |
| `references/components.md` | 31 copy-paste components, each tagged to a tier and listing the Float classes used. |
| `references/_upstream/noskillish-deck.html` | Frozen upstream source for diff/comparison. |
| `references/_upstream/SOURCE.md` | Upstream URL + commit SHA + date. |

## Linting and testing commands

**None exist for float-slides.** No `Makefile`, `package.json`, `pyproject.toml`,
linter config, or test runner applies to this skill. The deliverable is
hand-written HTML+CSS that is validated visually in a browser, not by automation.

To review changes manually:
- Open `assets/deck-template.html` in a browser and skim each component.
- Diff against `references/_upstream/noskillish-deck.html` to spot unintended
  drift from upstream.
- For brand-rule compliance, follow the `brand.md:151-159` checklist by hand.

## Do and don't patterns

### Do
- **Use CSS custom properties, not hardcoded hex** (`var(--mint)`, never
  `#B8F2D6` inline). `brand.md:14-16`
- **Use the 4-tier ladder to assign a tier to every component.** `components.md:10-21`
- **Use the eyebrow + heading + `em.accent` rhythm on every slide.**
  `components.md:1146-1155`
- **Match `lang` and copy language to the client.** `brand.md:126`
- **Give each inline SVG logo unique ids** when the same page repeats it.
  `brand.md:117-119`

### Don't
- **Don't use bold headings** (`font-weight: 300` throughout). `components.md:1179`
- **Don't use pure white** (`#fff`/`white`). `components.md:1178`
- **Don't use emoji.** `components.md:1180`
- **Don't use coral for decoration** — max 2 uses per slide, and only for
  caution / "here's the catch" notes. `brand.md:46-47`
- **Don't use tide decoratively** — only for a genuine second track
  (`.col-tide`, `.jeduf-col:not(.hero)`). `components.md:1174-1175`
- **Don't add a second `<em class="accent">` in a single heading.**
  `brand.md:79`
- **Don't write bullets/checkmarks in lists** — use the mint `/` marker.
  `brand.md:84`
- **Don't drift from upstream silently** — `_upstream/` is the reference
  snapshot; diff before merging.

## Open questions (float-slides)

- **No `SKILL.md` exists at the `float-slides/` root.** Sibling skills like
  `pptx-numa/` have a `SKILL.md` that agents load; `float-slides/` ships only
  `assets/` + `references/`. Is this skill meant to be loaded as raw assets,
  or is there a missing entry-point doc?
- **`deck-template.html` is a single ~2.5K-line file** (HTML + inline CSS for
  31 components + 4-tier system). No split into partials, no sourcemaps, no
  minified build. Is this intentional (single-file deliverable) or a
  pre-refactor state?
- **The 31 components in `components.md` are documented in Danish**
  (placeholder text like "Første trin", "Et stærkt citat"). The doc itself
  is English. This matches "match the language of the client" but means
  review of placeholder wording should not flag Danish as an error.
