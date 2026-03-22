# Task: install-skills.sh

## Context

OpenCode discovers skills at `~/.config/opencode/skills/<name>/SKILL.md`. Agent-level skill permissions are configured in `~/.config/opencode/opencode.json` under `agent.<name>.permission.skill`. The existing `opencode.json` already has provider config, global permissions, and model settings that must be preserved.

This repo is at `/home/ask/sync/projects/dev/opencode-skills-config`. It contains a local skill at `pptx-numa/pptx-numa/` (the inner directory is the skill content).

## Objective

Create `install-skills.sh` at the repo root. When run, it:

1. Fetches 12 skills into `~/.config/opencode/skills/<name>/` (full directory contents, not just SKILL.md)
2. Merges skill permission config into `~/.config/opencode/opencode.json`

## Skill sources

### From `https://github.com/anthropics/skills` (branch: `main`, path: `skills/<name>`)
- docx
- pptx
- doc-coauthoring
- pdf
- skill-creator
- xlsx
- frontend-design

### From `https://github.com/obra/superpowers` (branch: `main`, path: `skills/brainstorming`)
- brainstorming

### From `https://github.com/sickn33/antigravity-awesome-skills` (branch: `main`, path: `skills/<name>`)
- linkedin-cli
- pptx-official
- professional-proofreader

### Local (this repo)
- pptx-numa — source is `pptx-numa/pptx-numa/` relative to repo root

## Fetching approach

Use git sparse checkout into a temp directory per repo, copy the needed skill directories out, then clean up. This avoids cloning entire large repos. Fallback: if sparse checkout is unavailable, a shallow clone with --filter=blob:none and sparse-checkout is fine. The script needs `git` as a dependency.

## Config merge

The script must read the existing `~/.config/opencode/opencode.json`, merge in the following, and write it back — preserving all other keys.

Use `jq` for the JSON merge (require it as a dependency; error early if not found).

### What to merge

Into `permission`:
```json
"skill": { "*": "deny" }
```

Into `agent` (create the key if absent; merge into existing agent objects if they already exist — do NOT overwrite other agent keys like `model` or `description`):

```json
{
  "business-consultant": {
    "permission": {
      "skill": {
        "docx": "allow",
        "pptx": "allow",
        "doc-coauthoring": "allow",
        "pdf": "allow",
        "xlsx": "allow",
        "pptx-numa": "allow",
        "linkedin-cli": "allow",
        "pptx-official": "allow",
        "professional-proofreader": "allow"
      }
    }
  },
  "architect": {
    "permission": {
      "skill": {
        "frontend-design": "allow",
        "skill-creator": "allow",
        "brainstorming": "allow"
      }
    }
  },
  "developer": {
    "permission": {
      "skill": {
        "frontend-design": "allow",
        "skill-creator": "allow"
      }
    }
  },
  "business-brainstorm": {
    "permission": {
      "skill": {
        "brainstorming": "allow"
      }
    }
  }
}
```

The `jq` merge must be a deep merge — e.g. if `agent.business-consultant` already exists with a `model` key, that key survives. Only `permission.skill` is set/overwritten.

## Non-goals
- Do not modify any agent markdown files in `~/.config/opencode/agents/`
- Do not modify skill content
- No tests, no package manager, no build system

## Constraints
- Script must be idempotent (safe to re-run)
- Must error early if `git` or `jq` are not installed
- Use `set -euo pipefail`
- Clean up temp directories on exit (trap)
- Print clear progress messages (which skill is being fetched, config update status)
- The script determines its own repo root via the script's location (don't assume CWD)
