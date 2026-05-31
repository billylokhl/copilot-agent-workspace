---
name: project-bootstrap-baseline
description: 'Standardized pristine layout configuration for initializing new code repositories'
---

# Project Bootstrap Baseline

## Purpose
Establishes a standardized, pristine layout configuration when initializing brand-new code repositories.

## When to Use
Triggered immediately upon the initialization of any fresh project repository workspace.

## Procedure

1. Create the core workspace layout files explicitly: `README.md`, `pyproject.toml`, `.gitignore`, `CONTRIBUTING.md`, and a foundational testing directory `tests/conftest.py`.
2. Generate the native configuration directory structures `.github/skills/` and `.github/instructions/`.
3. Configure context isolation immediately (see workspace context hygiene skill).
4. Conclude the initialization process by running a local git init sequence and staging a baseline structural commit using a non-interactive heredoc block (see git commit workflow skill).

For context isolation setup, see:

1. `.github/skills/workspace-context-hygiene/SKILL.md`

For proper git initialization and first commit, see:

1. `.github/skills/git-commit-workflow/SKILL.md`

## Success Criteria
The repository possesses all baseline architectural files, and is cleanly tracked under a pristine initial Git state.
