---
name: pptx-numa
description: "Use this skill any time a .pptx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks, or presentations; reading, parsing, or extracting text from any .pptx file (even if the extracted content will be used elsewhere, like in an email or summary); editing, modifying, or updating existing presentations; combining or splitting slide files; working with templates, layouts, speaker notes, or comments. Trigger whenever the user mentions \"deck,\" \"slides,\" \"presentation,\" or references a .pptx filename, regardless of what they plan to do with the content afterward. If a .pptx file needs to be opened, created, or touched, use this skill. This version uses the Numa Collective brand palette and preferred visual elements."
license: Proprietary. LICENSE.txt has complete terms
---

# PPTX Skill — Numa Collective Edition

## Skill Base Directory

**IMPORTANT:** This skill bundles a template file, scripts, and assets. All relative paths in this document are relative to this skill's base directory. When this skill loads, its base directory is provided at the top of the skill prompt (look for "Base directory for this skill:"). Store that path in a variable and prefix all relative paths with it.

```bash
# First thing — set the skill base directory (replace with the actual path shown above)
SKILL_DIR="<base directory from skill prompt>"
```

All commands below assume `$SKILL_DIR` is set. For example:
- `$SKILL_DIR/assets/agenda.pptx` — the agenda/title template
- `$SKILL_DIR/scripts/thumbnail.py` — thumbnail generator
- `$SKILL_DIR/scripts/office/unpack.py` — pptx unpacker
- `$SKILL_DIR/scripts/office/pack.py` — pptx packer

---

## Quick Reference

| Task | Guide |
|------|-------|
| Read/analyze content | `python -m markitdown presentation.pptx` |
| Create or edit a deck (default) | Read [editing.md](editing.md) |
| Generate complex visual slides | Read [pptxgenjs.md](pptxgenjs.md) — for import into template only |

---

## Quick Start — End-to-End Workflow

```bash
# 1. Copy template
cp $SKILL_DIR/assets/agenda.pptx working.pptx

# 2. Unpack
python $SKILL_DIR/scripts/office/unpack.py working.pptx unpacked/

# 3. Create slides from template layouts
python $SKILL_DIR/scripts/add_slide.py unpacked/ slideLayout3.xml   # content slide
python $SKILL_DIR/scripts/add_slide.py unpacked/ slideLayout2.xml   # intro slide
# Add <p:sldId> entries to unpacked/ppt/presentation.xml

# 4. Edit slide XML — fill in text, add shapes
# Edit unpacked/ppt/slides/slide*.xml directly

# 5. (Optional) Generate complex visual slides with pptxgenjs
npm install pptxgenjs pptx-automizer
node generate-complex-slide.js  # outputs generated-slides.pptx
# Import into template deck — see "Importing Complex Visual Slides"

# 6. Clean and pack
python $SKILL_DIR/scripts/clean.py unpacked/
python $SKILL_DIR/scripts/office/pack.py unpacked/ output.pptx --original working.pptx

# 7. QA
python $SKILL_DIR/scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
# Inspect slide images, fix issues, repeat
```

---

## Reading Content

```bash
# Text extraction
python -m markitdown presentation.pptx

# Visual overview
python $SKILL_DIR/scripts/thumbnail.py presentation.pptx

# Raw XML
python $SKILL_DIR/scripts/office/unpack.py presentation.pptx unpacked/
```

---

## Creating & Editing Workflow (Default)

**Read [editing.md](editing.md) for full details.**

This is the primary path for all decks. Always start from the Numa template — do not create slides from scratch unless you have a specific reason to use the secondary path below.

1. Copy `$SKILL_DIR/assets/agenda.pptx` to a working file
2. Unpack it (using `$SKILL_DIR/scripts/office/unpack.py`)
3. Create slides from template layouts using `add_slide.py`
4. Edit slide XML to fill in content
5. Clean and repack (using `$SKILL_DIR/scripts/office/pack.py`)

---

## Generating Complex Visual Slides (Secondary)

**Read [pptxgenjs.md](pptxgenjs.md) for full details.**

Use pptxgenjs **only** for slides with complex programmatic visuals — multi-shape diagrams, charts, or intricate layouts that are painful to build in raw XML. These slides are generated as throwaway `.pptx` files and then imported into the template-based deck using `pptx-automizer`. **Never output a standalone pptxgenjs deck** — the result must always be merged back into the template.

### ⚠️ CRITICAL: Slide Size

The Numa Collective template uses **13.33" × 7.50"** (PowerPoint standard widescreen). When creating slides with pptxgenjs, you **must** set:

```javascript
pres.layout = 'LAYOUT_WIDE';  // 13.3" × 7.5" — matches the Numa template
```

**Do NOT use `LAYOUT_16x9`** — that produces 10" × 5.625" slides which are much smaller and will leave the bottom and right portions of the slide empty when combined with template slides. This is the single most common mistake when creating Numa decks.

All position and size values in this skill (margins, card dimensions, element placements) assume the 13.33" × 7.50" canvas.

---

## Importing Complex Visual Slides

When a slide is generated with pptxgenjs (see above), it must be imported into the template-based deck using `pptx-automizer`. This preserves the template's embedded fonts, slide layouts, and theme.

### Workflow

```javascript
const Automizer = require('pptx-automizer').default;

async function importSlides(templatePath, generatedPath, outputPath) {
  const automizer = new Automizer({
    templateDir: '.',
    outputDir: '.',
    autoImportSlideMasters: false,  // keep the template's masters, don't import from generated file
    removeExistingSlides: false,    // keep all template slides
  });

  const pres = automizer
    .loadRoot(templatePath)         // the template-based deck (with all your content slides)
    .load(generatedPath, 'gen');    // the pptxgenjs-generated throwaway file

  // Import slide 1 from the generated file
  pres.addSlide('gen', 1, (slide) => {
    // Optional: modify elements on the imported slide
  });

  await pres.write(outputPath);
}
```

### Key Settings

- `autoImportSlideMasters: false` — the template already has the correct masters and layouts. Do not import the pptxgenjs default master.
- `removeExistingSlides: false` — preserve all slides already in the template deck.
- Embedded fonts in the template (`ppt/fonts/`) are preserved automatically — pptx-automizer does not touch the fonts directory.

### When to Use This vs. Direct XML

**Use pptx-automizer import** for slides with:
- Complex multi-shape diagrams (5+ shapes with precise positioning)
- Charts generated from data
- Intricate visual layouts that would be error-prone in raw XML

**Use direct XML editing** (the default) for slides with:
- Title + text content
- Simple bullet lists
- Basic shapes (1-3 rectangles, circles)
- Content that fits naturally into template layout placeholders

Most slides in a typical deck should be built via direct XML editing. The pptx-automizer import path is the exception, not the rule.

---

## Bundled Template — `assets/agenda.pptx`

This skill bundles one template file at `$SKILL_DIR/assets/agenda.pptx`. It contains the branded title slide and agenda slide layouts that should be used as the starting point for every deck.

### Template Slide Overview

The template contains 6 slides:

| Slide | Type | Description |
|-------|------|-------------|
| **1** | **Title slide** | Burgundy (`943C31`) background with periwinkle wave image and Numa Collective logo. Has **placeholders** for title and subtitle — see below. |
| **2** | **Agenda layout A** | Split layout: burgundy left panel with "Agenda" title, cream right panel with squared-number topic list. Highlight bar on Topic 1. |
| **3** | Blank content (cream) | Empty cream (`F3F0EB`) slide for content. |
| **4** | **Agenda layout B** | Same as slide 2 but with highlight bar on Topic 2 (shows how to indicate current section). |
| **5** | Blank content (cream) | Empty cream slide for content. |
| **6** | Blank content (periwinkle) | Empty periwinkle (`8FA1FF`) background slide. |

### Title Slide (Slide 1) — Placeholder Details

The title slide has these XML placeholders that must be filled in:

| Placeholder | XML type | What to insert |
|-------------|----------|----------------|
| **Center Title** | `<p:ph type="ctrTitle"/>` | The deck's main title (e.g. "Data Strategy Assessment") |
| **Subtitle** | `<p:ph idx="1" type="subTitle"/>` | A subtitle or tagline (e.g. "Prepared for Acme Corp — March 2026") |
| **Body** | `<p:ph idx="2" type="body"/>` | Optional — additional context text if needed, otherwise leave empty |
| **Picture** | `<p:ph idx="3" type="pic"/>` | Optional — the periwinkle wave image is already present in the layout; no need to replace unless a custom image is required |

**How to populate the title slide:**

```bash
# 1. Unpack the template
python $SKILL_DIR/scripts/office/unpack.py $SKILL_DIR/assets/agenda.pptx template_unpacked/

# 2. Find the title placeholders in slide 1
grep -n "ctrTitle\|subTitle" template_unpacked/ppt/slides/slide1.xml

# 3. Edit the XML — find the <a:t> elements inside those placeholder shapes
#    and replace their text content with the actual title and subtitle.

# 4. Repack when done
python $SKILL_DIR/scripts/office/pack.py template_unpacked/ output.pptx
```

The title and subtitle text should use the existing styling from the template — do not override fonts or colors. Just replace the text content in the `<a:t>` elements.

### Agenda Slides (Slides 2 and 4) — How to Use

The agenda slides have a distinctive split layout:
- **Left panel**: Burgundy (`943C31`) fill, ~35% of slide width, containing "Agenda" in large white Georgia text
- **Right panel**: Cream (`F3F0EB`) background with a vertical list of topics

Each topic row consists of:
- A **burgundy squared number** (filled `943C31` square with white bold number centered inside)
- **Bold navy topic text** (`0E2841`) in Play next to the square
- A **light gray highlight bar** (`C6C6D0`) behind the currently-active topic row

**To build an agenda:**

1. Start from slide 2 or 4 of the template.
2. Replace "Topic 1", "Topic 2" etc. with real section names.
3. Add more numbered rows if needed (duplicate the square + text pattern, incrementing the number).
4. Position the gray highlight bar behind whichever topic is "current".
5. If the deck uses **recurring agenda slides** (one before each section to show progress), duplicate the agenda slide for each section and move the highlight bar each time.

### Template Slide Layouts

The template contains **36 slide layouts** organized into 4 categories: Title Slides, K-series (light/cream background), D-series (dark navy background), and Section Headers.

**Read [template-layouts.md](template-layouts.md) for the full catalog with filenames and descriptions.**

Most common choices:
- `slideLayout3.xml` — K - Title and Content (most content slides)
- `slideLayout2.xml` — K - 1/3 Rust (intro/section openers)
- `slideLayout28.xml` — D - Title and Content (dark slides)

Usage: `python $SKILL_DIR/scripts/add_slide.py unpacked/ slideLayout3.xml`

---

## Numbered Visual Elements — Squares and Circles

Two styles of numbered markers are used across Numa decks. Both consist of a colored shape containing a bold white number, used to label items in a sequence.

### Style A: Squared Numbers

A filled **square** (no rounded corners) containing a centered white bold number. Used on agenda slides and structured lists.

```javascript
// Squared number marker
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.0, w: 0.45, h: 0.45,
  fill: { color: "943C31" },  // burgundy — or any single accent color
});
slide.addText("1", {
  x: 0.5, y: 1.0, w: 0.45, h: 0.45,
  fontSize: 18, bold: true, color: "FFFFFF",
  align: "center", valign: "middle",
});
```

### Style B: Circled Numbers

A filled **circle** containing a centered white bold number. Used for stat callouts and "at a glance" metrics.

```javascript
// Circled number marker
slide.addShape(pres.shapes.OVAL, {
  x: 2.0, y: 1.0, w: 0.7, h: 0.7,
  fill: { color: "FF562C" },  // orange-red — or any single accent color
});
slide.addText("121", {
  x: 2.0, y: 1.0, w: 0.7, h: 0.7,
  fontSize: 28, bold: true, color: "FFFFFF",
  align: "center", valign: "middle",
});
```

### Critical Rules for Numbered Elements

1. **Never mix squares and circles on the same slide.** Pick one style per slide and use it consistently. Squares belong on agenda/structured-list slides. Circles belong on stat/metric slides. Mixing them looks disjointed.

2. **Use one color per slide for numbered shapes.** All the numbered markers on a given slide should be the same fill color. For example, an agenda slide uses all burgundy (`943C31`) squares — not square 1 in teal, square 2 in orange, square 3 in burgundy. The accent color can vary *between* slides, but within a single slide, keep it uniform.

3. **Good color choices for numbered shapes:**
   - Burgundy `943C31` — agenda slides, formal tone (the default from the agenda template)
   - Navy `0E2841` — neutral, professional
   - Teal `009B81` — energetic, modern
   - Vibrant Orange-Red `FF562C` — stat callouts, attention-grabbing

### Section Navigation Indicator (for 4+ agenda sections)

When a deck has **4 or more sections** in the agenda, add a small squared number in the **top-left corner** of every content slide to show which section the audience is currently in. This acts as a persistent wayfinding element.

**Placement:** Top-left of the slide, approximately `x: 0.3", y: 0.2"`, square size `0.35" × 0.35"`. The number corresponds to the agenda section number.

**Styling:** Same fill color as the agenda squares (typically burgundy `943C31`), white bold number. Keep it small and unobtrusive — it's a navigation aid, not a focal point.

```javascript
// Section indicator — top-left of every content slide in section 2
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.3, y: 0.2, w: 0.35, h: 0.35,
  fill: { color: "943C31" },
});
slide.addText("2", {
  x: 0.3, y: 0.2, w: 0.35, h: 0.35,
  fontSize: 14, bold: true, color: "FFFFFF",
  align: "center", valign: "middle",
});
```

Do not use section indicators when the deck has 3 or fewer agenda sections — with that few sections, the audience can easily track where they are without visual aid.

---

## Brand Identity — Numa Collective

### Color Palette

**This is the ONLY palette to use. All colors come from the Numa Collective brand theme. Do not invent or substitute colors.**

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| **Primary Dark** | Deep Navy | `0E2841` | Dark sections, headings on light slides |
| **Primary Light** | Warm Cream | `F3F0EB` | Default light slide background (NOT pure white) |
| **Black** | Black | `000000` | Body text on light backgrounds, strong contrast when needed |
| **White** | White | `FFFFFF` | Text on dark backgrounds, card fills |
| **Accent 1** | Teal Green | `009B81` | Primary accent — section headers, icon circles, key highlights, top-border accents on cards |
| **Accent 2** | Periwinkle Blue | `8FA1FF` | Soft accent — decorative elements, background shapes, secondary highlights, arrows |
| **Accent 3** | Vibrant Orange-Red | `FF562C` | High-energy accent — stat callout circles, CTA elements, bold emphasis |
| **Accent 4** | Tan Gold | `C0A883` | Warm neutral — subtle backgrounds, map fills, muted decorative shapes |
| **Accent 5** | Burgundy | `943C31` | Rich contrast — title slide background, agenda panels, squared numbers, strong emphasis |
| **Accent 6** | Light Gray | `C6C6D0` | Borders, divider lines, subtle card outlines, agenda highlight bars |
| **Supporting** | Golden Amber | `FBAE40` | Card left-border accents, callout highlights, warm emphasis |
| **Supporting** | Softer Orange | `F26B43` | Bold header text on light backgrounds, warm secondary emphasis |

### Color Application Rules

- **Title slide**: Background `943C31` (burgundy), text `FFFFFF`, periwinkle wave image, Numa logo (from template)
- **Content/light slides**: Background `F3F0EB` (cream), headings `0E2841` (navy) or `F26B43` (orange), body text `000000` (black), accents `009B81` or `8FA1FF`
- **Agenda slides**: Left panel `943C31` (burgundy), right panel `F3F0EB` (cream), squared numbers in `943C31`, active-topic highlight bar in `C6C6D0`
- **Dark content slides**: Background `0E2841` (navy), text `FFFFFF`, geometric overlays
- **Dominance**: Navy/burgundy and cream dominate (70%+). Accents are used sparingly for emphasis.
- **Cards on light slides**: White (`FFFFFF`) fill with thin `C6C6D0` border or subtle shadow. Left-edge accent bar in `FBAE40` (golden amber).
- **Stat callout circles**: `FF562C` (vibrant orange-red) fill with white bold numbers inside.
- **Colored arrows for value props**: Use each accent color (`009B81`, `8FA1FF`, `FF562C`, `C0A883`, `943C31`) in sequence for a series of arrow shapes.
- **Never use**: Generic blue, pure white backgrounds, or colors not in this table. The brand cream `F3F0EB` replaces white as a background.

### Typography

| Element | Font | Size | Style |
|---------|------|------|-------|
| Slide title | Georgia | 34pt (fixed — do not vary) | Regular weight, `0E2841` on light / `FFFFFF` on dark |
| Section header | Play | 20-24pt | Bold, `009B81` or `0E2841` |
| Left-side "statement" text | Play | 28-36pt | Regular, `F26B43` (orange) |
| Body text | Play | 14-16pt | Regular, `000000` |
| Bold inline labels | Play | 14-16pt | Bold, `0E2841` |
| Captions/footnotes | Play | 12pt | Regular, `C0A883` (tan) or `C6C6D0` (gray) |
| Stat numbers | Play | 60-72pt | Bold, `FFFFFF` (inside colored circles) |
| Agenda topic text | Play | 16-18pt | Bold, `0E2841` (navy) |
| Squared/circled numbers | Play | 14-18pt | Bold, `FFFFFF` on colored fill |

**Title font size is locked at 34pt. Do not use a range. The template enforces this via the slide layout definition.**

**Minimum font size is 12pt — nothing smaller may appear on any slide.** Prefer 14pt where space allows. The only element at the 12pt floor is captions/footnotes; everything else should be 14pt or larger.

These fonts are embedded in the template (`ppt/fonts/`). When working from the template (the default workflow), fonts are inherited automatically — do not specify `fontFace` in pptxgenjs or override font attributes in XML unless you have a specific reason.

### Slide Positioning

These coordinates come from the template's slide layout definitions. When creating slides from template layouts, the placeholders inherit these positions automatically. Only specify coordinates when adding free-form shapes.

**Content slides (using "K - Title and Content" layout or similar):**
- Title: x=648000 EMU (0.68"), y=648000 EMU (0.68"), width=10897200 EMU (11.41"), height=470898 EMU (0.49")
- Body content area: starts at y=2088000 EMU (2.19") — well below the title
- Do not place content between the title and y=2.19" — that space is intentional breathing room

**Intro/section slides (using "K - 1/3 Rust" or similar split layouts):**
- Title: x=648000 EMU, y=2709000 EMU (vertically centered in left panel), width=3096000 EMU, height=1440000 EMU

**Title slide (slide 1):**
- Uses template placeholders — do not override positioning

---

## Preferred Visual Elements

**Read [visual-elements.md](visual-elements.md) for the full catalog of 16 visual patterns with code examples.**

When building slides, choose from these patterns to ensure visual variety and brand consistency. Key patterns include card grids, colored content blocks, honeycomb diagrams, process flows, stat callouts, flywheel diagrams, and more. Never create text-only slides — every slide needs a visual element.

---

## Deck Assembly — Standard Structure

When building a deck, follow this ordering:

1. **Title slide** (from `$SKILL_DIR/assets/agenda.pptx` slide 1) — fill in the title and subtitle placeholders
2. **Agenda slide** (from `$SKILL_DIR/assets/agenda.pptx` slide 2 or 4) — populate with actual section names
3. **Content sections** — each section's slides, using the visual elements and brand rules described in this skill
4. **(Optional) Recurring agenda slides** — if 4+ sections, re-insert the agenda slide before each section with the highlight bar moved to the current section, and add a section-number square indicator top-left of every content slide
5. **Closing slide** — dark navy with geometric overlays, contact info or closing message, logo bottom-right

### Logo Placement

- On light slides: Logo/brand text in `0E2841` (navy), bottom-right corner
- On dark slides: Logo/brand text in `FFFFFF` (white), bottom-right corner

---

## Design Rules

### For Each Slide

**Every slide needs a visual element** — image, chart, icon, shape, card grid, or diagram. Text-only slides are not acceptable.

**Layout options (choose variety — don't repeat the same layout):**
- Card grid with amber left-accent borders OR colored content blocks (pick one style per deck)
- Line-art icon row with circles (for 3-5 parallel concepts or process steps)
- Side-by-side comparison cards with teal top borders
- Process flow (left-to-right with chevron arrows)
- Honeycomb/hexagon framework diagram
- Flywheel/cycle diagram (for continuous loops and interdependent elements)
- Timeline with color-coded phase bars
- Org chart with colored boxes and vertical arrows
- Stat callouts (circles with white numbers — one color per slide)
- Circled step number overlays on product screenshots
- Colored arrow rows for value propositions
- Half-image + statement layout
- Two-column (text left, illustration right)
- Data table with alternating rows
- Full-width takeaway banner at bottom

**Data display:**
- Large stat callouts: colored circle, white bold 60-72pt number, label text beside or below
- Comparison columns with teal top-border cards
- Timeline with color-coded horizontal bars
- Clean tables with alternating gray rows

**Visual polish:**
- Icons in small colored circles (teal `009B81` or periwinkle `8FA1FF`) next to section headers
- Italic accent text for key stats or taglines
- Full-width navy takeaway banners at slide bottom for key messages
- Geometric line overlays on dark slides only

### Spacing

- 0.5" minimum margins from slide edges
- 0.3-0.5" between content blocks
- Leave breathing room — don't fill every inch
- Cards in a grid should have consistent 0.3" gaps

### Avoid (Common Mistakes)

- **Don't repeat the same layout** — vary cards, diagrams, timelines, and callouts across slides
- **Don't center body text** — left-align paragraphs and lists; center only titles
- **Don't skimp on size contrast** — titles are 34pt (fixed); body text is 14-16pt. This contrast is intentional — do not shrink titles
- **Don't use colors outside the palette** — especially no generic blue or pure white backgrounds
- **Don't mix spacing randomly** — choose 0.3" or 0.5" gaps and use consistently
- **Don't style one slide and leave the rest plain** — commit to the brand language throughout
- **Don't create text-only slides** — add cards, icons, diagrams, or visual elements
- **Don't forget text box padding** — when aligning lines or shapes with text edges, set `margin: 0` on the text box
- **Don't use low-contrast elements** — icons AND text need strong contrast against the background
- **NEVER use accent lines under titles** — these are a hallmark of AI-generated slides; use whitespace or background color instead
- **Don't use rounded photo frames** — use rectangular frames for team photos
- **Don't put geometric overlays on light/cream slides** — those belong on dark navy slides only
- **Don't mix circles and squares on the same slide** — pick one numbered-shape style per slide
- **Don't use multiple colors for numbered shapes on one slide** — all numbered squares (or circles) on a slide share the same fill color
- **Don't mix card styles in one deck** — use either white cards with amber left-border accents (2A) or colored content blocks (2B) throughout; never both in the same deck
- **Don't confuse step-number overlays with stat callouts** — step overlays (Element #16) are small, sequential ("01", "02"), and sit on top of screenshots; stat callouts (Element #9) are large, standalone, and contain data values
- **Don't skip the title slide placeholders** — always fill in the ctrTitle and subTitle from the template
- **Don't use `LAYOUT_16x9`** — always use `LAYOUT_WIDE` (13.33" × 7.50") to match the Numa template; `LAYOUT_16x9` creates smaller slides that leave the bottom-right empty
- **Don't combine straight-edged accent bars with rounded-corner shapes** — if a shape has rounded corners (`ROUNDED_RECTANGLE`), any accent bar or border overlay must also have rounded corners, or more practically: use `RECTANGLE` (straight corners) for shapes that have accent bars. The straight bar won't cover the rounded corners and creates a visual glitch.
- **Don't use font sizes below 12pt** — 12pt is the absolute floor (captions/footnotes only). Prefer 14pt where space allows. If content doesn't fit at 12pt, reduce the content rather than the font size.

### Color Consistency Across Slides

When a set of concepts (e.g., "Agent", "Model", "Skill", "Harness", "Connector") appears on multiple slides, assign each concept a fixed color from the palette and use that same color on every slide. Define the mapping once at the start of the build script and reference it throughout.

**Wrong:** Slide 1 has Agent=purple, Model=orange. Slide 2 has Agent=green, Model=purple.
**Right:** Agent is always teal (`009B81`), Model is always navy (`0E2841`), Skill is always periwinkle (`8FA1FF`) — on every slide.

This applies to colored blocks, boxes, icons, or any visual element that represents a named concept. The viewer should be able to recognize a concept by its color without reading the label.

---

## QA (Required)

**Assume there are problems. Your job is to find them.**

Your first render is almost never correct. Approach QA as a bug hunt, not a confirmation step.

### Content QA

```bash
python -m markitdown output.pptx
```

Check for missing content, typos, wrong order.

**Check for leftover placeholder text:**

```bash
python -m markitdown output.pptx | grep -iE "xxxx|lorem|ipsum|Topic [0-9]|this.*(page|slide).*layout"
```

If grep returns results, fix them before declaring success. "Topic 1/2/3" are template placeholders that must be replaced with real content.

### Visual QA

**⚠️ USE SUBAGENTS** — even for 2-3 slides. Subagents have fresh eyes.

Convert slides to images (see [Converting to Images](#converting-to-images)), then use this prompt:

```
Visually inspect these slides. Assume there are issues — find them.

Brand check (Numa Collective palette):
- Are backgrounds correct? (title: 943C31 burgundy, dark slides: 0E2841 navy, light slides: F3F0EB cream — never pure white)
- Are card accent bars golden amber (FBAE40)?
- Are stat circles vibrant orange-red (FF562C)?
- Are headings in the correct color? (0E2841 on light, FFFFFF on dark)
- Is body text black (000000), not gray?
- Do dark slides have geometric line overlays?
- Are all colors from the Numa palette? (no generic blues, no off-brand colors)
- Are numbered shapes consistent? (all same shape type AND same color within each slide)
- If 4+ sections: do content slides have section-number squares top-left?

Template check:
- Does the title slide have an actual title and subtitle filled in (not empty placeholders)?
- Has "Topic 1/2/3" been replaced with actual section names on agenda slides?
- Is the agenda highlight bar on the correct section?

Layout check:
- Overlapping elements
- Text overflow or cut off
- Elements too close (< 0.3" gaps)
- Uneven gaps
- Insufficient margin from slide edges (< 0.5")
- Columns not aligned consistently
- Low-contrast text or icons
- Text boxes too narrow causing excessive wrapping

Report ALL issues found, including minor ones.
```

### Verification Loop

1. Generate slides → Convert to images → Inspect
2. **List issues found** (if none found, look again more critically)
3. Fix issues
4. **Re-verify affected slides** — one fix often creates another problem
5. Repeat until a full pass reveals no new issues

**Do not declare success until you've completed at least one fix-and-verify cycle.**

---

## Converting to Images

```bash
python $SKILL_DIR/scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
ls slide-*.jpg
```

**Use the paths printed by `ls`.** `pdftoppm` zero-pads based on page count: `slide-1.jpg` for decks under 10 pages, `slide-01.jpg` for 10-99, `slide-001.jpg` for 100+.

To re-render specific slides after fixes:

```bash
pdftoppm -jpeg -r 150 -f N -l N output.pdf slide-fixed
```

---

## Dependencies

- `pip install "markitdown[pptx]"` - text extraction
- `pip install Pillow` - thumbnail grids
- `npm install pptxgenjs pptx-automizer` - run in the working directory before generating slides
- LibreOffice (`soffice`) - PDF conversion (auto-configured for sandboxed environments via `scripts/office/soffice.py`)
- Poppler (`pdftoppm`) - PDF to images
