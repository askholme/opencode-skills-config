# Repository Scout Report

_Last updated: 2026-03-22 by @repo-scout_

---

## Detected Stack

### Languages
- **Python** — `pptx-numa/pptx-numa/scripts/*.py` and `scripts/office/*.py`; all scripts use Python 3.10+ syntax (walrus operator `:=` in `add_slide.py`, `tuple[str, str | None]` union syntax)
- **JavaScript (Node.js)** — referenced only in docs (`pptxgenjs.md`); `pptxgenjs` is a _runtime tool invoked by the agent_, not source code in this repo
- **XML / OOXML** — the core artifact format; `.pptx` files are ZIP archives of XML (`ppt/slides/slideN.xml`, `ppt/presentation.xml`, etc.)

### Frameworks and Major Libraries
| Library | Role | Evidence |
|---|---|---|
| `defusedxml.minidom` | Safe XML parsing (OOXML manipulation) | `scripts/clean.py:22`, `scripts/thumbnail.py:25` |
| `Pillow (PIL)` | Image grid creation for thumbnails | `scripts/thumbnail.py:27` |
| `pptxgenjs` (npm) | Create `.pptx` from scratch in JavaScript | `SKILL.md:672`, `pptxgenjs.md` |
| `markitdown` | Text extraction from `.pptx` | `SKILL.md:37`, `editing.md:9` |
| `LibreOffice (soffice)` | PPTX → PDF conversion | `scripts/thumbnail.py:166-175`, `SKILL.md:653` |
| `pdftoppm` (Poppler) | PDF → JPEG image conversion | `SKILL.md:654` |
| `react-icons`, `sharp` | SVG icon rasterisation for pptxgenjs | `pptxgenjs.md:208,219` |

### Build and Packaging
- **No build system** — no `pyproject.toml`, `requirements.txt`, `package.json`, `Makefile`, or any dependency manifest exists in the repo tree.
- Dependencies are **listed as install commands in documentation**, not managed files:
  - `pip install "markitdown[pptx]"` `pip install Pillow` `pip install defusedxml`
  - `npm install -g pptxgenjs react react-dom sharp react-icons`
- The `.skill` file (`pptx-numa/pptx-numa.skill`) is a **ZIP archive** (PK magic bytes confirmed) that bundles the entire `pptx-numa/` subtree for distribution through the opencode Skills system.

### Deployment and Runtime
- **opencode Skill format** — `pptx-numa.skill` is consumed by the opencode Skills runtime. The skill system extracts the ZIP, exposes its base directory path to the agent at load time, and the agent uses `$SKILL_DIR` to resolve all bundled asset and script paths.
- No Docker, CI, or cloud infrastructure files exist.
- Git repo has a single commit (`17449c4`) on `main`; the `.skill` file is untracked (not yet committed to git).

---

## Conventions

### Formatting and Linting
- **No linter or formatter is configured** (no `ruff`, `black`, `flake8`, `.pre-commit-config.yaml`, or `eslint`).
- Code style is consistent with PEP 8 conventions (observed in scripts), but this is un-enforced.

### Type Checking
- **No type-checker configured** (no `mypy`, `pyright`, or `pyrightconfig.json`).
- Scripts use modern Python type annotation syntax (`tuple[str, str | None]`, `list[dict]`) as documentation, not enforced.

### Testing
- **No test suite exists** — no `tests/` directory, no `pytest`, `unittest`, or any test runner configuration.

### Documentation
- Documentation lives inside the skill bundle as Markdown files:
  - `SKILL.md` — master reference (673 lines): brand palette, visual elements, workflow, QA procedures
  - `editing.md` — XML editing workflow (205 lines)
  - `pptxgenjs.md` — pptxgenjs API reference and pitfalls (420 lines)
- `LICENSE.txt` — proprietary Anthropic license; redistribution and derivative works prohibited.

---

## Linting and Testing Commands

**No automated lint, type-check, or test commands exist.** There is no `Makefile`, `justfile`, `tox.ini`, or `pre-commit` configuration.

The only "quality" commands are the **QA procedures described in SKILL.md**:

```bash
# Content QA — extract text and check for leftover placeholders
python -m markitdown output.pptx
python -m markitdown output.pptx | grep -iE "xxxx|lorem|ipsum|Topic [0-9]|this.*(page|slide).*layout"

# Visual QA — render to images
python $SKILL_DIR/scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

_(Source: `pptx-numa/pptx-numa/SKILL.md`, QA section)_

---

## Project Structure Hotspots

```
opencode-skills-config/
├── pptx-numa/
│   ├── pptx-numa.skill          ← Distributable ZIP bundle (untracked in git)
│   └── pptx-numa/               ← Skill source tree (what gets zipped)
│       ├── SKILL.md             ← MASTER REFERENCE — brand rules, full workflow, QA
│       ├── editing.md           ← XML editing workflow for template-based decks
│       ├── pptxgenjs.md         ← pptxgenjs API reference + common pitfalls
│       ├── assets/
│       │   └── agenda.pptx      ← Branded Numa Collective template (6 slides)
│       ├── scripts/
│       │   ├── add_slide.py     ← Duplicate or create slides in unpacked PPTX dirs
│       │   ├── clean.py         ← Remove orphaned XML/media from unpacked dirs
│       │   ├── thumbnail.py     ← Generate slide thumbnail grids for analysis
│       │   └── office/
│       │       ├── unpack.py    ← Extract + pretty-print PPTX as XML
│       │       ├── pack.py      ← Repack XML dir → validated .pptx
│       │       ├── soffice.py   ← LibreOffice wrapper (sandboxed env support)
│       │       ├── validate.py  ← OOXML schema validation
│       │       ├── validators/  ← pptx.py, docx.py, base.py, redlining.py
│       │       ├── helpers/     ← merge_runs.py, simplify_redlines.py
│       │       └── schemas/     ← ISO-IEC29500-4_2016 + ECMA + Microsoft XSDs
│       └── LICENSE.txt          ← Proprietary Anthropic license
```

**Key boundaries:**
- `scripts/office/` — low-level OOXML ZIP manipulation; treat as a stable utility library; do not break its API (unpack/pack/validate)
- `scripts/` (top-level) — higher-level workflow scripts that call `office/`
- `assets/` — binary template file; do not modify programmatically without the unpack → edit → pack cycle
- `SKILL.md` — the agent's primary instruction document; changes here affect all generated decks

---

## Do and Don't Patterns

### Do

- **Use `$SKILL_DIR` prefix for all skill-relative paths.** The opencode runtime injects the base directory path at load time; all scripts and assets must be addressed as `$SKILL_DIR/scripts/...` and `$SKILL_DIR/assets/...`. — `SKILL.md:11-22`

- **Use `defusedxml.minidom` for all XML parsing**, not `xml.etree.ElementTree` (which corrupts OOXML namespaces). — `editing.md:205`, `clean.py:21`

- **Always fresh option objects per pptxgenjs call.** PptxGenJS mutates option objects in-place (converts shadow values to EMU units), so sharing one object across multiple `addShape()` calls corrupts the second shape. Use a factory function: `const makeShadow = () => ({ ... })`. — `pptxgenjs.md:392-399`

- **Use `LAYOUT_WIDE` (13.33" × 7.50") in pptxgenjs**, never `LAYOUT_16x9` (10" × 5.625"). The Numa template uses widescreen; mixing layouts leaves the bottom-right empty on combined slides. — `SKILL.md:68-78`, `pptxgenjs.md:9`

- **Run `clean.py` after any slide deletion or structural change** before repacking. — `editing.md:40`, `clean.py` docstring

- **Use subagents for parallel slide XML editing** — each slide is a separate XML file, so parallel editing is safe and recommended. — `editing.md:115`

- **Visual QA with subagents** — always convert to images and inspect; first renders are presumed to have issues. — `SKILL.md:601-645`

### Don't

- **Don't use `#` prefix on hex color strings in pptxgenjs** — causes file corruption. Use bare hex: `"FF0000"` not `"#FF0000"`. — `pptxgenjs.md:371-374`

- **Don't encode opacity in 8-char hex color strings** (e.g., `"00000020"`) — use the `opacity` property instead. — `pptxgenjs.md:376-380`

- **Don't use unicode bullet characters (`•`)** in pptxgenjs — produces double bullets. Use `bullet: true` option. — `pptxgenjs.md:382`

- **Don't use `ROUNDED_RECTANGLE` with rectangular accent overlay bars** — the bar won't cover rounded corners; use `RECTANGLE` for the card shape instead. — `pptxgenjs.md:401-410`

- **Don't manually copy slide XML files** — use `add_slide.py` which handles `Content_Types.xml`, relationship IDs, and notes references. — `editing.md:109`

- **Don't mix circles and squares on the same slide**, and don't use multiple fill colors for numbered shapes within a single slide. — `SKILL.md:187-189`

- **Don't put geometric line overlays on light/cream slides** — they belong exclusively on dark navy (`0E2841`) slides. — `SKILL.md:567`

- **Don't use colors outside the Numa Collective palette** — no generic blue, no pure white backgrounds; cream `F3F0EB` replaces white. — `SKILL.md:253`

- **Don't use negative shadow `offset` values in pptxgenjs** — use `angle: 270` with a positive offset for upward shadows instead. — `pptxgenjs.md:131`

- **Don't use `xml.etree.ElementTree`** — use `defusedxml.minidom`. — `editing.md:205`

---

## Open Questions

1. **`office/` scripts in the ZIP vs. on disk** — The `.skill` ZIP contains `scripts/office/unpack.py`, `pack.py`, `soffice.py`, `validate.py`, and validator/helper subdirectories that are **not present on disk** in the repo (only `add_slide.py`, `clean.py`, `thumbnail.py` exist in the working tree). The ZIP was built from a different source. If these scripts need to be updated, where is the canonical source? Clarification needed to avoid editing the wrong copy.

2. **Skill distribution mechanism** — It is unclear how `pptx-numa.skill` is consumed by the opencode Skills runtime: is it manually placed in a known directory, deployed via a registry, or referenced by a config file elsewhere on the system? This affects how updates to the skill are published.

3. **No dependency manifest** — There is no `requirements.txt`, `pyproject.toml`, or lockfile. Installing the Python dependencies (`defusedxml`, `Pillow`, `markitdown`) requires following the inline instructions in `SKILL.md`. Adding a `requirements.txt` would disambiguate the exact versions expected.
