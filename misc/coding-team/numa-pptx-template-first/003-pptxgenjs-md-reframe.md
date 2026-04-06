# Task 003: Update pptxgenjs.md — Reframe as Generate-for-Import

## Context

pptxgenjs.md is a reference document for the pptxgenjs API. With the template-first workflow, pptxgenjs is now only used to generate complex visual slides that get imported into the template deck via pptx-automizer. The document needs a framing note at the top, and the Setup section needs to reflect the "generate for import" pattern rather than "create a standalone deck."

This file is a **generic pptxgenjs API reference** — it is NOT Numa-specific. It documents how pptxgenjs works. The Numa-specific rules (fonts, colors, positioning) live in SKILL.md. So the changes here should be minimal and focused on framing.

The file to edit is: `pptx-numa/pptx-numa/pptxgenjs.md`

## Objective

Add a framing note and update the Setup section so the reader understands this is for generating slides that will be imported, not for standalone decks.

## Changes

### 1. Add a framing note at the top

After the `# PptxGenJS Tutorial` heading (line 1), add:

```markdown
> **In the Numa workflow, pptxgenjs is used only to generate complex visual slides (diagrams, charts, multi-shape layouts) that are then imported into the template-based deck via pptx-automizer. It is NOT used to create standalone decks. See SKILL.md for the full workflow.**
>
> **Fonts come from the template, not from pptxgenjs.** When your generated slide is imported into the template deck, the template's embedded fonts (Georgia for titles, Play for body) take effect. You can still specify `fontFace` in pptxgenjs for visual accuracy during development, but the template is the source of truth.
```

### 2. Update the Setup & Basic Structure example

The current example shows `pres.writeFile({ fileName: "Presentation.pptx" })` which implies standalone output. Update it to show the generate-for-import pattern:

```javascript
const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';  // 13.3" × 7.5" — MUST match the Numa template

let slide = pres.addSlide();
slide.addText("Hello World!", { x: 0.5, y: 0.5, fontSize: 36, color: "363636" });

// Write to a temporary file — this will be imported into the template deck via pptx-automizer
pres.writeFile({ fileName: "generated-slides.pptx" });
```

Key changes:
- Default layout changed from `LAYOUT_16x9` to `LAYOUT_WIDE` with a comment explaining why
- Comment on writeFile changed to indicate this is a temporary file for import
- Remove the `pres.author` and `pres.title` lines (irrelevant for throwaway files)

Keep the layout dimension reference list below unchanged — it's useful API reference.

### 3. No other changes

The rest of the document (Text & Formatting, Lists, Shapes, Images, Icons, Charts, Common Pitfalls, Quick Reference) is generic pptxgenjs API reference and should remain unchanged. Do not add Numa-specific font/color rules here — those belong in SKILL.md.

## Non-goals

- Do NOT add Numa color palette or font rules to this file
- Do NOT change the API reference sections (Shapes, Images, Charts, etc.)
- Do NOT change Common Pitfalls
