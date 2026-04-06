# Task 006: Replace Generic Colors in pptxgenjs.md with Numa Palette

## Context

pptxgenjs.md is part of the Numa skill and all examples should use Numa colors. Currently it has generic off-brand colors throughout. Replace them all with appropriate Numa palette colors.

The file to edit is: `pptx-numa/pptx-numa/pptxgenjs.md`

## Numa Palette Reference

| Hex | Name | Role |
|-----|------|------|
| `0E2841` | Deep Navy | Headings, dark backgrounds |
| `F3F0EB` | Warm Cream | Light slide background |
| `000000` | Black | Body text (OK to keep) |
| `FFFFFF` | White | Text on dark, card fills (OK to keep) |
| `009B81` | Teal Green | Primary accent |
| `8FA1FF` | Periwinkle Blue | Soft accent |
| `FF562C` | Vibrant Orange-Red | High-energy accent |
| `C0A883` | Tan Gold | Warm neutral |
| `943C31` | Burgundy | Rich contrast |
| `C6C6D0` | Light Gray | Borders, dividers |
| `FBAE40` | Golden Amber | Card accents |
| `F26B43` | Softer Orange | Bold headers |

## Specific Replacements

### Setup example (line 18)
- `"363636"` → `"0E2841"` (navy — it's heading text)

### Text & Formatting (lines 36-63)
- `fontFace: "Arial"` → `fontFace: "Play"` (line 39)
- `color: "363636"` → `color: "0E2841"` (line 40)

### Shapes (lines 92-122)
- `fill: { color: "FF0000" }` → `fill: { color: "943C31" }` (burgundy, line 95)
- `line: { color: "000000"` — keep as-is (black is in palette)
- `fill: { color: "0000FF" }` → `fill: { color: "8FA1FF" }` (periwinkle, line 98)
- `line: { color: "FF0000"` → `line: { color: "943C31"` (burgundy, line 101)
- `fill: { color: "0088CC"` → `fill: { color: "009B81"` (teal, line 107)
- Shadow `color: "000000"` — keep as-is (black shadow is fine)

### Slide Backgrounds (lines 255-267)
- `color: "F1F1F1"` → `color: "F3F0EB"` (cream, line 257)
- `color: "FF3399"` → `color: "8FA1FF"` (periwinkle, line 260)

### Tables (lines 273-287)
- `border: { pt: 1, color: "999999" }` → `border: { pt: 1, color: "C6C6D0" }` (light gray, line 279)
- `fill: { color: "F1F1F1" }` → `fill: { color: "F3F0EB" }` (cream, line 279)
- `fill: { color: "6699CC" }` → `fill: { color: "009B81" }` (teal, line 284)

### Charts (lines 294-343)
- `chartColors: ["0D9488", "14B8A6", "5EEAD4"]` → `chartColors: ["009B81", "8FA1FF", "C0A883"]` (teal, periwinkle, tan — line 323)
- `catAxisLabelColor: "64748B"` → `catAxisLabelColor: "C6C6D0"` (light gray, line 329)
- `valAxisLabelColor: "64748B"` → `valAxisLabelColor: "C6C6D0"` (light gray, line 330)
- `valGridLine: { color: "E2E8F0"` → `valGridLine: { color: "C6C6D0"` (light gray, line 333)
- `dataLabelColor: "1E293B"` → `dataLabelColor: "0E2841"` (navy, line 339)

### Slide Masters (lines 357-367)
- `background: { color: '283A5E' }` → `background: { color: '0E2841' }` (navy, line 359)

### Common Pitfalls (lines 371-415)
- Pitfall 1: `color: "FF0000"` / `color: "#FF0000"` — these are illustrating a syntax rule (# vs no #). Replace with `color: "943C31"` / `color: "#943C31"` (line 377-378)
- Pitfall 8: `fill: { color: "0891B2" }` → `fill: { color: "FBAE40" }` (golden amber accent bar, lines 410, 414) — appears twice (wrong and correct examples)

### Icons (lines 215, 231)
- `color = "#000000"` in renderIconSvg default — keep as-is (black is in palette, and this is SVG context where # is correct)
- `"#4472C4"` → `"#009B81"` (teal, line 231 — note: # is correct here, it's SVG/React context)

### Also remove the generic-examples banner (line 7)
Since all examples will now use Numa colors, the banner saying "Code examples below use generic colors" is no longer true. Remove it.

## Non-goals
- Do NOT change the API explanations, structure, or Common Pitfalls logic
- Do NOT change the framing blockquote at the top (lines 3-5) — that stays
- Do NOT change positioning, sizing, or layout values
