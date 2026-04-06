# Task: Create /caveman custom command for opencode

## Context
OpenCode supports custom commands via markdown files. When the user types `/caveman` in the TUI, the command's template is sent as a prompt. Commands support `$ARGUMENTS` for parameters.

The caveman skill (SKILL.md) contains the full rules. The command's job is to tell the LLM to load the skill and activate the requested mode.

## Objective
Create `commands/caveman.md` in the repo root. This will be installed to `~/.config/opencode/commands/caveman.md` by the install script.

## Scope
Create a single file: `commands/caveman.md`

The command should:
1. Have frontmatter with a `description` field
2. Use `$ARGUMENTS` to accept: `lite`, `full`, `ultra`, `stop` (or empty = default to full)
3. The template prompt should instruct the LLM to:
   - Load the caveman skill via the skill tool
   - Activate the requested intensity level (defaulting to `full` if no argument)
   - If argument is `stop`, deactivate caveman mode and revert to normal
4. Keep the template concise — the skill has all the rules, the command just triggers it

## Non-goals
- Don't duplicate the skill rules in the command template
- Don't set an `agent` or `model` override — use whatever the user's current agent/model is
