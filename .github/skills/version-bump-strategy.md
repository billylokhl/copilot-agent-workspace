# Semantic Versioning Strategy

## Purpose
Enforces rigid Semantic Versioning (SemVer) evaluation paths for updating codebase milestones.

## When to Use
Triggered when preparing releases, altering public APIs, extracting packages, or updating the project CHANGELOG.md.

## Procedure

1. Apply changes to the workspace version state strictly according to the SemVer tree:
   - `PATCH`: Backwards-compatible operational bug fixes, optimizations, or minor patches.
   - `MINOR`: New, backwards-compatible functional extensions or public interface methods.
   - `MAJOR`: Breaking architectural updates, API deletions, or backward-incompatible signatures.
2. If separating code out into a standalone internal module package, initialize its baseline version state strictly at `0.1.0`.
3. Update version strings synchronously inside both `pyproject.toml` and the master `CHANGELOG.md`.

## Success Criteria
Version bumps precisely reflect code mutation scopes, keeping configurations and changelogs perfectly mirrored.
