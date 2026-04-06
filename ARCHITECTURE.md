# Repository Scout Report

_Last updated: 2026-04-06 by @repo-scout_

---

## Detected Stack

### Languages

| Language | Evidence |
|---|---|
| **Python 3.10+** | `pptx-numa/pptx-numa/scripts/*.py` and `scripts/office/*.py`; uses walrus operator `:=` (`add_slide.py:29`), `tuple[str, str \| None]` union syntax (`add_slide.py:165`), `match/case` (`validate.py:80`) |
| **JavaScript (Node.js)** | `build-deck.js` — a 474-line pptxgenjs script that generates `ai-setup-numa.pptx`; also referenced as a runtime tool in `pptxgenjs.md` |
| **C (inline, generated at runtime)** | `scripts/office/soffice.py` embeds a C shim (`_SHIM_SOURCE`) that is compiled on-the-fly with `gcc` to work around `AF_UNIX` socket restrictions in sandboxed environments |
| **XML / OOXML** | Core artifact format; `.pptx` files are ZIP archives of XML (`ppt/slides/slideN.xml`, `ppt/presentation.xml`, etc.) |
| **Bash** | `install-skills.sh` — skill installer and opencode.json config merger |

### Frameworks and Major Libraries

| Library | Role | Evidence |
|---|---|---|
| `defusedxml.minidom` | Safe XML parsing (OOXML manipulation) | `scripts/clean.py:22`, `scripts/thumbnail.py:25`, `scripts/office/unpack.py:21` |
| `lxml.etree` | XSD schema validation | `scripts/office/validators/base.py:9`, `validators/pptx.py:63`, `validators/docx.py:9` |
| `Pillow (PIL)` | Image grid creation for thumbnails | `scripts/thumbnail.py:27` |
| `pptxgenjs` (npm) | Create `.pptx` from scratch in JavaScript | `build-deck.js:1`, `pptxgenjs.md` |
| `pptx-automizer` (npm) | Import pptxgenjs-generated slides into template deck | `SKILL.md:126-147`, `pptxgenjs.md:3` |
| `markitdown` | Text extraction from `.pptx` | `SKILL.md:37`, `editing.md:9` |
| `LibreOffice (soffice)` | PPTX → PDF conversion | `scripts/office/soffice.py`, `SKILL.md:573` |
| `pdftoppm` (Poppler) | PDF → JPEG image conversion | `SKILL.md:574` |
| `react-icons`, `sharp` | SVG icon rasterisation for pptxgenjs | `pptxgenjs.md:208,219` |
| OOXML XSD schemas | Validation of PPTX/DOCX XML | `scripts/office/schemas/` (ecma/, ISO-IEC29500-4_2016/, mce/, microsoft/) |

### Build and Packaging

- **No build system** — no `pyproject.toml`, `requirements.txt`, `package.json`, `Makefile`, or any dependency manifest exists in the repo tree.
- Dependencies are **listed as install commands in documentation**, not managed files:
  - `pip install "markitdown[pptx]"` `pip install Pillow` `pip install defusedxml` `pip install lxml`
  - `npm install pptxgenjs pptx-automizer` (local install in working directory)
- The `.skill` files (`pptx-numa/pptx-numa.skill` and `pptx-numa.skill`) are **ZIP archives** (binary) that bundle the entire `pptx-numa/pptx-numa/` subtree for distribution through the opencode Skills system. Both contain 62 entries and are identical in content (two copies at different paths).
- `install-skills.sh` is the **deployment script** — it fetches skills from multiple GitHub repos via sparse checkout and merges permissions into `~/.config/opencode/opencode.json`.

### Deployment and Runtime

- **opencode Skill format** — `.skill` files are consumed by the opencode Skills runtime. The skill system extracts the ZIP, exposes its base directory path to the agent at load time, and the agent uses `$SKILL_DIR` to resolve all bundled asset and script paths.
- `install-skills.sh` installs skills to `~/.config/opencode/skills/` and configures per-agent skill permissions in `~/.config/opencode/opencode.json`.
- No Docker, CI, or cloud infrastructure files exist.
- Three files are **untracked** (not committed to git): `build-deck.js`, `ai-setup-numa.pptx`, `Working version with template.pptx`.
- Several files are **modified but not committed**: `ARCHITECTURE.md`, `pptx-numa/pptx-numa.skill`, `pptx-numa/pptx-numa/SKILL.md`, `pptx-numa/pptx-numa/pptxgenjs.md`, `pptx-numa/pptx-numa/visual-elements.md`.
- The `misc/coding-team/numa-pptx-template-first/` directory is untracked — it contains task specs for recent refactoring work.
- `.git/opencode` exists and contains the HEAD commit SHA (opencode internal metadata).

---

## Conventions

### Formatting and Linting

- **No linter or formatter is configured** (no `ruff`, `black`, `flake8`, `.pre-commit-config.yaml`, or `eslint`). The `.ruff_cache/` directory exists but there is no `ruff` config — it was likely run manually at some point.
- Code style is consistent with PEP 8 conventions (observed in scripts), but this is un-enforced.

### Type Checking

- **No type-checker configured** (no `mypy`, `pyright`, or `pyrightconfig.json`).
- Scripts use modern Python type annotation syntax (`tuple[str, str | None]`, `list[dict]`) as documentation, not enforced.

### Testing

- **No test suite exists** — no `tests/` directory, no `pytest`, `unittest`, or any test runner configuration.

### Documentation

- Documentation lives inside the skill bundle as Markdown files:
  - `SKILL.md` — master reference (~594 lines): brand palette, visual elements, workflow, QA procedures
  - `editing.md` — XML editing workflow (212 lines)
  - `pptxgenjs.md` — pptxgenjs API reference and pitfalls (440 lines)
  - `template-layouts.md` — catalog of 36 slide layouts (63 lines)
  - `visual-elements.md` — 16 visual patterns with code examples (221 lines)
- `misc/coding-team/` contains task/change notes in Markdown (not runnable):
  - `carousel-skill/001-add-carousel-and-agent-tools.md` — task spec for adding two skills
  - `skill-installer/001-install-skills-script.md` — original task spec for `install-skills.sh`
  - `caveman-opencode/001-003-*.md` — 3 task specs for the local caveman skill + command
  - `numa-pptx-template-first/001-006-*.md` — 6 task specs for the template-first refactor (untracked)
- `LICENSE.txt` — Anthropic proprietary license; redistribution and derivative works prohibited.

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

To run `build-deck.js` (the example deck builder at repo root):

```bash
node build-deck.js
# Writes to: /home/ask/sync/projects/dev/numa-ai-pres/ai-setup-numa.pptx
# Requires: npm install pptxgenjs (in working dir)
# Requires: icons/ directory with PNG files (brain.png, hammer.png, team.png, connector.png, sewing.png)
```

---

## Project Structure Hotspots

```
opencode-skills-config/
├── build-deck.js                ← UNTRACKED — 474-line pptxgenjs script; generates ai-setup-numa.pptx
├── ai-setup-numa.pptx           ← UNTRACKED — output of build-deck.js (403 KB)
├── "Working version with template.pptx"  ← UNTRACKED — reference/working copy (4.3 MB)
├── install-skills.sh            ← PRIMARY ENTRY POINT — skill installer: fetches from 7 GitHub repos + installs 2 local skills
├── ARCHITECTURE.md              ← This file
├── caveman/
│   └── SKILL.md                 ← Local caveman skill (ultra-compressed comms, 3 intensity levels)
├── commands/
│   └── caveman.md               ← Custom /caveman command for opencode TUI
├── pptx-numa/
│   ├── pptx-numa.skill          ← Distributable ZIP bundle (binary, committed to git, 62 entries)
│   └── pptx-numa/               ← Skill source tree (what gets zipped)
│       ├── SKILL.md             ← MASTER REFERENCE — brand rules, full workflow, QA (~594 lines)
│       ├── editing.md           ← XML editing workflow for template-based decks (212 lines)
│       ├── pptxgenjs.md         ← pptxgenjs API reference + common pitfalls (440 lines)
│       ├── template-layouts.md  ← Catalog of 36 slide layouts (63 lines)
│       ├── visual-elements.md   ← 16 visual patterns with code examples (221 lines)
│       ├── assets/
│       │   └── agenda.pptx      ← Branded Numa Collective template (6 slides, 36 layouts)
│       ├── scripts/
│       │   ├── add_slide.py     ← Duplicate or create slides in unpacked PPTX dirs
│       │   ├── clean.py         ← Remove orphaned XML/media from unpacked dirs
│       │   ├── thumbnail.py     ← Generate slide thumbnail grids for analysis
│       │   └── office/          ← Low-level OOXML ZIP manipulation library
│       │       ├── unpack.py    ← Extract + pretty-print PPTX/DOCX/XLSX as XML
│       │       ├── pack.py      ← Repack XML dir → validated .pptx/.docx/.xlsx
│       │       ├── soffice.py   ← LibreOffice wrapper (AF_UNIX shim for sandboxed envs)
│       │       ├── validate.py  ← CLI: OOXML schema validation + auto-repair
│       │       ├── validators/  ← pptx.py, docx.py, base.py, redlining.py
│       │       ├── helpers/     ← merge_runs.py, simplify_redlines.py
│       │       └── schemas/     ← ISO-IEC29500-4_2016, ECMA, MCE, Microsoft XSDs
│       └── LICENSE.txt          ← Anthropic proprietary license
├── pptx-numa.skill              ← Second copy of the ZIP bundle at repo root (identical to pptx-numa/pptx-numa.skill)
└── misc/
    └── coding-team/
        ├── carousel-skill/      ← Task spec: add social-media-carousel + agent-tools
        ├── skill-installer/     ← Task spec: original install-skills.sh design
        ├── caveman-opencode/    ← 3 task specs: local caveman skill + /caveman command
        └── numa-pptx-template-first/  ← 6 task specs for template-first refactor (UNTRACKED)
```

**Key boundaries:**

| Boundary | Role |
|---|---|
| `scripts/office/` | Low-level OOXML ZIP manipulation; stable utility library; do not break unpack/pack/validate API |
| `scripts/` (top-level of skill) | Higher-level workflow scripts that call `office/` |
| `assets/` | Binary template file; only modify via unpack → edit → pack cycle |
| `SKILL.md` | Agent's primary instruction document; changes here affect all generated decks |
| `caveman/SKILL.md` | Local caveman skill; installed to `~/.config/opencode/skills/caveman/` |
| `commands/caveman.md` | Custom command; installed to `~/.config/opencode/commands/` |
| `build-deck.js` | Standalone deck builder at repo root; not part of the skill bundle; writes output outside this repo |

---

## How This Project Works

This repo is a **configuration and skill management system for the opencode AI coding tool**. It has three main purposes:

### 1. Skill Installer (`install-skills.sh`)

A Bash script that:
1. Fetches 16 skills from 7 GitHub repos using git sparse checkout (shallow, blob-filtered)
2. Installs 2 local skills (`pptx-numa`, `caveman`) from the working tree
3. Copies custom commands from `commands/` to `~/.config/opencode/commands/`
4. Patches the `nano-banana-use` skill with a hardcoded Google API key fallback
5. Merges per-agent skill permissions into `~/.config/opencode/opencode.json` using `jq`

**Skills installed and their agents:**

| Skill | Source | Agents with access |
|---|---|---|
| `docx`, `pptx`, `doc-coauthoring`, `pdf`, `xlsx` | anthropics/skills | business-consultant |
| `frontend-design`, `skill-creator` | anthropics/skills | architect, developer |
| `brainstorming` | obra/superpowers | architect, business-brainstorm |
| `linkedin-cli`, `pptx-official`, `professional-proofreader` | sickn33/antigravity-awesome-skills | business-consultant |
| `linkedin-content`, `lead-magnet` | openclaudia/openclaudia-skills | business-consultant, linkedin-support |
| `agent-tools`, `social-media-carousel` | inference-sh/skills | linkedin-support |
| `replit-prompt`, `replit-prd`, `replit-plan` | sergio-bershadsky/ai | architect, developer, code-reviewer, code-reviewerer |
| `nano-banana-use` | cnemri/google-genai-skills | business-consultant, linkedin-support |
| `nano-banana-prompts` | secondsky/claude-skills | business-consultant, linkedin-support |
| `pptx-numa` | **local** (`pptx-numa/pptx-numa/`) | business-consultant |
| `caveman` | **local** (`caveman/`) | business-consultant, architect, developer, code-reviewer, code-reviewerer |

**Custom commands installed:**

| Command | Source | Purpose |
|---|---|---|
| `/caveman` | `commands/caveman.md` | Activate/deactivate caveman mode (lite/full/ultra) |

### 2. The `pptx-numa` Skill

A branded PowerPoint skill for the **Numa Collective** consultancy. It teaches an AI agent to create `.pptx` presentations using:

**Primary path (default):** Template-first XML editing
1. Copy `assets/agenda.pptx` (6 slides, 36 layouts, embedded Georgia/Play fonts)
2. Unpack with `unpack.py` (extracts ZIP, pretty-prints XML, escapes smart quotes)
3. Create slides from layouts with `add_slide.py`
4. Edit slide XML directly
5. Clean with `clean.py` (removes orphaned slides/media)
6. Repack with `pack.py` (validates against OOXML XSD schemas, auto-repairs)

**Secondary path (complex visuals only):** pptxgenjs → pptx-automizer import
- Generate complex multi-shape slides programmatically with pptxgenjs
- Import into the template deck with pptx-automizer (preserves embedded fonts/theme)
- Never output a standalone pptxgenjs deck

**QA path:** LibreOffice → pdftoppm → visual inspection by subagents

### 3. The `caveman` Skill + `/caveman` Command

A local skill at `caveman/SKILL.md` that activates ultra-compressed communication mode (~75% token reduction). Three intensity levels: `lite`, `full` (default), `ultra`. Triggered by:
- The `/caveman` custom command (with optional `lite`/`full`/`ultra`/`stop` argument)
- Natural language: "caveman mode", "talk like caveman", "less tokens", "be brief"
- Explicit `skill(name: "caveman")` call

The skill was originally fetched from `JuliusBrussee/caveman` on GitHub but was replaced with a local version adapted for opencode (removed slash-command references, adapted trigger mechanism). See `misc/coding-team/caveman-opencode/` for the task specs.

---

## Do and Don't Patterns

### Do

- **Use `$SKILL_DIR` prefix for all skill-relative paths.** The opencode runtime injects the base directory path at load time; all scripts and assets must be addressed as `$SKILL_DIR/scripts/...` and `$SKILL_DIR/assets/...`. — `SKILL.md:11-22`

- **Use `defusedxml.minidom` for all XML parsing**, not `xml.etree.ElementTree` (which corrupts OOXML namespaces). — `editing.md:212`, `clean.py:21`, `unpack.py:21`

- **Always fresh option objects per pptxgenjs call.** PptxGenJS mutates option objects in-place (converts shadow values to EMU units), so sharing one object across multiple `addShape()` calls corrupts the second shape. Use a factory function: `const makeShadow = () => ({ ... })`. — `pptxgenjs.md:401-410`, `build-deck.js:11`

- **Use `LAYOUT_WIDE` (13.33" × 7.50") in pptxgenjs**, never `LAYOUT_16x9` (10" × 5.625"). The Numa template uses widescreen; mixing layouts leaves the bottom-right empty on combined slides. — `SKILL.md:107-113`, `build-deck.js:30`

- **Run `clean.py` after any slide deletion or structural change** before repacking. — `editing.md:47`, `clean.py` docstring

- **Use subagents for parallel slide XML editing** — each slide is a separate XML file, so parallel editing is safe and recommended. — `editing.md:122`

- **Visual QA with subagents** — always convert to images and inspect; first renders are presumed to have issues. — `SKILL.md:522-566`

- **Use `add_slide.py` to duplicate or create slides** — it handles `Content_Types.xml`, relationship IDs, and notes references automatically. — `editing.md:116`, `add_slide.py`

- **Use `pack.py --original` for validation** — the packer runs `PPTXSchemaValidator` against the original file and auto-repairs common issues before writing the output. — `pack.py:41-50`

- **Use thin filled `RECTANGLE` shapes for lines**, not `LINE` shapes — LINE shapes render inconsistently across PowerPoint versions. — `pptxgenjs.md:412-419`, `build-deck.js:14-15`

- **In `install-skills.sh`, use `jq` deep-merge** to update `opencode.json` — preserves existing agent keys (`model`, `description`) while only overwriting `permission.skill`. — `install-skills.sh:279-404`

### Don't

- **Don't use `#` prefix on hex color strings in pptxgenjs** — causes file corruption. Use bare hex: `"FF0000"` not `"#FF0000"`. — `pptxgenjs.md:381-385`, `build-deck.js:5-9` (all colors are bare hex)

- **Don't encode opacity in 8-char hex color strings** (e.g., `"00000020"`) — use the `opacity` property instead. — `pptxgenjs.md:387-391`

- **Don't use unicode bullet characters (`•`)** in pptxgenjs — produces double bullets. Use `bullet: true` option. — `pptxgenjs.md:393`

- **Don't use `ROUNDED_RECTANGLE` with rectangular accent overlay bars** — the bar won't cover rounded corners; use `RECTANGLE` for the card shape instead. — `pptxgenjs.md:421-430`

- **Don't manually copy slide XML files** — use `add_slide.py` which handles `Content_Types.xml`, relationship IDs, and notes references. — `editing.md:116`

- **Don't mix circles and squares on the same slide**, and don't use multiple fill colors for numbered shapes within a single slide. — `SKILL.md:292-294`

- **Don't put geometric line overlays on light/cream slides** — they belong exclusively on dark navy (`0E2841`) slides. — `SKILL.md:477`

- **Don't use colors outside the Numa Collective palette** — no generic blue, no pure white backgrounds; cream `F3F0EB` replaces white. — `SKILL.md:358`

- **Don't use negative shadow `offset` values in pptxgenjs** — use `angle: 270` with a positive offset for upward shadows instead. — `pptxgenjs.md:143`

- **Don't use `xml.etree.ElementTree`** — use `defusedxml.minidom`. — `editing.md:212`

- **Don't use `LAYOUT_16x9`** — always `LAYOUT_WIDE`. — `SKILL.md:483`, `build-deck.js:30`

- **Don't use font sizes below 12pt** — 12pt is the absolute floor (captions/footnotes only). — `SKILL.md:485`

- **Don't output a standalone pptxgenjs deck** — pptxgenjs output must always be imported into the template deck via pptx-automizer. — `SKILL.md:103`

- **Don't drop caveman mode for code/commits/PRs** — those are written normally regardless of caveman intensity. — `caveman/SKILL.md:54`

---

## Numa Collective Brand Quick Reference

| Role | Hex | Name |
|---|---|---|
| Primary dark | `0E2841` | Deep Navy |
| Primary light (bg) | `F3F0EB` | Warm Cream |
| Accent 1 | `009B81` | Teal Green |
| Accent 2 | `8FA1FF` | Periwinkle Blue |
| Accent 3 | `FF562C` | Vibrant Orange-Red |
| Accent 4 | `C0A883` | Tan Gold |
| Accent 5 | `943C31` | Burgundy |
| Accent 6 | `C6C6D0` | Light Gray |
| Supporting | `FBAE40` | Golden Amber |
| Supporting | `F26B43` | Softer Orange |
| Black | `000000` | Body text |
| White | `FFFFFF` | Text on dark |

**Slide size:** Always `LAYOUT_WIDE` = 13.33" × 7.50"  
**Fonts:** Georgia (titles, 34pt fixed) / Play (body, 14-16pt) — embedded in template  
**Title slide bg:** `943C31` (burgundy) | **Content slide bg:** `F3F0EB` (cream) | **Dark slide bg:** `0E2841` (navy)

---

## Open Questions

1. **Two `.skill` ZIP files** — `pptx-numa/pptx-numa.skill` and `pptx-numa.skill` (at repo root) both contain 62 entries and appear identical. Which one is the canonical distribution artifact? The installer uses the working tree directly (`install_local_skill "pptx-numa/pptx-numa" "pptx-numa"`), not either ZIP.

2. **`pptx-numa.skill` ZIP vs. working tree** — The `.skill` ZIPs are committed to git but there is no automated step to rebuild them after changes. The working tree has uncommitted modifications to `SKILL.md`, `pptxgenjs.md`, and `visual-elements.md` that are not yet reflected in the committed ZIPs. How is the ZIP rebuilt and kept current?

3. **`build-deck.js` output path is hardcoded** — Line 469 writes to `/home/ask/sync/projects/dev/numa-ai-pres/ai-setup-numa.pptx`. This path is machine-specific and the `icons/` directory it references is not present in this repo. The script is not portable as-is.

4. **No dependency manifest** — There is no `requirements.txt`, `pyproject.toml`, or lockfile. Installing the Python dependencies (`defusedxml`, `Pillow`, `markitdown`, `lxml`) requires following the inline instructions in `SKILL.md`. Adding a `requirements.txt` would disambiguate the exact versions expected.

5. **Hardcoded Google API key** — `install-skills.sh` lines 215-245 patch the `nano-banana-use` skill with a hardcoded API key (`AIzaSyBKQa02b8U6dJCj8IEbAfSSmyyMucUibkw`). This key is committed in plaintext in the installer script.

6. **`misc/coding-team/numa-pptx-template-first/` is untracked** — These 6 task spec files document the recent template-first refactor but are not committed. Intentional or oversight?

7. **`social-media-carousel` repo changed** — The task spec in `carousel-skill/001-add-carousel-and-agent-tools.md` references `skill-zero/s` as the source repo, but the actual `install-skills.sh` (after a fix commit `d6001ca`) uses `inference-sh/skills` at path `guides/social/social-media-carousel`. The task spec is now stale/incorrect.
