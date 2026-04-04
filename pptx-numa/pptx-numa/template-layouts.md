# Template Slide Layouts

The template's slide master defines 36 layouts. Use `add_slide.py` to create a new slide from any of them.

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

> **How to use:** `python $SKILL_DIR/scripts/add_slide.py unpacked/ slideLayout3.xml` creates a new blank slide using that layout. The slide inherits the layout's title position, font, size, and body area — just fill in the `<a:t>` text elements.
>
> **Choosing a layout:** For most content slides, use `slideLayout3.xml` (K - Title and Content). For intro/section openers, use `slideLayout2.xml` (K - 1/3 Rust). For dark slides, use the D-series. For section dividers, use Section Headers.
