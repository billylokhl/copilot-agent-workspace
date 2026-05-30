# Project Bootstrap Baseline

## Purpose
Establishes a standardized, pristine layout configuration when initializing brand-new code repositories.

## When to Use
Triggered immediately upon the initialization of any fresh project repository workspace.

## Procedure

1. Create the core workspace layout files explicitly: `README.md`, `pyproject.toml`, `.gitignore`, `CONTRIBUTING.md`, and a foundational testing directory `tests/conftest.py`.
2. Generate the native configuration directory structures `.github/skills/` and `.github/instructions/`.
3. Conclude the initialization process by running a local git init sequence and staging a baseline structural commit using a non-interactive heredoc block.

## Success Criteria
The repository possesses all baseline architectural files, and is cleanly tracked under a pristine initial Git state.
