---
name: workspace-context-hygiene
description: 'Keep model context lean by excluding heavy runtime folders from indexing (.venv, node_modules, etc)'
---

# Workspace Context Hygiene

## Purpose
Preserves local machine processing cycles and unified memory bandwidth by keeping active model index trees lean.

## When to Use
Triggered on project workspace bootstrap, tool generation, or whenever local virtual environment architectures are updated.

## Procedure

1. Create or audit the local project workspace `.copilotignore` file.
2. Explicitly inject heavy transient or local runtime folder patterns into the ignore registry: `.venv/`, `node_modules/`, `build/`, `dist/`, `__pycache__/`, and `*.log`.
3. Synchronize local editor configurations by modifying regional `.vscode/settings.json` file exclusion arrays to stop background indexing threads from scanning heavy directory assets.
4. If build artifacts or environment files are already tracked in git, remove them from the index using the git tracking hygiene skill.

For removing accidentally tracked files from git, see:

1. `.github/skills/git-tracking-hygiene/SKILL.md`

## Success Criteria
Context windows are kept perfectly lean, tracking only core source application logic files.
