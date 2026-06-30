# Float deck components

Copy-paste building blocks for web decks. All classes are defined in
`assets/deck.css`. Compose slides from these instead of writing new CSS.
Each `.slide` should contain a single `<div class="inner">` wrapper.

## Table of contents
- [Slide shell](#slide-shell)
- [Title slide](#title-slide)
- [Eyebrow + heading + lede](#eyebrow--heading--lede)
- [Agenda list](#agenda-list)
- [Card grid (quad)](#card-grid-quad)
- [Two-track columns](#two-track-columns)
- [Level ladder](#level-ladder)
- [Counterpoint / caution](#counterpoint--caution)
- [Team grid](#team-grid)
- [CTA block](#cta-block)
- [Inline accents](#inline-accents)

---

## Slide shell
Every content slide. `data-label` populates the right-hand nav dot.
```html
<section class="slide" data-label="Section name">
  <div class="inner">
    <!-- eyebrow + heading + content -->
  </div>
</section>
```

## Title slide
First slide. Logo lockup sits top-right; subtitle uses Fraunces (not Inter).
```html
<section class="slide slide--title" data-label="Forside">
  <div class="inner slide-logo-inner">
    <div class="slide-logo-lockup">
      <!-- paste float-logo.svg markup here -->
      <span style="font-family:var(--font-display);font-weight:300;font-size:1.25rem;letter-spacing:-0.02em;color:var(--mint);">Float</span>
    </div>
    <span class="eyebrow reveal">FLOAT · AI-NATIVE STRATEGI &amp; IMPLEMENTERING</span>
    <h1 class="reveal reveal--slow">I gang med <em class="accent">AI</em></h1>
    <p class="lede reveal">AI-native strategi- og implementeringspartner for SMV'er</p>
    <p class="caption reveal">Juni 2026</p>
  </div>
</section>
```

## Eyebrow + heading + lede
The standard top of any content slide. Note the single italic accent word.
```html
<span class="eyebrow reveal">FORSTÅ JERES UDGANGSPUNKT</span>
<h2 class="reveal">Hvor er I med <em class="accent">AI</em> i dag</h2>
<p class="lede reveal">One or two sentences of framing. Keep it lean.</p>
```
Eyebrow colour variants: `eyebrow--tide`, `eyebrow--coral`.

## Agenda list
Mono-numbered list.
```html
<ol class="agenda-list">
  <li class="agenda-item reveal"><span class="agenda-num">01</span><span class="agenda-text">Hvor er I i dag</span></li>
  <li class="agenda-item reveal"><span class="agenda-num">02</span><span class="agenda-text">To spor til AI-adoption</span></li>
</ol>
```

## Card grid (quad)
2×2 grid of cards (collapses to 1 column on mobile).
```html
<div class="quad reveal">
  <div class="card"><h3>Card title</h3><p>Short description.</p></div>
  <div class="card"><h3>Card title</h3><p>Short description.</p></div>
  <div class="card"><h3>Card title</h3><p>Short description.</p></div>
  <div class="card"><h3>Card title</h3><p>Short description.</p></div>
</div>
```

## Two-track columns
Side-by-side parallel tracks: mint (`--ind`) vs tide (`--org`). Often hosts a
`level-ladder--mini` inside each column.
```html
<div class="two-tracks">
  <div class="track-col reveal">
    <div class="track-header track-header--ind"><span>Individuel produktivitet</span></div>
    <p class="work-lede">Hvordan mennesker anvender AI.</p>
    <!-- level-ladder--mini here -->
  </div>
  <div class="track-col reveal">
    <div class="track-header track-header--org"><span>Indbygning i processer</span></div>
    <p class="work-lede">Hvordan organisationen bygger AI ind.</p>
    <!-- level-ladder--mini level-ladder--tide here -->
  </div>
</div>
```

## Level ladder
5-level progression. Default mint; add `level-ladder--tide` for the blue track.
`ladder-step--highlight` (coral) marks a notable step. `level-ladder--mini`
hides desc/chip for use inside a column.
```html
<div class="level-ladder reveal">
  <div class="ladder-step">
    <span class="ladder-badge">L1</span>
    <div class="ladder-body">
      <p class="ladder-title">Forsigtig udforskning</p>
      <p class="ladder-desc">Hurtige forespørgsler. Erstatter Google.</p>
    </div>
    <span class="ladder-chip">Lav</span>
  </div>
  <!-- ...L2–L5; use ladder-chip--coral on the transformative step -->
</div>
```

## Counterpoint / caution
Coral left-border callout for a caveat or honest catch.
```html
<div class="counterpoint reveal">
  <strong>Her stopper de fleste.</strong> Plain follow-up sentence explaining the catch.
</div>
```

## Team grid
Circular photos + names. Photos are square source images, cropped to circle.
```html
<div class="team-grid reveal">
  <div class="team-member"><img class="team-photo" src="../img/team-1.png" alt="Name" /><p class="team-name">Name</p></div>
  <!-- repeat -->
</div>
```

## CTA block
Closing slide. `slide--cta` centres everything. Two option cards: primary (mint)
+ secondary (tide).
```html
<section class="slide slide--cta" data-label="Næste skridt">
  <div class="inner">
    <span class="eyebrow reveal">Næste skridt</span>
    <h2 class="reveal">Hvad er <em class="accent">næste</em> skridt</h2>
    <div class="cta-block reveal">
      <div class="cta-person cta-person--primary">
        <span class="cta-role">Mulighed 01</span>
        <p class="cta-name">En fælles arbejdsdag</p>
        <ul class="cta-items"><li>Punkt</li><li>Punkt</li></ul>
      </div>
      <div class="cta-person cta-person--secondary">
        <span class="cta-role cta-role--tide">Mulighed 02</span>
        <p class="cta-name">Direkte i gang</p>
        <ul class="cta-items cta-items--tide"><li>Punkt</li><li>Punkt</li></ul>
      </div>
    </div>
  </div>
</section>
```

## Inline accents
- `<em class="accent">word</em>` — mint italic heading accent (one per heading).
- `<span class="coral-note">note</span>` — small mono coral inline note.
- Add `class="reveal"` to any element to fade/rise it in on scroll.
- Add `tabular-nums` class to numeric blocks for aligned figures.
