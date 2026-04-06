# Task 002: Update SKILL.md — Template Layout Catalog and pptx-automizer Import Workflow

## Context

SKILL.md has been updated with the template-first workflow, correct typography, and new design rules (task 001). It now needs two additions: (1) a catalog of the 36 slide layouts available in `agenda.pptx` so the agent knows what to pick, and (2) documentation of the pptx-automizer import workflow for complex visual slides.

The file to edit is: `pptx-numa/pptx-numa/SKILL.md`

## Objective

Add the layout catalog and the pptx-automizer import workflow to SKILL.md.

## Changes

### 1. Template Layout Catalog — new subsection

Add a new subsection **"### Template Slide Layouts"** inside the existing "Bundled Template" section, after the "Agenda Slides" subsection (after the agenda usage instructions, before the "Numbered Visual Elements" section).

The catalog should be organized by category with a brief description of each. The agent needs to know the layout filename (for `add_slide.py`) and what it looks like.

**Layout categories:**

**Title Slides** (full-slide branded title pages):
| Layout file | Name | Description |
|---|---|---|
| `slideLayout1.xml` | Title Slide A | Primary title slide layout |
| `slideLayout6.xml` | Title Slide B | Alternative title layout |
| `slideLayout7.xml` | Title Slide C | Alternative title layout |
| `slideLayout8.xml` | Title Slide D | Alternative title layout |
| `slideLayout9.xml` | Title Slide E | Alternative title layout |
| `slideLayout10.xml` | Title Slide F | Alternative title layout |

**K-series — Light/cream background slides** (background: cream `F3F0EB` via scheme color `lt1`):
| Layout file | Name | Description |
|---|---|---|
| `slideLayout3.xml` | K - Title and Content | **Most common.** Full-width title + body content area. Title at y=648000, body at y=2088000. |
| `slideLayout4.xml` | K - 2 columns | Title + two equal content columns |
| `slideLayout11.xml` | K - 2 columns & headers | Title + two columns, each with its own header |
| `slideLayout12.xml` | K - 3 columns | Title + three equal content columns |
| `slideLayout13.xml` | K - 3 columns & headers | Title + three columns, each with its own header |
| `slideLayout2.xml` | K - 1/3 Rust | Left 1/3 panel (rust/burgundy) with title, right 2/3 for image/content. **Use for intro/section opener slides.** |
| `slideLayout14.xml` | K - 1/3 Green | Same split layout, green left panel |
| `slideLayout15.xml` | K - 1/3 Purple | Same split layout, purple left panel |
| `slideLayout16.xml` | K - 1/3 Red | Same split layout, red left panel |
| `slideLayout17.xml` | K - 1/3 Beige | Same split layout, beige left panel |
| `slideLayout18.xml` | K - 1/2 Green | Left half panel (green), right half for content |
| `slideLayout19.xml` | K - 1/2 Purple | Left half panel (purple), right half for content |
| `slideLayout20.xml` | K - 1/2 Red | Left half panel (red), right half for content |
| `slideLayout21.xml` | K - 1/2 Beige | Left half panel (beige), right half for content |
| `slideLayout22.xml` | K - 1/2 Rust | Left half panel (rust), right half for content |
| `slideLayout23.xml` | K - Statement Green | Full-slide statement/quote layout, green accent |
| `slideLayout24.xml` | K - Statement Purple | Full-slide statement/quote layout, purple accent |
| `slideLayout25.xml` | K - Statement Red | Full-slide statement/quote layout, red accent |
| `slideLayout26.xml` | K - Statement Beige | Full-slide statement/quote layout, beige accent |
| `slideLayout27.xml` | K - Statement Rust | Full-slide statement/quote layout, rust accent |

**D-series — Dark background slides** (background: inherited from slide master, dark navy `0E2841`):
| Layout file | Name | Description |
|---|---|---|
| `slideLayout28.xml` | D - Title and Content | Dark version of Title and Content |
| `slideLayout29.xml` | D - 2 columns | Dark version of 2 columns |
| `slideLayout30.xml` | D - 2 columns & headers | Dark version of 2 columns with headers |
| `slideLayout31.xml` | D - 3 columns | Dark version of 3 columns |
| `slideLayout32.xml` | D - 3 columns & headers | Dark version of 3 columns with headers |

**Section Headers** (divider slides between sections):
| Layout file | Name | Description |
|---|---|---|
| `slideLayout5.xml` | Section Header Purple | Section divider, purple accent |
| `slideLayout33.xml` | Section Header Green | Section divider, green accent |
| `slideLayout34.xml` | Section Header Red | Section divider, red accent |
| `slideLayout35.xml` | Section Header Beige | Section divider, beige accent |
| `slideLayout36.xml` | Section Header Rust | Section divider, rust accent |

Add a usage note after the catalog:

> **How to use:** `python $SKILL_DIR/scripts/add_slide.py unpacked/ slideLayout3.xml` creates a new blank slide using that layout. The slide inherits the layout's title position, font, size, and body area — just fill in the `<a:t>` text elements.
>
> **Choosing a layout:** For most content slides, use `slideLayout3.xml` (K - Title and Content). For intro/section openers, use `slideLayout2.xml` (K - 1/3 Rust). For dark slides, use the D-series. For section dividers, use Section Headers.

### 2. pptx-automizer Import Workflow — new section

Add a new section **"## Importing Complex Visual Slides"** after the "Generating Complex Visual Slides (Secondary)" section. Content:

```markdown
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
```

## Non-goals

- Do NOT change the visual elements catalog, color palette, QA section, or design rules
- Do NOT change editing.md or pptxgenjs.md (separate tasks)
- Do NOT change any Python scripts or the agenda.pptx template

## Constraints

- Place the layout catalog inside the existing "Bundled Template" section, not as a new top-level section
- Place the import workflow section right after the "Generating Complex Visual Slides (Secondary)" section
- The pptx-automizer code example must use `require()` (CommonJS) to match the existing pptxgenjs examples in the skill
