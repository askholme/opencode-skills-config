# Task 004: Update editing.md — Reflect Primary Workflow Status

## Context

editing.md currently frames itself as "Editing Presentations" — implying it's for modifying existing decks. With the template-first workflow, this document is now the **primary path for creating all decks**, not just editing. The content is already mostly correct; it just needs reframing.

The file to edit is: `pptx-numa/pptx-numa/editing.md`

## Objective

Reframe the document as the primary deck creation workflow. Minimal changes.

## Changes

### 1. Title and opening (lines 1-5)

Change:
```markdown
# Editing Presentations

## Template-Based Workflow

When using an existing presentation as a template:
```

To:
```markdown
# Creating & Editing Presentations

This is the **default workflow** for all Numa decks. Every deck starts from the bundled template (`$SKILL_DIR/assets/agenda.pptx`), which provides branded slide layouts, embedded fonts (Georgia, Play), and the correct theme. Only use pptxgenjs for complex visual slides that are then imported back — see SKILL.md.

## Workflow
```

### 2. Step 1 — Analyze (lines 7-12)

The current step says "Analyze existing slides" with generic `template.pptx`. Update to reference the Numa template specifically:

```markdown
1. **Copy and analyze the template**:
   ```bash
   cp $SKILL_DIR/assets/agenda.pptx working.pptx
   python $SKILL_DIR/scripts/thumbnail.py working.pptx
   python -m markitdown working.pptx
   ```
   Review `thumbnails.jpg` to see available layouts. See SKILL.md → "Template Slide Layouts" for the full catalog of 36 layouts.
```

### 3. Step 2 — Plan slide mapping (lines 14-27)

Update the opening line from "For each content section, choose a template slide" to "For each content section, choose a template slide layout." Add a note referencing the layout catalog:

```markdown
2. **Plan slide mapping**: For each content section, choose a slide layout from the template. See SKILL.md → "Template Slide Layouts" for the full catalog. Common choices:
   - `slideLayout3.xml` (K - Title and Content) — most content slides
   - `slideLayout2.xml` (K - 1/3 Rust) — intro/section opener slides
   - `slideLayout4.xml` (K - 2 columns) — comparison/side-by-side
   - `slideLayout12.xml` (K - 3 columns) — three parallel concepts
   - `slideLayout28.xml` (D - Title and Content) — dark background slides
   - Section Header layouts — dividers between sections
```

Keep the existing "USE VARIED LAYOUTS" warning and the layout variety list below it.

### 4. Step 3 — Unpack (line 29)

Change `python scripts/office/unpack.py template.pptx unpacked/` to:
```
python $SKILL_DIR/scripts/office/unpack.py working.pptx unpacked/
```

### 5. Step 4 — Build presentation (lines 31-35)

Add a note about creating slides from layouts:
```markdown
4. **Build presentation** (do this yourself, not with subagents):
   - Create slides from layouts: `python $SKILL_DIR/scripts/add_slide.py unpacked/ slideLayout3.xml`
   - Delete unwanted template slides (remove from `<p:sldIdLst>`)
   - Reorder slides in `<p:sldIdLst>`
   - **Complete all structural changes before step 5**
```

### 6. Step 7 — Pack (line 42)

Change to:
```
python $SKILL_DIR/scripts/office/pack.py unpacked/ output.pptx --original working.pptx
```

### 7. Script paths (lines 56-97)

Update the script command examples to use `$SKILL_DIR/scripts/` prefix consistently (currently they use bare `scripts/` paths). This matches the convention established in SKILL.md.

## Non-goals

- Do NOT change the Editing Content section, Formatting Rules, Common Pitfalls, or Smart Quotes sections
- Do NOT add Numa color/font rules here (those are in SKILL.md)
- Do NOT change the script descriptions (just the example paths)
