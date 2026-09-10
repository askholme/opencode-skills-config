#!/usr/bin/env bash
# install-skills.sh — Fetch skills into ~/.config/opencode/skills/ and update opencode.json
set -euo pipefail

# ---------------------------------------------------------------------------
# Resolve script and repo locations
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"

SKILLS_DIR="$HOME/.config/opencode/skills"
COMMANDS_DIR="$HOME/.config/opencode/commands"
INSTRUCTIONS_DIR="$HOME/.config/opencode/instructions"
OPENCODE_CONFIG="$HOME/.config/opencode/opencode.json"
SUPERPOWERS_PLUGIN="superpowers@git+https://github.com/obra/superpowers.git"
SUPERPOWERS_WORKERS_INSTRUCTION="$INSTRUCTIONS_DIR/superpowers-workers.md"

# ---------------------------------------------------------------------------
# Dependency checks
# ---------------------------------------------------------------------------
for dep in git jq python3; do
  if ! command -v "$dep" &>/dev/null; then
    echo "ERROR: '$dep' is required but not found in PATH. Please install it and re-run." >&2
    exit 1
  fi
done

# ---------------------------------------------------------------------------
# Temp-dir cleanup trap
# ---------------------------------------------------------------------------
TMPDIR_ROOT=""
cleanup() {
  if [[ -n "$TMPDIR_ROOT" && -d "$TMPDIR_ROOT" ]]; then
    rm -rf "$TMPDIR_ROOT"
  fi
}
trap cleanup EXIT

# ---------------------------------------------------------------------------
# Helper: sparse-checkout a single directory from a remote repo
#   fetch_skill_dir <repo_url> <branch> <repo_subpath> <skill_name>
# ---------------------------------------------------------------------------
fetch_skill_dir() {
  local repo_url="$1"
  local branch="$2"
  local repo_subpath="$3"  # path inside the repo, e.g. "skills/docx"
  local skill_name="$4"

  local dest="$SKILLS_DIR/$skill_name"
  echo "→ Fetching skill '$skill_name' from $repo_url ($repo_subpath) ..."

  local work_dir
  work_dir="$(mktemp -d "$TMPDIR_ROOT/sparse-XXXXXX")"

  git -C "$work_dir" init -q
  git -C "$work_dir" remote add origin "$repo_url"

  # Enable sparse checkout
  git -C "$work_dir" config core.sparseCheckout true
  mkdir -p "$work_dir/.git/info"
  echo "$repo_subpath/**" > "$work_dir/.git/info/sparse-checkout"

  # Shallow fetch with blob filter where supported; fall back to plain shallow
  if git -C "$work_dir" fetch --depth=1 --filter=blob:none origin "$branch" 2>/dev/null; then
    git -C "$work_dir" checkout FETCH_HEAD -q 2>/dev/null || true
  else
    echo "  (filter=blob:none unavailable, falling back to shallow fetch)"
    git -C "$work_dir" fetch --depth=1 origin "$branch"
    git -C "$work_dir" checkout FETCH_HEAD -q 2>/dev/null || true
  fi

  local src="$work_dir/$repo_subpath"
  if [[ ! -d "$src" ]]; then
    echo "ERROR: Expected directory '$repo_subpath' not found in repo '$repo_url'." >&2
    exit 1
  fi

  mkdir -p "$dest"
  # rsync-style copy: copy contents of src into dest
  cp -r "$src/." "$dest/"
  echo "  ✓ Installed '$skill_name' → $dest"
}

# ---------------------------------------------------------------------------
# Helper: install local skill directory
#   install_local_skill <src_relative_to_repo_root> <skill_name>
# ---------------------------------------------------------------------------
install_local_skill() {
  local src_rel="$1"
  local skill_name="$2"

  local src="$REPO_ROOT/$src_rel"
  local dest="$SKILLS_DIR/$skill_name"

  echo "→ Installing local skill '$skill_name' from $src ..."

  if [[ ! -d "$src" ]]; then
    echo "ERROR: Local skill source '$src' does not exist." >&2
    exit 1
  fi

  mkdir -p "$dest"
  cp -r "$src/." "$dest/"
  echo "  ✓ Installed '$skill_name' → $dest"
}

# ---------------------------------------------------------------------------
# Helper: normalize OpenCode's JSONC-compatible config to strict JSON for jq
#   normalize_jsonc <file>
# ---------------------------------------------------------------------------
normalize_jsonc() {
  python3 - "$1" <<'PY'
import json
import pathlib
import sys

path = pathlib.Path(sys.argv[1])


def strip_comments(text):
    result = []
    index = 0
    in_string = False
    escaped = False

    while index < len(text):
        char = text[index]

        if in_string:
            result.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            index += 1
            continue

        if char == '"':
            in_string = True
            result.append(char)
            index += 1
        elif char == "/" and index + 1 < len(text) and text[index + 1] == "/":
            index += 2
            while index < len(text) and text[index] not in "\r\n":
                index += 1
        elif char == "/" and index + 1 < len(text) and text[index + 1] == "*":
            index += 2
            while index + 1 < len(text) and text[index:index + 2] != "*/":
                if text[index] in "\r\n":
                    result.append(text[index])
                index += 1
            if index + 1 >= len(text):
                raise ValueError("unterminated block comment")
            index += 2
        else:
            result.append(char)
            index += 1

    return "".join(result)


def strip_trailing_commas(text):
    result = []
    index = 0
    in_string = False
    escaped = False

    while index < len(text):
        char = text[index]

        if in_string:
            result.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            index += 1
            continue

        if char == '"':
            in_string = True
        elif char == ",":
            lookahead = index + 1
            while lookahead < len(text) and text[lookahead].isspace():
                lookahead += 1
            if lookahead < len(text) and text[lookahead] in "}]":
                index += 1
                continue

        result.append(char)
        index += 1

    return "".join(result)


try:
    source = path.read_text()
    parsed = json.loads(strip_trailing_commas(strip_comments(source)))
except (OSError, ValueError, json.JSONDecodeError) as error:
    print(f"ERROR: Could not parse OpenCode config {path}: {error}", file=sys.stderr)
    sys.exit(1)

json.dump(parsed, sys.stdout)
PY
}

# ---------------------------------------------------------------------------
# Ensure skills directory and config file exist
# ---------------------------------------------------------------------------
mkdir -p "$SKILLS_DIR"
mkdir -p "$COMMANDS_DIR"
mkdir -p "$INSTRUCTIONS_DIR"
mkdir -p "$(dirname "$OPENCODE_CONFIG")"

if [[ ! -f "$OPENCODE_CONFIG" ]]; then
  echo "{}" > "$OPENCODE_CONFIG"
  echo "  Created empty $OPENCODE_CONFIG"
fi

# ---------------------------------------------------------------------------
# Set up shared temp root (used by all sparse checkouts)
# ---------------------------------------------------------------------------
TMPDIR_ROOT="$(mktemp -d)"

# ---------------------------------------------------------------------------
# Fetch skills from https://github.com/anthropics/skills
# ---------------------------------------------------------------------------
ANTHROPIC_REPO="https://github.com/anthropics/skills"
ANTHROPIC_BRANCH="main"

for skill in docx pptx doc-coauthoring pdf skill-creator xlsx frontend-design; do
  fetch_skill_dir "$ANTHROPIC_REPO" "$ANTHROPIC_BRANCH" "skills/$skill" "$skill"
done

# ---------------------------------------------------------------------------
# Fetch skills from https://github.com/sickn33/antigravity-awesome-skills
# ---------------------------------------------------------------------------
ANTIGRAVITY_REPO="https://github.com/sickn33/antigravity-awesome-skills"
ANTIGRAVITY_BRANCH="main"

for skill in linkedin-cli pptx-official professional-proofreader; do
  fetch_skill_dir "$ANTIGRAVITY_REPO" "$ANTIGRAVITY_BRANCH" "skills/$skill" "$skill"
done

# ---------------------------------------------------------------------------
# Install build-controller instructions for model-specific Superpowers workers
# ---------------------------------------------------------------------------
echo ""
echo "-> Installing Superpowers worker routing instructions ..."
cp "$REPO_ROOT/instructions/superpowers-workers.md" "$SUPERPOWERS_WORKERS_INSTRUCTION"
echo "  ok Installed $SUPERPOWERS_WORKERS_INSTRUCTION"

if ! compgen -G "$HOME/.config/opencode/agents/superpowers-worker-*.md" > /dev/null; then
  echo "  WARNING: No superpowers-worker-* agents are installed."
  echo "           Install them before starting a Superpowers controller session."
fi

# The old standalone skill has higher priority than plugin-provided skills and
# would shadow the version bundled with the full Superpowers plugin.
if [[ -d "$SKILLS_DIR/brainstorming" ]]; then
  rm -rf "$SKILLS_DIR/brainstorming"
  echo "  ok Removed legacy standalone brainstorming skill"
fi

# ---------------------------------------------------------------------------
# Fetch skill from https://github.com/openclaudia/openclaudia-skills
# ---------------------------------------------------------------------------
fetch_skill_dir \
  "https://github.com/openclaudia/openclaudia-skills" \
  "main" \
  "skills/linkedin-content" \
  "linkedin-content"

fetch_skill_dir \
  "https://github.com/openclaudia/openclaudia-skills" \
  "main" \
  "skills/lead-magnet" \
  "lead-magnet"

# ---------------------------------------------------------------------------
# Fetch skill from https://github.com/inference-sh/skills
# ---------------------------------------------------------------------------
fetch_skill_dir \
  "https://github.com/inference-sh/skills" \
  "main" \
  "tools/agent-tools" \
  "agent-tools"

# ---------------------------------------------------------------------------
# Fetch skill from https://github.com/inference-sh/skills (was skill-zero/s)
# ---------------------------------------------------------------------------
fetch_skill_dir \
  "https://github.com/inference-sh/skills" \
  "main" \
  "guides/social/social-media-carousel" \
  "social-media-carousel"

# ---------------------------------------------------------------------------
# Fetch skills from https://github.com/sergio-bershadsky/ai
# ---------------------------------------------------------------------------
BERSHADSKY_REPO="https://github.com/sergio-bershadsky/ai"
BERSHADSKY_BRANCH="main"

for skill in replit-prompt replit-prd replit-plan; do
  fetch_skill_dir "$BERSHADSKY_REPO" "$BERSHADSKY_BRANCH" "plugins/replit-prompts/skills/$skill" "$skill"
done

# ---------------------------------------------------------------------------
# Fetch skill from https://github.com/cnemri/google-genai-skills
# ---------------------------------------------------------------------------
fetch_skill_dir \
  "https://github.com/cnemri/google-genai-skills" \
  "main" \
  "skills/nano-banana-use" \
  "nano-banana-use"

# ---------------------------------------------------------------------------
# Fetch skill from https://github.com/secondsky/claude-skills
# (nano-banana-prompts — prompt engineering companion for nano-banana-use)
# ---------------------------------------------------------------------------
fetch_skill_dir \
  "https://github.com/secondsky/claude-skills" \
  "main" \
  "plugins/nano-banana-prompts/skills/nano-banana-prompts" \
  "nano-banana-prompts"

# ---------------------------------------------------------------------------
# Hardcode Google API key in nano-banana-use Python scripts
# ---------------------------------------------------------------------------
NANO_BANANA_API_KEY="AIzaSyBKQa02b8U6dJCj8IEbAfSSmyyMucUibkw"
echo ""
echo "→ Hardcoding API key in nano-banana-use scripts ..."
for script in generate_image.py edit_image.py compose_image.py; do
  script_path="$SKILLS_DIR/nano-banana-use/scripts/$script"
  if [[ -f "$script_path" ]]; then
    # Replace the get_client function to use hardcoded API key
    python3 -c "
import re, sys
with open('$script_path', 'r') as f:
    content = f.read()
# Replace the entire get_client function
old_func = re.search(r'def get_client\(\):.*?(?=\ndef |\nif __name__)', content, re.DOTALL)
if old_func:
    new_func = '''def get_client():
    # Hardcoded API key fallback
    HARDCODED_API_KEY = \"$NANO_BANANA_API_KEY\"

    api_key = os.environ.get(\"GOOGLE_API_KEY\") or os.environ.get(\"GEMINI_API_KEY\") or HARDCODED_API_KEY
    return genai.Client(api_key=api_key)

'''
    content = content[:old_func.start()] + new_func + content[old_func.end():]
    with open('$script_path', 'w') as f:
        f.write(content)
    print(f'  ✓ Patched {\"$script\"}')
else:
    print(f'  ⚠ Could not find get_client() in {\"$script\"}', file=sys.stderr)
"
  fi
done

# ---------------------------------------------------------------------------
# Install local skill: pptx-numa
# ---------------------------------------------------------------------------
install_local_skill "pptx-numa/pptx-numa" "pptx-numa"

# ---------------------------------------------------------------------------
# Install local skill: caveman
# ---------------------------------------------------------------------------
install_local_skill "caveman" "caveman"

# ---------------------------------------------------------------------------
# Install local skills: float-deck, float-pdf, and float-slides
# ---------------------------------------------------------------------------
install_local_skill "float-deck" "float-deck"
install_local_skill "float-pdf" "float-pdf"
install_local_skill "float-slides" "float-slides"

# ---------------------------------------------------------------------------
# Set up Playwright/Chromium for float-pdf (required) and float-deck (optional
# screenshot helper). Idempotent: skips npm install when node_modules/playwright
# is already present. Chromium is cached globally under ~/.cache/ms-playwright,
# so the second invocation is a fast no-op.
# ---------------------------------------------------------------------------
setup_playwright_skill() {
  local label="$1"
  local dir="$2"

  if [[ ! -f "$dir/package.json" ]]; then
    echo "  ⚠ Skipping $label setup — no package.json at $dir"
    return 0
  fi

  echo ""
  echo "→ Setting up Playwright for $label ($dir) ..."

  if ! command -v npm &>/dev/null; then
    echo "  ⚠ npm not found — skipping. Install Node.js, then run:"
    echo "      (cd \"$dir\" && npm install && npx playwright install chromium)"
    return 0
  fi

  if [[ -d "$dir/node_modules/playwright" ]]; then
    echo "  ✓ node_modules/playwright already present — skipping npm install"
  else
    if ! (cd "$dir" && npm install --no-audit --no-fund); then
      echo "  ⚠ npm install failed for $label. Re-run manually:"
      echo "      (cd \"$dir\" && npm install && npx playwright install chromium)"
      return 0
    fi
  fi

  if ! (cd "$dir" && npx --yes playwright install chromium); then
    echo "  ⚠ Chromium download failed for $label. Re-run manually:"
    echo "      (cd \"$dir\" && npx playwright install chromium)"
    return 0
  fi

  echo "  ✓ $label Playwright setup complete"
}

setup_playwright_skill "float-pdf"  "$SKILLS_DIR/float-pdf/scripts"
setup_playwright_skill "float-deck" "$SKILLS_DIR/float-deck/assets"

# ---------------------------------------------------------------------------
# Install local LinkedIn sales skills (Nick Broekema methodology)
# ---------------------------------------------------------------------------
install_local_skill "linkedin-outreach-engine" "linkedin-outreach-engine"
install_local_skill "linkedin-sales-sparring"  "linkedin-sales-sparring"
install_local_skill "nick-sales-coaching"     "nick-sales-coaching"

# ---------------------------------------------------------------------------
# Install custom commands
# ---------------------------------------------------------------------------
echo ""
echo "-> Installing custom commands ..."
for cmd_file in "$REPO_ROOT/commands/"*.md; do
  if [[ -f "$cmd_file" ]]; then
    cp "$cmd_file" "$COMMANDS_DIR/"
    echo "  ok Installed command '$(basename "$cmd_file" .md)'"
  fi
done

# ---------------------------------------------------------------------------
# Merge plugin, instruction, and permission config into opencode.json
# ---------------------------------------------------------------------------
echo ""
echo "→ Merging Superpowers and skill configuration into $OPENCODE_CONFIG ..."

# Build the jq expression for an idempotent merge that:
#   1. Adds the Superpowers plugin and worker instruction without duplicates
#   2. Sets permission.skill to { "*": "deny" }
#   3. Deep-merges each agent entry (preserving existing keys like model/description)
#      by only overwriting permission.skill for each agent
if ! normalize_jsonc "$OPENCODE_CONFIG" | jq \
  --arg superpowers_plugin "$SUPERPOWERS_PLUGIN" \
  --arg superpowers_workers_instruction "$SUPERPOWERS_WORKERS_INSTRUCTION" \
  '
  # Deep-merge skill permission settings
  . * {
    "plugin": (
      (.plugin // []) |
      if index($superpowers_plugin) then . else . + [$superpowers_plugin] end
    ),
    "instructions": (
      (.instructions // []) |
      if index($superpowers_workers_instruction) then . else . + [$superpowers_workers_instruction] end
    ),
    "permission": (
      (.permission // {}) * { "skill": { "*": "deny" } }
    ),
    "agent": (
      (.agent // {}) |
      . * {
        "build": (
          (.build // {}) * {
            "permission": (
              ((.build // {}).permission // {}) * {
                "skill": {
                  "brainstorming": "allow",
                  "dispatching-parallel-agents": "allow",
                  "executing-plans": "allow",
                  "finishing-a-development-branch": "allow",
                  "receiving-code-review": "allow",
                  "requesting-code-review": "allow",
                  "subagent-driven-development": "allow",
                  "systematic-debugging": "allow",
                  "test-driven-development": "allow",
                  "using-git-worktrees": "allow",
                  "using-superpowers": "allow",
                  "verification-before-completion": "allow",
                  "writing-plans": "allow",
                  "writing-skills": "allow"
                }
              }
            )
          }
        ),
        "business-consultant": (
          (.["business-consultant"] // {}) * {
            "permission": (
              ((.["business-consultant"] // {}).permission // {}) * {
                "skill": {
                  "docx": "allow",
                  "pptx": "allow",
                  "doc-coauthoring": "allow",
                  "pdf": "allow",
                  "xlsx": "allow",
                  "pptx-numa": "allow",
                  "linkedin-cli": "allow",
                  "pptx-official": "allow",
                  "professional-proofreader": "allow",
                  "lead-magnet": "allow",
                  "nano-banana-use": "allow",
                  "nano-banana-prompts": "allow",
                  "caveman": "allow",
                  "float-deck": "allow",
                  "float-pdf": "allow",
                  "float-slides": "allow"
                }
              }
            )
          }
        ),
        "architect": (
          (.["architect"] // {}) * {
            "permission": (
              ((.["architect"] // {}).permission // {}) * {
                "skill": {
                  "frontend-design": "allow",
                  "skill-creator": "allow",
                  "brainstorming": "allow",
                  "replit-prompt": "allow",
                  "replit-prd": "allow",
                  "replit-plan": "allow",
                  "caveman": "allow"
                }
              }
            )
          }
        ),
        "developer": (
          (.["developer"] // {}) * {
            "permission": (
              ((.["developer"] // {}).permission // {}) * {
                "skill": {
                  "frontend-design": "allow",
                  "skill-creator": "allow",
                  "replit-prompt": "allow",
                  "replit-prd": "allow",
                  "replit-plan": "allow",
                  "caveman": "allow"
                }
              }
            )
          }
        ),
        "business-brainstorm": (
          (.["business-brainstorm"] // {}) * {
            "permission": (
              ((.["business-brainstorm"] // {}).permission // {}) * {
                "skill": {
                  "brainstorming": "allow"
                }
              }
            )
          }
        ),
        "linkedin-support": (
          (."linkedin-support" // {}) * {
            "permission": (
              ((."linkedin-support" // {}).permission // {}) * {
                "skill": {
                  "pptx": "allow",
                  "pdf": "allow",
                  "linkedin-content": "allow",
                  "lead-magnet": "allow",
                  "social-media-carousel": "allow",
                  "agent-tools": "allow",
                  "nano-banana-use": "allow",
                  "nano-banana-prompts": "allow",
                  "linkedin-outreach-engine": "allow",
                  "linkedin-sales-sparring": "allow",
                  "nick-sales-coaching": "allow",
                }
              }
            )
          }
        ),
        "code-reviewer": (
          (.["code-reviewer"] // {}) * {
            "permission": (
              ((.["code-reviewer"] // {}).permission // {}) * {
                "skill": {
                  "replit-prompt": "allow",
                  "replit-prd": "allow",
                  "replit-plan": "allow",
                  "caveman": "allow"
                }
              }
            )
          }
        ),
        "code-reviewerer": (
          (.["code-reviewerer"] // {}) * {
            "permission": (
              ((.["code-reviewerer"] // {}).permission // {}) * {
                "skill": {
                  "replit-prompt": "allow",
                  "replit-prd": "allow",
                  "replit-plan": "allow",
                  "caveman": "allow"
                }
              }
            )
          }
        )
      }
    )
  }
  ' > "${OPENCODE_CONFIG}.tmp"
then
  rm -f "${OPENCODE_CONFIG}.tmp"
  echo "ERROR: Failed to update $OPENCODE_CONFIG; the original file was left unchanged." >&2
  exit 1
fi

mv "${OPENCODE_CONFIG}.tmp" "$OPENCODE_CONFIG"
echo "  ✓ opencode.json updated"

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "✓ All skills installed and config updated."
echo "  Skills directory : $SKILLS_DIR"
echo "  Config file      : $OPENCODE_CONFIG"
