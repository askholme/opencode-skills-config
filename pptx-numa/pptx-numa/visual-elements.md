# Preferred Visual Elements

**These are visual patterns to use actively instead of generic layouts. They give slides a professional, distinctive feel.**

### 1. Geometric Line Overlay (Dark Slides)

Dark navy (`0E2841`) background with large, angled rectangular outlines drawn in a slightly lighter shade. These are thin-stroke (1-2pt) tilted rectangles that overlap across the slide, creating a subtle architectural/geometric texture. Use on section dividers and dark content slides.

```javascript
const makeGeoLine = () => ({
  line: { color: "8FA1FF", width: 1 },
  fill: { color: "0E2841", transparency: 100 },
  rotate: 15
});
slide.addShape(pres.shapes.RECTANGLE, { x: 2, y: -1, w: 4, h: 8, ...makeGeoLine() });
slide.addShape(pres.shapes.RECTANGLE, { x: 5, y: -0.5, w: 3.5, h: 7, ...makeGeoLine(), rotate: 20 });
```

### 2. Content Blocks — Choose ONE Style Per Deck

Two card/block styles are available. **Pick one for the entire deck and use it consistently — never mix them.**

#### 2A. Card Grid with Left Accent Border

Quieter, consultancy tone. 2×2 or 2×3 grid of white rectangular cards on a cream (`F3F0EB`) background. Each card has a bold golden amber (`FBAE40`) left-edge bar (0.08" wide) and contains a bold quoted headline with lighter description text below.

```javascript
const cardX = 0.5, cardY = 1.5, cardW = 4.2, cardH = 1.4;
slide.addShape(pres.shapes.RECTANGLE, {
  x: cardX, y: cardY, w: cardW, h: cardH,
  fill: { color: "FFFFFF" },
  shadow: { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 }
});
slide.addShape(pres.shapes.RECTANGLE, {
  x: cardX, y: cardY, w: 0.08, h: cardH,
  fill: { color: "FBAE40" }
});
```

#### 2B. Colored Content Blocks (Alternative)

Bolder, higher-energy tone — suits pitch decks and executive summaries. 2-3 rounded-corner rectangular blocks side by side, each filled with a solid accent color from the palette. White header and body text inside. The block itself IS the visual — no white card, no subtle accent bar.

Good color combinations for a 3-block row:
- `009B81` (teal) + `0E2841` (navy) + `8FA1FF` (periwinkle)
- `943C31` (burgundy) + `009B81` (teal) + `C0A883` (tan)

```javascript
const blocks = [
  { x: 0.5, color: "009B81", title: "Feature A", body: "Description..." },
  { x: 4.7, color: "0E2841", title: "Feature B", body: "Description..." },
  { x: 8.9, color: "8FA1FF", title: "Feature C", body: "Description..." },
];
blocks.forEach(b => {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: b.x, y: 2.0, w: 3.8, h: 3.5,
    fill: { color: b.color },
    rectRadius: 0.15,
  });
  slide.addText(b.title, {
    x: b.x + 0.3, y: 2.3, w: 3.2, h: 0.5,
    fontSize: 18, bold: true, color: "FFFFFF",
  });
  slide.addText(b.body, {
    x: b.x + 0.3, y: 2.9, w: 3.2, h: 2.2,
    fontSize: 14, color: "FFFFFF",
  });
});
```

### 3. Honeycomb / Hexagon Diagram

Interlocking hexagon shapes arranged in a honeycomb cluster (typically 7-9 hexagons). Each hexagon contains a small icon above a category label. Fill hexagons with a very light tone of `C6C6D0` or `F3F0EB`, with `0E2841` (navy) text labels.

### 4. Side-by-Side Comparison Cards

Two white cards placed horizontally, each with an icon and teal (`009B81`) top border. A double-arrow or connecting element sits between them. A full-width dark navy (`0E2841`) banner bar sits below with white italic text for a key takeaway.

### 5. Process Flow (Left-to-Right)

Three columns connected by arrows: (1) input/problem on the left, (2) central framework in the middle, (3) output/result on the right. Teal (`009B81`) chevron arrows connect the stages.

### 6. Timeline / Gantt Phase Bars

Horizontal phase bars across columns representing time periods. Color-coded bars: `009B81` (teal) for discovery, `0E2841` (navy) for decision points, `8FA1FF` (periwinkle) for analysis, `C0A883` (tan) for implementation.

### 7. Org Chart / Hierarchy Boxes

Vertically stacked rectangular boxes in `8FA1FF` (periwinkle) or `009B81` (teal) fill with white or dark text, connected by vertical arrows. Clean, simple, no rounded corners.

### 8. Team Photo Layout

Dark navy (`0E2841`) background with geometric line overlays. Rectangular (not rounded) photo frames in an evenly-spaced horizontal row. Name and title text below each in white.

### 9. Stat Callout with Colored Circles

Large colored circles (`FF562C`) containing bold white numbers (60-72pt). Label text beside or below in `0E2841` (navy). All circles on the slide must be the same color.

### 10. Full-Width Takeaway Banner

A full-width rectangular bar at the bottom of content slides, filled with `0E2841` (navy), containing white italic text with a key insight. Approximately 0.6-0.8" tall, spanning edge to edge.

### 11. Colored Arrow Rows (Value Propositions)

A vertical list of key points, each prefixed by a small colored square marker using a different accent color in sequence (`009B81`, `8FA1FF`, `FF562C`, `C0A883`, `943C31`). On the right side, large decorative arrow shapes in the same colors point inward.

### 12. Half-Image + Statement Layout

A full-bleed background image covering the left third of the slide. A large "statement" text block in `F26B43` (orange) sits on the left. The right two-thirds contains structured content — bold navy headers with regular body text.

### 13. Clean Data Tables

Minimal borders. Alternating light `C6C6D0` and white rows. Bold teal (`009B81`) text for header/label column. Checkmarks for completed items. A highlighted summary row with `C6C6D0` fill. No heavy grid lines.

### 14. Line-Art Icon Row with Circles

A horizontal row of evenly-spaced thin-stroke circles (1.5-2pt outline, no fill or very light fill), each containing a simple monochrome line-art icon or symbol. Below each circle sits a bold column header and descriptive text. Use whenever a slide presents 3-5 parallel concepts, process steps, or feature columns — this is the go-to way to add visual structure to a horizontal layout without heavy shapes.

Circle outlines in `009B81` (teal) or `0E2841` (navy). Icons inside are the same color. All circles the same size (~0.7" diameter) and same outline color on a given slide.

```javascript
// Icon row — 5 evenly spaced on LAYOUT_WIDE (13.33")
const circleY = 1.8, circleSize = 0.7;
const cols = [1.5, 4.0, 6.5, 9.0, 11.5];
const iconSymbols = ["⏳", "🔍", "💬", "📋", "🤝"]; // or use image files
const headers = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];

cols.forEach((cx, i) => {
  // Thin-stroke circle outline
  slide.addShape(pres.shapes.OVAL, {
    x: cx - circleSize/2, y: circleY, w: circleSize, h: circleSize,
    line: { color: "009B81", width: 1.5 },
    fill: { color: "F3F0EB", transparency: 100 },
  });
  // Icon or symbol inside
  slide.addText(iconSymbols[i], {
    x: cx - circleSize/2, y: circleY, w: circleSize, h: circleSize,
    fontSize: 24, color: "009B81", align: "center", valign: "middle",
  });
  // Column header below
  slide.addText(headers[i], {
    x: cx - 1.0, y: circleY + 0.85, w: 2.0, h: 0.4,
    fontSize: 14, bold: true, color: "0E2841", align: "center",
  });
});
```

If actual icon images are available, place them as small PNGs inside each circle. If not, Unicode symbols or bold single-word labels work as stand-ins.

### 15. Flywheel / Cycle Diagram

A circular diagram with 4 segments surrounding a central element (typically a logo or core concept label). Each quadrant has a short label on or near the circle, with a longer description block positioned in the corresponding corner of the slide. The circular shape conveys that the process is continuous and self-reinforcing.

Use for business model flywheels, virtuous cycles, continuous improvement loops, or any framework where 3-5 elements feed into each other. Different from the hexagon diagram (which shows a static taxonomy) — the flywheel implies motion and interdependence.

The circular shape can be built from 4 curved arrow segments or a simple circle outline divided by lines. Fill segments with light tints of the accent colors or keep them as outlines. Central element in `0E2841` (navy) or with the brand logo. Quadrant labels in bold, descriptions in regular weight.

```javascript
// Central circle
slide.addShape(pres.shapes.OVAL, {
  x: 5.2, y: 2.0, w: 3.0, h: 3.0,
  line: { color: "009B81", width: 2 },
  fill: { color: "F3F0EB" },
});
slide.addText("Core\nConcept", {
  x: 5.2, y: 2.0, w: 3.0, h: 3.0,
  fontSize: 16, bold: true, color: "0E2841",
  align: "center", valign: "middle",
});

// Four directional arrows at 12, 3, 6, 9 o'clock to imply rotation
// (small triangle or chevron shapes placed on the circle's edge)

// Four corner description blocks
const corners = [
  { label: "1. Acquire", x: 0.5, y: 0.8 },    // top-left
  { label: "2. Activate", x: 9.0, y: 0.8 },   // top-right
  { label: "3. Retain", x: 9.0, y: 5.5 },      // bottom-right
  { label: "4. Expand", x: 0.5, y: 5.5 },      // bottom-left
];
corners.forEach(c => {
  slide.addText(c.label, {
    x: c.x, y: c.y, w: 4.0, h: 0.4,
    fontSize: 16, bold: true, color: "009B81",
  });
  slide.addText("Description of this phase...", {
    x: c.x, y: c.y + 0.5, w: 4.0, h: 1.0,
    fontSize: 12, color: "000000",
  });
});
```

### 16. Circled Step Numbers as Overlay Labels

Small accent-colored circles with bold white "01", "02", "03" etc. positioned as floating labels on top of product screenshots, diagrams, or images. They mark sequential steps in a visual walkthrough.

Use on product demo slides, UI walkthroughs, and "how it works" flows where you show actual screenshots and need to guide the viewer through them in order.

**How this differs from Element #9 (Stat Callout Circles):** Stat callouts are large (0.7"+), standalone, and contain data values like "121". These overlay step numbers are smaller (~0.4"), always sequential ("01", "02"...), and are always placed ON TOP of another visual element rather than standing alone.

Styling: ~0.4" diameter circle, filled with a single accent color (typically `FF562C` orange-red or `009B81` teal). White bold "01"-style text. Position overlapping the top-left corner of the screenshot they label. All step circles on the slide use the same color. Same core rules apply — same color per slide, don't mix with squared numbers on the same slide.

```javascript
// Step number overlays on screenshots
const steps = [
  { num: "01", x: 1.2, y: 1.6 },  // overlaps top-left of screenshot 1
  { num: "02", x: 5.0, y: 1.6 },  // overlaps top-left of screenshot 2
  { num: "03", x: 8.8, y: 1.6 },  // overlaps top-left of screenshot 3
];
steps.forEach(s => {
  slide.addShape(pres.shapes.OVAL, {
    x: s.x, y: s.y, w: 0.4, h: 0.4,
    fill: { color: "FF562C" },
  });
  slide.addText(s.num, {
    x: s.x, y: s.y, w: 0.4, h: 0.4,
    fontSize: 12, bold: true, color: "FFFFFF",
    align: "center", valign: "middle",
  });
});
```
