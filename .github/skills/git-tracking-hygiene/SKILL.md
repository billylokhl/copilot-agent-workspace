---
name: git-tracking-hygiene
description: 'Safely remove accidentally tracked build artifacts, secrets, and ignored files from git index'
---

# Git Tracking Hygiene

## Purpose
Identifies and safely removes accidentally tracked build artifacts, local environment variables, or sensitive secrets from the Git index without destroying local files.

## When to Use
Run during workspace initialization, or whenever suspected secret leaks or `.gitignore` violations occur.

## Procedure
1. Run a dry-run check against active index arrays to locate untracked files that bypass `.gitignore`:
   ```bash
   git ls-files -i --exclude-standard
   ```
2. Remove any cached file matching build directories, local virtual environments, or secrets using the cached modifier:
   ```bash
   git rm --cached <file_path>
   ```
3. Immediately append the matching file path or wildcard pattern to the project root `.gitignore` file to prevent re-staging.

## Success Criteria
Targeted files or directories are safely untracked from the remote Git index while remaining intact on local disk storage.
