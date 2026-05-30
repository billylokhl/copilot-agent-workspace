# Sync Docs and Tests

## Purpose
Prevents architectural drift by enforcing synchronous updates across application files.

## When to Use
Pre-commit checks or whenever functional entry points or public API code layers are modified.

## Procedure

1. Inspect public classes or functions modified in the current diff context.
2. Validate that corresponding docstrings, the repository `README.md`, and any accompanying test files reflect the behavior changes exactly.
3. Assert that zero undocumented public API methods or functions exist in the updated files.

## Success Criteria
All test blocks pass cleanly with zero functional variations or missing system documentation strings.
