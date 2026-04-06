# Task: Install 4 ask-linkedin-* local skills

## Context

`install-skills.sh` already installs local skills (`caveman`, `pptx-numa`) via the `install_local_skill` helper and grants them to agents via a jq deep-merge into `opencode.json`. Four new local skill folders now exist at the repo root:

- `ask-linkedin-audit/`
- `ask-linkedin-calendar/`
- `ask-linkedin-post/`
- `ask-linkedin-profile/`

Each has a `SKILL.md` with proper frontmatter and some have `references/` with additional files.

## Objective

Update `install-skills.sh` so these 4 skills are installed and available to the `linkedin-support` agent.

## Scope

**File:** `install-skills.sh` — two changes:

1. **Add 4 `install_local_skill` calls** — after the existing local skill installs (lines ~250-255). Each skill's source path equals its folder name (no nesting like pptx-numa). Example: `install_local_skill "ask-linkedin-audit" "ask-linkedin-audit"`.

2. **Add 4 permission entries to the `linkedin-support` agent** in the jq block (~line 355-370). Add:
   - `"ask-linkedin-audit": "allow"`
   - `"ask-linkedin-calendar": "allow"`
   - `"ask-linkedin-post": "allow"`
   - `"ask-linkedin-profile": "allow"`

## Non-goals

- Do NOT change any other agent's permissions
- Do NOT modify skill content
- Do NOT restructure the script

## Constraints

- Follow the exact existing patterns for both the install calls and the jq block
- Keep the skills grouped together with a comment block like the existing ones
