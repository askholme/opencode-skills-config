# Float slides — component reference

Copy-paste building blocks for `assets/deck-template.html`. All classes are
defined in the `<style>` block of that file. Each component maps to one of the
**4 emphasis tiers** (see below). Compose slides from these instead of writing
new CSS. Content goes inside `.slide-frame`.

---

## 4-tier emphasis ladder

Every component is assigned to exactly one tier. The tiers are visually distinct
on the ink background — they do not collapse into identical panels.

| Tier | Name | Background | Border | Text accent |
|---|---|---|---|---|
| 1 | **Base** | `--ink` | 1px `--ink-line` | `--cream-soft` |
| 2 | **Raise** | `--ink-soft` | 1px `--ink-line` + 2px `--mint` top | `--cream-soft`, mint strong |
| 3 | **Mint panel** | `rgba(184,242,214,0.06)` | `rgba(184,242,214,0.18)` | `--mint` |
| 4 | **Hero** | radial mint wash over `--ink` | — | `--mint-bright`, Fraunces display |

---

## Table of contents

1. [Cover](#1-cover)
2. [Quote slide](#2-quote-slide)
3. [Eyebrow + Headline + Subtitle](#3-eyebrow--headline--subtitle)
4. [Two-column](#4-two-column)
4b. [Two-column step stack](#4b-two-column-step-stack)
5. [Three-column](#5-three-column)
6. [Capability list (Q&A)](#6-capability-list-qa)
7. [Dark callout](#7-dark-callout)
8. [Dot flow](#8-dot-flow)
9. [Stack grid](#9-stack-grid)
10. [Spec block + outputs](#10-spec-block--outputs)
11. [Product slide](#11-product-slide)
12. [Collage slide](#12-collage-slide)
13. [JEDUF three-column](#13-jeduf-three-column)
14. [Timeline](#14-timeline)
15. [Stat grid](#15-stat-grid)
16. [Quote pair](#16-quote-pair)
17. [Logo grid](#17-logo-grid)
18. [Code slide](#18-code-slide)
19. [Dark slide](#19-dark-slide)
20. [Closing](#20-closing)
21. [Testimonial grid](#21-testimonial-grid)
22. [Logo bar](#22-logo-bar)
23. [Feature card row](#23-feature-card-row)
24. [Update row](#24-update-row)
25. [Art overlay](#25-art-overlay)
26. [Split slide](#26-split-slide)
27. [Hero image](#27-hero-image)
28. [Image card row](#28-image-card-row)
29. [Caption slide](#29-caption-slide)
30. [Image + quote](#30-image--quote)
31. [Photo grid](#31-photo-grid)
- [Inline accents](#inline-accents)

---

## 1. Cover

**Tier 4 — Hero.** Full-bleed radial mint wash. Logo lockup top-right. Large
Fraunces display heading with one `em.accent`. The title slide of every deck.

**Float classes:** `.slide.tier-hero`, `.slide-frame`, `.slide-logo-lockup`,
`.logo-wordmark`, `.eyebrow`, `h1`, `em.accent`, `.lede`, `.caption`

```html
<!-- ========== 1. COVER ========== -->
<section class="slide tier-hero">
  <div class="slide-frame">

    <div class="slide-logo-lockup">
      <!-- paste float-logo.svg markup here; use unique clipPath/gradient ids -->
      <span class="logo-wordmark">Float</span>
    </div>

    <span class="eyebrow">FLOAT · AI-NATIVE STRATEGI &amp; IMPLEMENTERING</span>
    <h1>Headline med <em class="accent">accent</em></h1>
    <p class="lede">Subtitle i Fraunces light — én sætning der sætter rammen.</p>
    <p class="caption">Måned ÅÅÅÅ</p>

  </div>
</section>
```

---

## 2. Quote slide

**Tier 3 — Mint panel.** Subtle mint-tinted frame. Large Fraunces display quote
with one `em.accent`. One bold statement that opens or pivots the talk.

**Float classes:** `.slide.quote-slide`, `.slide-frame.tier-mint`, `.eyebrow`, `h1`,
`em.accent`

```html
<!-- ========== 2. QUOTE SLIDE ========== -->
<section class="slide quote-slide">
  <div class="slide-frame tier-mint">

    <span class="eyebrow">ÅBNINGSSÆTNING</span>
    <h1>Et <em class="accent">dristigt</em> udsagn der åbner samtalen.</h1>

  </div>
</section>
```

---

## 3. Eyebrow + Headline + Subtitle

**Tier 2 — Raise.** Ink-soft background with 2px mint top-border. The standard
section-opening slide: eyebrow sets context, heading lands the point, subtitle
adds nuance.

**Float classes:** `.slide`, `.slide-frame.tier-raise`, `.eyebrow`,
`h1`, `em.accent`, `.subtitle`

```html
<!-- ========== 3. EYEBROW + HEADLINE + SUBTITLE ========== -->
<section class="slide">
  <div class="slide-frame tier-raise">

    <span class="eyebrow">SEKTIONSLABEL</span>
    <h1>Sektionsoverskrift. <em class="accent">Én linje</em> der lander.</h1>
    <p class="subtitle">En undertekst der tilføjer nuance uden at sige alt. Hold den kort.</p>

  </div>
</section>
```

---

## 4. Two-column

**Tier 1 — Base.** Side-by-side comparison. Left column = primary track (mint
eyebrow default); right column = secondary track (add `.col-tide` for tide
eyebrow/heading — genuine 2nd track, not decorative).

**Float classes:** `.slide`, `.slide-frame`, `.two-col`, `.col-tide`, `.eyebrow`,
`h2`, `em.accent`, `p`

```html
<!-- ========== 4. TWO-COLUMN ========== -->
<section class="slide">
  <div class="slide-frame">

    <div class="two-col">
      <div>
        <span class="eyebrow">PROBLEMET</span>
        <h2>Hvad der <em class="accent">ikke</em> virker.</h2>
        <p>Beskriv situationen i dag. Vær specifik. Undgå abstraktioner.</p>
      </div>
      <div class="col-tide">
        <span class="eyebrow">LØSNINGEN</span>
        <h2>Hvad vi <em class="accent">byggede</em>.</h2>
        <p>Beskriv løsningen. Samme længde og tone som problemet.</p>
      </div>
    </div>

  </div>
</section>
```

---

## 4b. Two-column step stack

**Tier 1 — Base.** Left column: heading + subtitle. Right column: sequential
steps with status modifiers. `.step.dim` = blocked/future; `.step.kill` = coral
negative outcome; `.step.live` = mint positive outcome.

**Float classes:** `.slide`, `.slide-frame`, `.two-col`, `.col-stack`, `.step`,
`.step.dim`, `.step.kill`, `.step.live`

```html
<!-- ========== 4b. TWO-COLUMN STEP STACK ========== -->
<section class="slide">
  <div class="slide-frame">

    <div class="two-col">
      <div>
        <span class="eyebrow">SEKTIONSLABEL</span>
        <h2>Titel for <em class="accent">trinene</em> til højre.</h2>
        <p class="subtitle">Kort forklaring af hvad disse trin repræsenterer.</p>
      </div>
      <div class="col-stack">
        <div class="step">Første trin</div>
        <div class="step">Andet trin</div>
        <div class="step">Tredje trin</div>
        <div class="step dim">Fjerde trin (dæmpet = bloker)</div>
        <div class="step dim">Femte trin (dæmpet)</div>
        <div class="step kill">Negativt slutresultat</div>
      </div>
    </div>

  </div>
</section>
```

---

## 5. Three-column

**Tier 1 — Base.** Structural breakdown into three parallel tracks. Use for
Why/How/What, three pillars, three phases, etc.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.three-col`, `h3`, `p`

```html
<!-- ========== 5. THREE-COLUMN ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">SEKTIONSLABEL</span>
    <h2>Overskrift for <em class="accent">nedbrydningen</em>.</h2>
    <div class="three-col" style="margin-top: 2rem;">
      <div>
        <h3>Hvorfor</h3>
        <p>Motivationen. Hvorfor det betyder noget. Hvorfor nu.</p>
      </div>
      <div>
        <h3>Hvordan</h3>
        <p>Mekanismen. De fire søjler. Strukturen.</p>
      </div>
      <div>
        <h3>Hvad</h3>
        <p>Resultatet. Hvad du går derfra med.</p>
      </div>
    </div>

  </div>
</section>
```

---

## 6. Capability list (Q&A)

**Tier 1 — Base.** Q&A rows separated by `--ink-line` rules. Left column =
question (cream); right column = answer (cream-dim). One callout per deck max.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.cap-list`, `.cap-row`, `.cap-q`, `.cap-a`

```html
<!-- ========== 6. CAPABILITY LIST (Q&A) ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">HVAD DET LØSER</span>
    <h2>Spørgsmålene du har. <em class="accent">Besvaret.</em></h2>
    <div class="cap-list" style="margin-top: 1.5rem;">
      <div class="cap-row">
        <div class="cap-q">Spørgsmål ét?</div>
        <div class="cap-a">Et klart, specifikt svar der adresserer spørgsmålet direkte.</div>
      </div>
      <div class="cap-row">
        <div class="cap-q">Spørgsmål to?</div>
        <div class="cap-a">Endnu et konkret svar. Undgå forbehold.</div>
      </div>
      <div class="cap-row">
        <div class="cap-q">Spørgsmål tre?</div>
        <div class="cap-a">Hold svarene parallelle i længde og tone.</div>
      </div>
    </div>

  </div>
</section>
```

---

## 7. Dark callout

**Tier 2 — Raise.** Ink-soft panel with 2px mint top-border. One per deck max.
Use for the single most important insight. `strong` inside `.callout p` renders
in mint (not bold).

**Float classes:** `.slide`, `.slide-frame`, `.callout`, `.callout h3`,
`.callout p`, `strong`

```html
<!-- ========== 7. DARK CALLOUT ========== -->
<section class="slide">
  <div class="slide-frame">

    <div class="callout">
      <h3>Hvorfor nu</h3>
      <p>Øjeblikket lander her. <strong>Den vigtigste indsigt i mint.</strong> Derefter den understøttende kontekst. Én callout per deck max.</p>
    </div>

  </div>
</section>
```

---

## 8. Dot flow

**Tier 1 — Base.** Horizontal process pipeline with mint dots connected by an
`--ink-line` rule. Up to 5 steps. Use for sequential processes or pipelines.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.dot-flow`, `.dot-step`, `.dot`, `h4`, `p`

```html
<!-- ========== 8. DOT FLOW ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">FLOWET</span>
    <h2>Sådan <em class="accent">virker</em> det. Trin for trin.</h2>
    <div class="dot-flow">
      <div class="dot-step"><div class="dot"></div><h4>Trin 1</h4><p>Kort beskrivelse</p></div>
      <div class="dot-step"><div class="dot"></div><h4>Trin 2</h4><p>Kort beskrivelse</p></div>
      <div class="dot-step"><div class="dot"></div><h4>Trin 3</h4><p>Kort beskrivelse</p></div>
      <div class="dot-step"><div class="dot"></div><h4>Trin 4</h4><p>Kort beskrivelse</p></div>
      <div class="dot-step"><div class="dot"></div><h4>Trin 5</h4><p>Kort beskrivelse</p></div>
    </div>

  </div>
</section>
```

---

## 9. Stack grid

**Tier 1 — Base.** 4-column grid of category cards. Each card has a mono label
and a list of tools with mint mark squares. Use for tech stacks, partner lists,
tool categories.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.stack-grid`, `.stack-card`, `.stack-card-label`, `.stack-tool`, `.mark`

```html
<!-- ========== 9. STACK GRID ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">STAKKEN</span>
    <h2>Bygget på <em class="accent">værktøjer</em> du allerede kender.</h2>
    <div class="stack-grid">
      <div class="stack-card">
        <div class="stack-card-label">Kategori ét</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj A</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj B</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj C</div>
      </div>
      <div class="stack-card">
        <div class="stack-card-label">Kategori to</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj D</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj E</div>
      </div>
      <div class="stack-card">
        <div class="stack-card-label">Kategori tre</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj F</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj G</div>
      </div>
      <div class="stack-card">
        <div class="stack-card-label">Kategori fire</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj H</div>
        <div class="stack-tool"><span class="mark"></span>Værktøj I</div>
      </div>
    </div>

  </div>
</section>
```

---

## 10. Spec block + outputs

**Tier 2 — Raise.** Input → process → output flow. The `.spec-block` is a Raise
card (ink-soft + 2px mint top). Context pills and output cards are Base tier.
Use for AI pipelines, data flows, transformation diagrams.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.spec-flow`, `.spec-block`, `.ctx-row`, `.ctx-label`, `.ctx-pill`,
`.ai-divider`, `.line`, `.ai-pill`, `.outputs-row`, `.output-card`

```html
<!-- ========== 10. SPEC BLOCK + CONTEXT + OUTPUTS ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">MEKANISMEN</span>
    <h2>Ét input. <em class="accent">Tre</em> outputs.</h2>
    <div class="spec-flow">
      <div class="spec-block">
        <h4>Inputtet</h4>
        <p>Hvad der går ind</p>
      </div>
      <div class="ctx-row">
        <span class="ctx-label">trækker fra</span>
        <span class="ctx-pill">Kilde 1</span>
        <span class="ctx-pill">Kilde 2</span>
        <span class="ctx-pill">Kilde 3</span>
      </div>
      <div class="ai-divider">
        <div class="line"></div>
        <span class="ai-pill">Proces</span>
        <div class="line"></div>
      </div>
      <div class="outputs-row">
        <div class="output-card"><h5>Output A</h5><p>Hvad det producerer.</p></div>
        <div class="output-card"><h5>Output B</h5><p>Hvad det producerer.</p></div>
        <div class="output-card"><h5>Output C</h5><p>Hvad det producerer.</p></div>
      </div>
    </div>

  </div>
</section>
```

---

## 11. Product slide

**Tier 1 — Base.** Asymmetric layout: left = meta + description, right = large
display name. Use for product showcases, named deliverables, or named concepts.

**Float classes:** `.slide`, `.slide-frame`, `.product-row`, `.product-meta`,
`.product-num`, `.product-tag`, `.product-headline`, `.product-desc`,
`.product-stat`, `.product-name`

```html
<!-- ========== 11. PRODUCT SLIDE ========== -->
<section class="slide">
  <div class="slide-frame">

    <div class="product-row">
      <div class="product-meta">
        <div class="product-num">/01</div>
        <div class="product-tag">Et kort, slagkraftigt citat eller krog.</div>
        <h3 class="product-headline">Én-linje beskrivelse af hvad dette gør.</h3>
        <p class="product-desc">To eller tre sætninger der forklarer det. Hold det konkret.</p>
        <div class="product-stat">Et par timer · Én weekend · Eller hvad der er sandt</div>
      </div>
      <div class="product-name">Navn<sup>™</sup></div>
    </div>

  </div>
</section>
```

---

## 12. Collage slide

**Tier 1 — Base.** Full-frame media display. The `.collage` container holds an
`img`, `video`, or `.placeholder`. Use for cinematic single-image moments.

**Float classes:** `.slide.collage-slide`, `.slide-frame`, `.collage`,
`.placeholder`

```html
<!-- ========== 12. COLLAGE SLIDE ========== -->
<section class="slide collage-slide">
  <div class="slide-frame" style="padding: 2% 3%;">
    <div class="collage">
      <img src="media/image.jpg" alt="">
      <!-- or: <div class="placeholder">BILLEDE · 3:4</div> -->
    </div>
  </div>
</section>
```

---

## 13. JEDUF three-column

**Tier 1 (flanking) + Tier 4 (hero centre).** Three-column comparison: two
extremes flanking a recommended middle path. Flanking columns use tide for
labels/titles (genuine 2nd track). Hero centre column uses mint panel + mint
top-border (Tier 4 treatment).

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.jeduf`, `.jeduf-col`, `.jeduf-col.hero`, `.jeduf-label`, `.jeduf-title`,
`.jeduf-philosophy`, `.jeduf-step`

```html
<!-- ========== 13. JEDUF THREE-COLUMN ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">MIDTERVEJEN</span>
    <h2>Mellem to <em class="accent">ekstremer</em>. Det der faktisk virker.</h2>
    <div class="jeduf">
      <div class="jeduf-col">
        <div class="jeduf-label">For meget</div>
        <div class="jeduf-title">Ekstrem A</div>
        <div class="jeduf-philosophy">"En filosofi-citat der fanger ekstremet."</div>
        <div class="jeduf-step">Trin 1</div>
        <div class="jeduf-step">Trin 2</div>
        <div class="jeduf-step">Trin 3</div>
        <div class="jeduf-step">Trin 4</div>
      </div>
      <div class="jeduf-col hero">
        <div class="jeduf-label">Præcis rigtigt</div>
        <div class="jeduf-title">Midtervejen</div>
        <div class="jeduf-philosophy">"Filosofien bag den balancerede tilgang."</div>
        <div class="jeduf-step">Trin 1</div>
        <div class="jeduf-step">Trin 2</div>
        <div class="jeduf-step">Trin 3</div>
        <div class="jeduf-step">Trin 4</div>
      </div>
      <div class="jeduf-col">
        <div class="jeduf-label">For lidt</div>
        <div class="jeduf-title">Ekstrem B</div>
        <div class="jeduf-philosophy">"En filosofi-citat der fanger det andet ekstrem."</div>
        <div class="jeduf-step">Trin 1</div>
        <div class="jeduf-step">Trin 2</div>
        <div class="jeduf-step">Trin 3</div>
        <div class="jeduf-step">Trin 4</div>
      </div>
    </div>

  </div>
</section>
```

---

## 14. Timeline

**Tier 1 — Base.** Vertical timeline with mint dots and `--ink-line` connectors.
Year labels in mono cream-dim. Use for company history, project phases, roadmaps.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.timeline`, `.timeline-row`, `.timeline-year`, `.timeline-track`,
`.timeline-dot`, `.timeline-line`, `.timeline-content`

```html
<!-- ========== 14. TIMELINE ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">REJSEN</span>
    <h2>Hvordan vi kom <em class="accent">hertil</em>. År for år.</h2>
    <div class="timeline">
      <div class="timeline-row">
        <div class="timeline-year">År 1</div>
        <div class="timeline-track"><div class="timeline-dot"></div><div class="timeline-line"></div></div>
        <div class="timeline-content"><h4>Startpunktet</h4><p>Hvor tingene begyndte.</p></div>
      </div>
      <div class="timeline-row">
        <div class="timeline-year">År 2</div>
        <div class="timeline-track"><div class="timeline-dot"></div><div class="timeline-line"></div></div>
        <div class="timeline-content"><h4>Tidlige fremskridt</h4><p>Første eksperimenter.</p></div>
      </div>
      <div class="timeline-row">
        <div class="timeline-year">Nu</div>
        <div class="timeline-track"><div class="timeline-dot"></div><div class="timeline-line"></div></div>
        <div class="timeline-content"><h4>Hvor vi er</h4><p>Nuværende tilstand.</p></div>
      </div>
    </div>

  </div>
</section>
```

---

## 15. Stat grid

**Tier 1 (base cards) + Tier 3 (stat-dark emphasis).** 3-column grid of metric
cards. Add `.stat-dark` to one card to make it a Mint panel (Tier 3) — draws
the eye to the hero number. Stat numbers use Fraunces 300.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.stat-grid`, `.stat-card`, `.stat-card.stat-dark`, `.stat-number`,
`.stat-label`, `.stat-desc`

```html
<!-- ========== 15. STAT GRID ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">TALLENE</span>
    <h2>Effekt du kan <em class="accent">måle</em>. Ikke bare mærke.</h2>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Metrik ét</div>
        <div class="stat-number">N×</div>
        <div class="stat-desc">Hvad dette tal betyder i kontekst.</div>
      </div>
      <div class="stat-card stat-dark">
        <div class="stat-label">Metrik to</div>
        <div class="stat-number">00</div>
        <div class="stat-desc">Heltetallet. Mint-panel trækker opmærksomheden hertil.</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Metrik tre</div>
        <div class="stat-number">00%</div>
        <div class="stat-desc">Endnu en konkret måling med kontekst.</div>
      </div>
    </div>

  </div>
</section>
```

---

## 16. Quote pair

**Tier 1 (base card) + Tier 3 (quote-dark).** Two perspectives side by side.
The `.quote-dark` card uses Mint panel (Tier 3) to distinguish the contrasting
view. Use for debates, before/after, two schools of thought.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.quote-pair`, `.quote-card`, `.quote-card.quote-dark`, `.quote-text`,
`.quote-attr`

```html
<!-- ========== 16. QUOTE PAIR ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">TO PERSPEKTIVER</span>
    <h2>Debatten. <em class="accent">Begge</em> sider, én slide.</h2>
    <div class="quote-pair">
      <div class="quote-card">
        <div class="quote-text">"Det første perspektiv. En position eller overbevisning."</div>
        <div class="quote-attr">Perspektiv A</div>
      </div>
      <div class="quote-card quote-dark">
        <div class="quote-text">"Modsynspunktet. Et kontrasterende syn der skaber spænding."</div>
        <div class="quote-attr">Perspektiv B</div>
      </div>
    </div>

  </div>
</section>
```

---

## 17. Logo grid

**Tier 1 — Base.** 4-column grid of partner/client/team cells. Each cell has a
`.logo-mark` placeholder (or `img`) + name + role. Use for partner showcases,
team grids, client logos.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.logo-grid`, `.logo-cell`, `.logo-mark`, `.logo-name`, `.logo-role`

```html
<!-- ========== 17. LOGO GRID ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">HVEM BRUGER DETTE</span>
    <h2>Betroet af teams der <em class="accent">leverer</em>.</h2>
    <div class="logo-grid">
      <div class="logo-cell"><div class="logo-mark"></div><div class="logo-name">Partner A</div><div class="logo-role">Rolle eller team</div></div>
      <div class="logo-cell"><div class="logo-mark"></div><div class="logo-name">Partner B</div><div class="logo-role">Rolle eller team</div></div>
      <div class="logo-cell"><div class="logo-mark"></div><div class="logo-name">Partner C</div><div class="logo-role">Rolle eller team</div></div>
      <div class="logo-cell"><div class="logo-mark"></div><div class="logo-name">Partner D</div><div class="logo-role">Rolle eller team</div></div>
    </div>

  </div>
</section>
```

---

## 18. Code slide

**Tier 2 — Raise.** Ink-soft code frame with 2px mint top-border. Syntax
highlighting uses Float tokens: keywords in mint, comments in cream-dim, strings
in cream-soft. Use JetBrains Mono (already loaded).

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.code-frame`, `.code-frame-header`, `.code-frame-dot`, `.code-frame-title`,
`pre`, `.code-comment`, `.code-keyword`, `.code-string`, `.code-dim`

```html
<!-- ========== 18. CODE SLIDE ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">UNDER MOTORHJELMEN</span>
    <h2>Sådan <em class="accent">virker</em> det. Koden bag det.</h2>
    <div class="code-frame">
      <div class="code-frame-header">
        <div class="code-frame-dot"></div>
        <div class="code-frame-dot"></div>
        <div class="code-frame-dot"></div>
        <div class="code-frame-title">fil.js</div>
      </div>
<pre><span class="code-comment">// En kommentar</span>
<span class="code-keyword">const</span> <span class="code-dim">x</span> = <span class="code-string">'værdi'</span>;</pre>
    </div>

  </div>
</section>
```

---

## 19. Dark slide

**Tier 4 — Hero.** Full-bleed radial mint wash on ink. Large Fraunces display
heading. Use sparingly — marks turning points. Two or three per deck max.

**Float classes:** `.slide.dark`, `.slide-frame`, `.eyebrow`, `h1`, `em.accent`,
`.subtitle`

```html
<!-- ========== 19. DARK SLIDE ========== -->
<section class="slide dark">
  <div class="slide-frame">

    <span class="eyebrow">SEKTIONSLABEL</span>
    <h1>Vendepunktet. <em class="accent">Lander</em> hårdere i mørket.</h1>
    <p class="subtitle">Brug mørke slides sparsomt. De markerer vendepunkter.</p>

  </div>
</section>
```

---

## 20. Closing

**Tier 4 — Hero.** Same as dark slide but with closing typography. Logo lockup
optional. Large Fraunces display closing line with `em.accent`. Slow down for it.

**Float classes:** `.slide.dark`, `.slide-frame`, `.slide-logo-lockup`,
`.logo-wordmark`, `h1`, `em.accent`, `.meta`

```html
<!-- ========== 20. CLOSING ========== -->
<section class="slide dark quote-slide">
  <div class="slide-frame">

    <!-- optional logo lockup — use unique SVG ids if cover also has one -->
    <div class="slide-logo-lockup">
      <!-- paste float-logo.svg markup here with unique ids -->
      <span class="logo-wordmark">Float</span>
    </div>

    <h1>Afslutningslinjen.<br><em class="accent">Sæt farten ned</em> for den.</h1>
    <p class="meta">Taler · Tilhørsforhold</p>

  </div>
</section>
```

---

## 21. Testimonial grid

**Tier 1 — Base.** 3-column grid of testimonial cards. Each card has an italic
quote + author row with avatar placeholder. Use for social proof, client
feedback, team voices.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.testimonial-grid`, `.testimonial-card`, `.testimonial-quote`,
`.testimonial-author`, `.testimonial-avatar`, `.testimonial-name`,
`.testimonial-title`

```html
<!-- ========== 21. TESTIMONIAL GRID ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">HVAD DE SIGER</span>
    <h2>Socialt <em class="accent">bevis</em> fra dem der bruger det.</h2>
    <div class="testimonial-grid">
      <div class="testimonial-card">
        <div class="testimonial-quote">"Et stærkt citat fra en bruger. Specifikt og troværdigt."</div>
        <div class="testimonial-author">
          <div class="testimonial-avatar"></div>
          <div>
            <div class="testimonial-name">Navn Efternavn</div>
            <div class="testimonial-title">Titel · Virksomhed</div>
          </div>
        </div>
      </div>
      <!-- repeat .testimonial-card × 3 -->
    </div>

  </div>
</section>
```

---

## 22. Logo bar

**Tier 1 — Base.** Compact horizontal partner row between `--ink-line` rules.
Use for a compact list of logos/names when a full grid is too much.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.logo-bar`, `.logo-bar-item`

```html
<!-- ========== 22. LOGO BAR ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">PARTNERE</span>
    <h2>Betroet af <em class="accent">ledende</em> organisationer.</h2>
    <div class="logo-bar">
      <div class="logo-bar-item">Acme</div>
      <div class="logo-bar-item">Globex</div>
      <div class="logo-bar-item">Initech</div>
      <div class="logo-bar-item">Umbrella</div>
      <div class="logo-bar-item">Hooli</div>
    </div>

  </div>
</section>
```

---

## 23. Feature card row

**Tier 2 — Raise.** 3-column grid of feature cards. Each card has ink-soft
background + 2px mint top-border + a mock UI inner frame. Use for product
feature showcases.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.feature-cards`, `.feature-card`, `.feature-card-title`, `.feature-card-desc`,
`.feature-card-inner`, `.feature-card-mock-line`, `.feature-card-mock-line.short`,
`.feature-card-mock-line.accent`

```html
<!-- ========== 23. FEATURE CARD ROW ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">HVAD DU FÅR</span>
    <h2>Tre <em class="accent">kernefunktioner</em> der gør forskellen.</h2>
    <div class="feature-cards">
      <div class="feature-card">
        <div>
          <div class="feature-card-title">Funktion ét</div>
          <div class="feature-card-desc">Kort beskrivelse af hvad denne funktion gør.</div>
        </div>
        <div class="feature-card-inner">
          <div class="feature-card-mock-line"></div>
          <div class="feature-card-mock-line short"></div>
          <div class="feature-card-mock-line accent"></div>
        </div>
      </div>
      <!-- repeat .feature-card × 3 -->
    </div>

  </div>
</section>
```

---

## 24. Update row

**Tier 1 — Base.** 4-column changelog grid. Each card has a version badge
(mono, mint border) + date + title. Use for product updates, release notes,
changelog slides.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.update-row`, `.update-card`, `.update-header`, `.update-badge`, `.update-date`,
`.update-title`

```html
<!-- ========== 24. UPDATE ROW ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">CHANGELOG</span>
    <h2>Hvad der er <em class="accent">nyt</em>. Hvad der er ændret.</h2>
    <div class="update-row">
      <div class="update-card">
        <div class="update-header">
          <span class="update-badge">v2.1</span>
          <span class="update-date">Jan 2025</span>
        </div>
        <div class="update-title">Ny funktion der løser et specifikt problem.</div>
      </div>
      <!-- repeat .update-card × 4 -->
    </div>

  </div>
</section>
```

---

## 25. Art overlay

**Tier 1 — Base.** Atmospheric background (dark gradient) with a floating UI
mockup and a caption overlay. Use for product-in-context moments, editorial
atmosphere slides.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.art-overlay`, `.art-overlay-bg`, `.art-overlay-ui`, `.art-overlay-titlebar`,
`.art-overlay-dot`, `.art-overlay-content`, `.art-overlay-sidebar`,
`.art-overlay-main`, `.art-overlay-line`, `.art-overlay-caption`

```html
<!-- ========== 25. ART OVERLAY ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">PRODUKTET I KONTEKST</span>
    <h2>Grænsefladen. <em class="accent">Levende</em> i sit miljø.</h2>
    <div class="art-overlay">
      <div class="art-overlay-bg"></div>
      <div class="art-overlay-ui">
        <div class="art-overlay-titlebar">
          <div class="art-overlay-dot"></div>
          <div class="art-overlay-dot"></div>
          <div class="art-overlay-dot"></div>
        </div>
        <div class="art-overlay-content">
          <div class="art-overlay-sidebar">
            <div class="art-overlay-line" style="margin-bottom: 0.5rem;"></div>
            <div class="art-overlay-line short"></div>
          </div>
          <div class="art-overlay-main">
            <div class="art-overlay-line"></div>
            <div class="art-overlay-line short"></div>
            <div class="art-overlay-line accent"></div>
          </div>
        </div>
      </div>
      <div class="art-overlay-caption">
        <h3>Et dramatisk visuelt øjeblik</h3>
        <p>Brug til cinematiske billeder der har brug for en kort billedtekst.</p>
      </div>
    </div>

  </div>
</section>
```

---

## 26. Split slide

**Tier 1 — Base.** Text on one side, image on the other. Add `.split-reverse`
to swap sides. Use for feature highlights, case studies, before/after.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.split`, `.split-text`, `.split-image`, `.split.split-reverse`

```html
<!-- ========== 26. SPLIT SLIDE ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">FUNKTIONSFREMHÆVNING</span>
    <h2>Tekst på én side. <em class="accent">Billede</em> på den anden.</h2>
    <div class="split">
      <div class="split-text">
        <h3>Hvorfor dette betyder noget</h3>
        <p>Beskriv funktionen, vis beviset. Brug .split-reverse til at bytte sider.</p>
      </div>
      <div class="split-image">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="">
      </div>
    </div>

  </div>
</section>
```

---

## 27. Hero image

**Tier 1 — Base.** Full-width image frame with gradient overlay and caption.
The frame has a 16:9 aspect ratio and `--ink-line` border. Use for cinematic
moments, location shots, product photography.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.hero-frame`, `.hero-frame-overlay`, `.hero-frame-caption`

```html
<!-- ========== 27. HERO IMAGE ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">ØJEBLIKKET</span>
    <h2>Fuldblæst billede. <em class="accent">Tekstoverlay</em> inden i en ramme.</h2>
    <div class="hero-frame">
      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="">
      <div class="hero-frame-overlay"></div>
      <div class="hero-frame-caption">
        <h3>Et dramatisk visuelt øjeblik</h3>
        <p>Gradienten sikrer læsbarhed.</p>
      </div>
    </div>

  </div>
</section>
```

---

## 28. Image card row

**Tier 1 — Base.** 3-column grid of image cards. Each card has a 4:3 image
frame + body with title and description. Use for case studies, team members,
product variants.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.image-cards`, `.image-card`, `.image-card-frame`, `.image-card-body`,
`.image-card-title`, `.image-card-desc`

```html
<!-- ========== 28. IMAGE CARD ROW ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">TRE HØJDEPUNKTER</span>
    <h2>Billedkort. <em class="accent">Visuelt-første</em> indhold.</h2>
    <div class="image-cards">
      <div class="image-card">
        <div class="image-card-frame"><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" alt=""></div>
        <div class="image-card-body">
          <div class="image-card-title">Kort ét</div>
          <div class="image-card-desc">Kort beskrivelse af dette element med kontekst.</div>
        </div>
      </div>
      <!-- repeat .image-card × 3 -->
    </div>

  </div>
</section>
```

---

## 29. Caption slide

**Tier 1 — Base.** Full-height image with a caption bar below. The image fills
the available height; the caption bar sits at the bottom. Use for annotated
screenshots, documentary-style images.

**Float classes:** `.slide.caption-slide`, `.slide-frame`, `.caption-frame`,
`.caption-bar`, `.caption-title`, `.caption-text`

```html
<!-- ========== 29. CAPTION SLIDE ========== -->
<section class="slide caption-slide">
  <div class="slide-frame" style="padding: 3% 5%; flex-direction: column;">
    <div class="caption-frame" style="flex: 1; min-height: 0;">
      <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80" alt="">
    </div>
    <div class="caption-bar">
      <div class="caption-title">Billedtitel</div>
      <div class="caption-text">Én linje kontekst. Hvad dette billede viser og hvorfor det betyder noget.</div>
    </div>
  </div>
</section>
```

---

## 30. Image + quote

**Tier 1 — Base.** Portrait image on the left, pull quote on the right. Add
`.image-quote-reverse` to swap sides. Use for speaker quotes, customer stories,
expert endorsements.

**Float classes:** `.slide`, `.slide-frame`, `.image-quote`,
`.image-quote-frame`, `.image-quote-content`, `.image-quote-text`,
`.image-quote-attr`, `.image-quote.image-quote-reverse`

```html
<!-- ========== 30. IMAGE + QUOTE ========== -->
<section class="slide">
  <div class="slide-frame">

    <div class="image-quote">
      <div class="image-quote-frame">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" alt="">
      </div>
      <div class="image-quote-content">
        <div class="image-quote-text">"Et stærkt udsagn parret med et portræt. Billedet giver citatet et ansigt og et sted."</div>
        <div class="image-quote-attr">Taler navn · Rolle</div>
      </div>
    </div>

  </div>
</section>
```

---

## 31. Photo grid

**Tier 1 — Base.** 2×2 image mosaic with optional label overlays. Each cell
has a 4:3 aspect ratio and a gradient label at the bottom. Use for portfolio
showcases, project galleries, team photos.

**Float classes:** `.slide`, `.slide-frame`, `.eyebrow`, `h2`, `em.accent`,
`.photo-grid`, `.photo-grid-cell`, `.photo-grid-label`

```html
<!-- ========== 31. PHOTO GRID ========== -->
<section class="slide">
  <div class="slide-frame">

    <span class="eyebrow">ARBEJDET</span>
    <h2>Fire billeder. <em class="accent">Én</em> historie.</h2>
    <div class="photo-grid">
      <div class="photo-grid-cell">
        <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80" alt="">
        <div class="photo-grid-label">Første billede</div>
      </div>
      <div class="photo-grid-cell">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80" alt="">
        <div class="photo-grid-label">Andet billede</div>
      </div>
      <div class="photo-grid-cell">
        <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80" alt="">
        <div class="photo-grid-label">Tredje billede</div>
      </div>
      <div class="photo-grid-cell">
        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80" alt="">
        <div class="photo-grid-label">Fjerde billede</div>
      </div>
    </div>

  </div>
</section>
```

---

## Inline accents

Every heading must have exactly one `<em class="accent">` — the Float signature.
The `span.dim` continuation is allowed as a secondary muted element but is NOT
the signature.

```html
<!-- One accent per heading — the Float signature -->
<h1>Headline med <em class="accent">accent</em></h1>
<h2>Overskrift med <em class="accent">nøgleord</em>.</h2>

<!-- span.dim: muted continuation, always paired with em.accent in the same heading -->
<h1>Headline <em class="accent">nøgleord</em>. <span class="dim">Fortsættelse der fader.</span></h1>

<!-- Eyebrow colour variants -->
<span class="eyebrow">STANDARD (cream-dim)</span>
<span class="eyebrow" style="color: var(--tide);">SEKUNDÆR TRACK (tide)</span>
<span class="eyebrow" style="color: var(--coral);">ADVARSEL (coral — max 2/slide)</span>

<!-- Tide: only for a genuine second track (two-col other side, jeduf flanking) -->
<div class="col-tide">
  <!-- tide eyebrow + heading applied automatically -->
</div>
```

### Colour rules recap

- **Mint** is the brand. Use it most: `em.accent`, dots, badges, borders.
- **Tide** is the second voice. Use only for a genuine parallel/secondary track
  (`.col-tide`, `.jeduf-col:not(.hero)` labels). Never decoratively.
- **Coral** is a spotlight. Reserve for caution, a revision flag, a single
  "here's the catch" note. Maximum 2 uses per slide.
- No pure white (`#fff`/`white`) anywhere in component CSS.
- No bold headings (`font-weight: 300` throughout).
- No emoji.
