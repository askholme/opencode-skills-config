# Task: Update install-skills.sh for local caveman + commands

## Context
`install-skills.sh` currently fetches caveman from `https://github.com/JuliusBrussee/caveman` (lines 211-217). We now have a local caveman skill at `caveman/SKILL.md` and a command at `commands/caveman.md` in the repo.

The script already has an `install_local_skill` helper and uses it for `pptx-numa`. It also already creates `~/.config/opencode/commands/` implicitly (it doesn't exist yet but the pattern is clear).

## Objective
Three changes to `install-skills.sh`:

### 1. Replace remote caveman fetch with local install
- **Remove** lines 210-217 (the `fetch_skill_dir` call for JuliusBrussee/caveman)
- **Add** a local install call: `install_local_skill "caveman" "caveman"`
- Place it near the existing `install_local_skill "pptx-numa/pptx-numa" "pptx-numa"` call (around line 257)

### 2. Add command installation
- Add a `COMMANDS_DIR="$HOME/.config/opencode/commands"` variable near the existing `SKILLS_DIR` variable (around line 11)
- Add `mkdir -p "$COMMANDS_DIR"` near the existing `mkdir -p "$SKILLS_DIR"` (around line 106)
- After the skill installations, add a section that copies command files from `$REPO_ROOT/commands/` to `$COMMANDS_DIR/`:
  ```bash
  # Install custom commands
  echo ""
  echo "-> Installing custom commands ..."
  for cmd_file in "$REPO_ROOT/commands/"*.md; do
    if [[ -f "$cmd_file" ]]; then
      cp "$cmd_file" "$COMMANDS_DIR/"
      echo "  ok Installed command '$(basename "$cmd_file" .md)'"
    fi
  done
  ```
- Place this after all skill installations but before the opencode.json merge section

### 3. Remove the old comment block
- Remove the comment header "Fetch skill from https://github.com/JuliusBrussee/caveman" along with the fetch call

## Non-goals
- Don't change the opencode.json jq merge — caveman permissions stay the same
- Don't change any other skill installations
- Don't change the install_local_skill helper function itself
