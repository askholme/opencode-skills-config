# Task: Create local caveman skill for opencode

## Context
We're replacing the externally-fetched caveman skill (from JuliusBrussee/caveman) with our own version adapted for opencode. The original skill references `/caveman` slash commands which don't exist in opencode's skill system. In opencode, skills are loaded via the `skill` tool based on description matching or explicit `skill(name: "caveman")` calls.

## Objective
Create `caveman/SKILL.md` in the repo root (alongside `pptx-numa/`). This will be installed to `~/.config/opencode/skills/caveman/SKILL.md` by the install script.

## Scope
- Create directory: `caveman/SKILL.md`
- Base content on the original (see `~/.config/opencode/skills/caveman/SKILL.md` for current version)

## Changes from original
1. **Drop all `/caveman` references** — replace with: "Activated via `/caveman` command or natural language (e.g. 'caveman mode', 'be brief', 'less tokens')"
2. **Drop `/caveman lite|full|ultra` syntax** — replace with: "Switch level: say 'caveman lite', 'caveman full', or 'caveman ultra'"
3. **Keep everything else intact** — the rules, intensity table, examples, auto-clarity section, and boundaries are all well-written
4. In the `description` frontmatter field, keep the natural language triggers but remove the `/caveman` invocation reference — the description is what opencode uses for auto-detection

## Non-goals
- Don't change the actual caveman behavior/rules
- Don't add opencode-specific features beyond fixing the trigger mechanism
