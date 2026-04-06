# Task 005: Fix Skill Standards Issues

## Context

A review against Claude skill authoring standards found several issues. This task fixes them.

Files to edit:
- `pptx-numa/pptx-numa/SKILL.md`
- `pptx-numa/pptx-numa/pptxgenjs.md`

New file to create:
- `pptx-numa/pptx-numa/visual-elements.md`

## Changes

### 1. Extract "Preferred Visual Elements" to a reference file

SKILL.md is ~825 lines. The "Preferred Visual Elements" section (elements 1-16 with code examples) is the largest block and is reference material, not core routing/constraints. Move it to a new file `visual-elements.md`.

**In SKILL.md**, replace the entire "## Preferred Visual Elements" section (from the heading through element 16) with:

```markdown
## Preferred Visual Elements

**Read [visual-elements.md](visual-elements.md) for the full catalog of 16 visual patterns with code examples.**

When building slides, choose from these patterns to ensure visual variety and brand consistency. Key patterns include card grids, colored content blocks, honeycomb diagrams, process flows, stat callouts, flywheel diagrams, and more. Never create text-only slides — every slide needs a visual element.
```

**Create `visual-elements.md`** with the extracted content. Add a title `# Preferred Visual Elements` and keep all 16 elements with their code examples exactly as they are.

### 2. Extract "Template Slide Layouts" to a reference file

The layout catalog is another large reference block. Move it to a new file `template-layouts.md`.

**In SKILL.md**, replace the "### Template Slide Layouts" subsection (the full catalog with all 4 tables and the usage note) with:

```markdown
### Template Slide Layouts

The template contains **36 slide layouts** organized into 4 categories: Title Slides, K-series (light/cream background), D-series (dark navy background), and Section Headers.

**Read [template-layouts.md](template-layouts.md) for the full catalog with filenames and descriptions.**

Most common choices:
- `slideLayout3.xml` — K - Title and Content (most content slides)
- `slideLayout2.xml` — K - 1/3 Rust (intro/section openers)
- `slideLayout28.xml` — D - Title and Content (dark slides)

Usage: `python $SKILL_DIR/scripts/add_slide.py unpacked/ slideLayout3.xml`
```

**Create `template-layouts.md`** with the extracted content. Add a title `# Template Slide Layouts` and keep all 4 category tables and the usage note.

### 3. Fix npm install guidance

In SKILL.md, the Dependencies section says `npm install -g pptxgenjs` and `npm install -g pptx-automizer`. Global installs don't work reliably with `require()` in local scripts.

Change to:
```markdown
- `npm install pptxgenjs pptx-automizer` - run in the working directory before generating slides
```

(Single line, local install, both packages together.)

### 4. Add generic-examples banner to pptxgenjs.md

After the existing framing blockquote at the top of pptxgenjs.md (the one about Numa workflow), add:

```markdown
> **Note:** Code examples below use generic colors and fonts for API illustration. When building Numa slides, always use the Numa palette and fonts defined in SKILL.md — never use off-brand colors like `FF0000` or fonts like `Arial`.
```

### 5. Add end-to-end happy path to SKILL.md

Add a new section **"## Quick Start — End-to-End Workflow"** right after the Quick Reference table (after line ~33, before the "Reading Content" section). Content:

```markdown
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
```

## Non-goals

- Do NOT change the color palette, design rules, QA section, or brand identity sections
- Do NOT change editing.md (already updated)
- Do NOT change the visual elements content itself — just move it to a new file

## Constraints

- The extracted files must contain exactly the same content as was in SKILL.md — no additions or removals
- SKILL.md should end up under ~550 lines after extraction
