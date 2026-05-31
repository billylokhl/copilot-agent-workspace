---
name: python-env-selection
description: 'Detect and activate the correct Python virtual environment for the workspace'
---

# Python Environment Selection

## Purpose
Forces isolation of project runtimes to prevent pollution of system-level Python interpreter spaces.

## When to Use
Triggered automatically whenever executing, testing, linting, or configuring Python code dependencies.

## Procedure

1. Always check for a project-local virtual environment folder (`.venv`) inside the workspace root before running any execution commands.
2. Explicitly invoke Python tools via module syntax (`python -m pytest`, `python -m black`) instead of executing raw global binaries.
3. In multi-directory or monorepo workspaces, always target and activate the specific `.venv` localized closest to the module's target `pyproject.toml` configuration file. Never silently fall back to system Python.

## Success Criteria
All scripts and tools run explicitly isolated within the project-scoped virtual environment.
