#!/usr/bin/env bash
# install-skills.sh — Fetch skills into ~/.config/opencode/skills/ and update opencode.json
set -euo pipefail

# ---------------------------------------------------------------------------
# Resolve script and repo locations
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"

SKILLS_DIR="$HOME/.config/opencode/skills"
OPENCODE_CONFIG="$HOME/.config/opencode/opencode.json"

# ---------------------------------------------------------------------------
# Dependency checks
# ---------------------------------------------------------------------------
for dep in git jq; do
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
# Ensure skills directory and config file exist
# ---------------------------------------------------------------------------
mkdir -p "$SKILLS_DIR"
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
# Fetch skill from https://github.com/obra/superpowers
# ---------------------------------------------------------------------------
fetch_skill_dir \
  "https://github.com/obra/superpowers" \
  "main" \
  "skills/brainstorming" \
  "brainstorming"

# ---------------------------------------------------------------------------
# Fetch skills from https://github.com/sickn33/antigravity-awesome-skills
# ---------------------------------------------------------------------------
ANTIGRAVITY_REPO="https://github.com/sickn33/antigravity-awesome-skills"
ANTIGRAVITY_BRANCH="main"

for skill in linkedin-cli pptx-official professional-proofreader; do
  fetch_skill_dir "$ANTIGRAVITY_REPO" "$ANTIGRAVITY_BRANCH" "skills/$skill" "$skill"
done

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
# Install local skill: pptx-numa
# ---------------------------------------------------------------------------
install_local_skill "pptx-numa/pptx-numa" "pptx-numa"

# ---------------------------------------------------------------------------
# Merge permission config into opencode.json
# ---------------------------------------------------------------------------
echo ""
echo "→ Merging skill permissions into $OPENCODE_CONFIG ..."

# Build the jq expression for a deep merge that:
#   1. Sets permission.skill to { "*": "deny" }
#   2. Deep-merges each agent entry (preserving existing keys like model/description)
#      by only overwriting permission.skill for each agent
jq '
  # Deep-merge skill permission settings
  . * {
    "permission": (
      (.permission // {}) * { "skill": { "*": "deny" } }
    ),
    "agent": (
      (.agent // {}) |
      . * {
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
                  "lead-magnet": "allow"
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
                  "replit-plan": "allow"
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
                  "replit-plan": "allow"
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
                  "agent-tools": "allow"
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
                  "replit-plan": "allow"
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
                  "replit-plan": "allow"
                }
              }
            )
          }
        )
      }
    )
  }
' "$OPENCODE_CONFIG" > "${OPENCODE_CONFIG}.tmp"

mv "${OPENCODE_CONFIG}.tmp" "$OPENCODE_CONFIG"
echo "  ✓ opencode.json updated"

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "✓ All skills installed and config updated."
echo "  Skills directory : $SKILLS_DIR"
echo "  Config file      : $OPENCODE_CONFIG"
