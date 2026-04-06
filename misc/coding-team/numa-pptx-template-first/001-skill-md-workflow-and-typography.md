# Task 001: Update SKILL.md — Core Workflow, Typography, and Design Rules

## Context

The numa-pptx skill currently instructs the agent to create slides from scratch with pptxgenjs as the default path. The actual Numa template (`agenda.pptx`) already contains 36 branded slide layouts with correct fonts (Georgia for titles, Play for body), embedded font files, and proper positioning. The skill should use the template as the starting point, not pptxgenjs.

The file to edit is: `pptx-numa/pptx-numa/SKILL.md`

## Objective

Restructure SKILL.md so the template-first workflow is the default, fix typography, fix positioning, and add two new design rules.

## Changes

### 1. Quick Reference table (line ~28-33)

Change the table so the rows are:

| Task | Guide |
|------|-------|
| Read/analyze content | `python -m markitdown presentation.pptx` |
| Create or edit a deck (default) | Read [editing.md](editing.md) |
| Generate complex visual slides | Read [pptxgenjs.md](pptxgenjs.md) — for import into template only |

### 2. "Editing Workflow" section (line ~51-57)

Rename to **"Creating & Editing Workflow (Default)"**. Update the description to make clear this is the primary path for all decks. The workflow is:

1. Copy `$SKILL_DIR/assets/agenda.pptx` to a working file
2. Unpack it
3. Create slides from template layouts using `add_slide.py`
4. Edit slide XML to fill in content
5. Clean and repack

### 3. "Creating from Scratch" section (line ~60-77)

Rename to **"Generating Complex Visual Slides (Secondary)"**. Reframe: pptxgenjs is only for slides with complex programmatic visuals (multi-shape diagrams, charts, intricate layouts) that are painful to build in raw XML. These slides are generated as throwaway .pptx files and then imported into the template-based deck using pptx-automizer. The agent should never output a standalone pptxgenjs deck.

Keep the LAYOUT_WIDE warning — it still applies when generating slides for import.

### 4. Typography section (line ~255-268)

Replace all font references. The correct fonts are:

| Element | Font | Size | Style |
|---------|------|------|-------|
| Slide title | Georgia | 34pt (fixed — do not vary) | Regular weight, `0E2841` on light / `FFFFFF` on dark |
| Section header | Play | 20-24pt | Bold, `009B81` or `0E2841` |
| Left-side "statement" text | Play | 28-36pt | Regular, `F26B43` (orange) |
| Body text | Play | 14-16pt | Regular, `000000` |
| Bold inline labels | Play | 14-16pt | Bold, `0E2841` |
| Captions/footnotes | Play | 10-12pt | Regular, `C0A883` (tan) or `C6C6D0` (gray) |
| Stat numbers | Play | 60-72pt | Bold, `FFFFFF` (inside colored circles) |
| Agenda topic text | Play | 16-18pt | Bold, `0E2841` (navy) |
| Squared/circled numbers | Play | 14-18pt | Bold, `FFFFFF` on colored fill |

Key point to add: "Title font size is locked at 34pt. Do not use a range. The template enforces this via the slide layout definition."

Also add a note: "These fonts are embedded in the template (`ppt/fonts/`). When working from the template (the default workflow), fonts are inherited automatically — do not specify fontFace in pptxgenjs or override font attributes in XML unless you have a specific reason."

### 5. Positioning — add new subsection after Typography

Add a "Slide Positioning" subsection with these rules:

**Content slides (using "K - Title and Content" layout or similar):**
- Title: x=648000 EMU (0.68"), y=648000 EMU (0.68"), width=10897200 EMU (11.41"), height=470898 EMU (0.49")
- Body content area: starts at y=2088000 EMU (2.19") — well below the title
- Do not place content between the title and y=2.19" — that space is intentional breathing room

**Intro/section slides (using "K - 1/3 Rust" or similar split layouts):**
- Title: x=648000 EMU, y=2709000 EMU (vertically centered in left panel), width=3096000 EMU, height=1440000 EMU

**Title slide (slide 1):**
- Uses template placeholders — do not override positioning

Note: "These coordinates come from the template's slide layout definitions. When creating slides from template layouts, the placeholders inherit these positions automatically. Only specify coordinates when adding free-form shapes."

### 6. New design rule: Shape corner consistency

Add to the "Design Rules" → "Avoid (Common Mistakes)" list:

- **Don't combine straight-edged accent bars with rounded-corner shapes** — if a shape has rounded corners (ROUNDED_RECTANGLE), any accent bar or border overlay must also have rounded corners, or more practically: use RECTANGLE (straight corners) for shapes that have accent bars. The straight bar won't cover the rounded corners and creates a visual glitch.

### 7. New design rule: Color consistency for recurring concepts

Add a new subsection under "Design Rules" called **"Color Consistency Across Slides"**:

When a set of concepts (e.g., "Agent", "Model", "Skill", "Harness", "Connector") appears on multiple slides, assign each concept a fixed color from the palette and use that same color on every slide. Define the mapping once at the start of the build script and reference it throughout.

**Wrong:** Slide 1 has Agent=purple, Model=orange. Slide 2 has Agent=green, Model=purple.
**Right:** Agent is always teal (`009B81`), Model is always navy (`0E2841`), Skill is always periwinkle (`8FA1FF`) — on every slide.

This applies to colored blocks, boxes, icons, or any visual element that represents a named concept. The viewer should be able to recognize a concept by its color without reading the label.

### 8. Agenda slide description (line ~129)

Change "Calibri Light" to "Georgia" in the agenda slide description. Change "Calibri" references in agenda topic text to "Play".

### 9. All pptxgenjs code examples throughout the file

Any code example that uses `fontFace: "Calibri Light"` or `fontFace: "Calibri"` should be updated to use `fontFace: "Georgia"` for titles and `fontFace: "Play"` for body/other text. This affects the numbered elements section, visual elements section, etc.

### 10. Dependencies section (line ~668-673)

Add pptx-automizer:
```
- `npm install -g pptx-automizer` - importing generated slides into template
```

## Non-goals

- Do NOT change the color palette, visual elements catalog, or QA sections (beyond font name fixes)
- Do NOT rewrite editing.md or pptxgenjs.md (those are separate tasks)
- Do NOT change any Python scripts or the agenda.pptx template file

## Constraints

- Keep the file structure recognizable — don't reorganize sections that don't need it
- The pptxgenjs code examples throughout the visual elements section should still work as pptxgenjs code (they'll be used for the "generate for import" path) — just fix the font names
