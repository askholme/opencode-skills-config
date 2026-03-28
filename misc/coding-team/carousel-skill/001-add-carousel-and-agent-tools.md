# Task: Add social-media-carousel and agent-tools skills to install-skills.sh

## Context

`install-skills.sh` at repo root fetches skills via `fetch_skill_dir` and merges agent permissions via a `jq` expression. The `linkedin-support` agent already has permissions for `pptx`, `pdf`, `linkedin-content`, `lead-magnet`.

## Objective

Add two new skills to the fetch list and grant them to the `linkedin-support` agent.

## Scope

Only file changed: `install-skills.sh`

### 1. Add fetch for `agent-tools`

New section after the openclaudia block (around line 161). Use:
- Repo: `https://github.com/inference-sh/skills`
- Branch: `main`
- Path: `skills/agent-tools`
- Skill name: `agent-tools`

### 2. Add fetch for `social-media-carousel`

New section right after agent-tools. Use:
- Repo: `https://github.com/skill-zero/s`
- Branch: `main`
- Path: `skills/social-media-carousel`
- Skill name: `social-media-carousel`

### 3. Update linkedin-support jq permissions

In the jq merge block, add `"social-media-carousel": "allow"` and `"agent-tools": "allow"` to the `linkedin-support` agent's `permission.skill` object (alongside the existing four entries).

## Non-goals

- Do not change any other agent's permissions
- Do not add new agent blocks
- Do not modify skill content or any other files

## Constraints

- Follow existing code style and patterns exactly (comment banners, spacing, quoting)
- The comment for the `install-skills.sh` header at line 2 says 12 skills — update that count to 14 if it appears in a comment (check; it doesn't appear to be in a comment, so likely nothing to update)
