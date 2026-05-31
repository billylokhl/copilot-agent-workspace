---
name: git-commit-workflow-examples
description: 'Detailed examples for branch splitting, heredoc commits, and disallowed message patterns'
---

# Git Commit Workflow Examples

Detailed examples extracted from `.github/skills/git-commit-workflow/SKILL.md`.

## Branch Purpose Mismatch Examples

Examples that require a new branch:

1. On `ci/fix-docker-build` but adding docs.
2. On `feat/add-api-endpoint` but fixing unrelated bug.
3. On `fix/typo-in-config` but adding a feature.

## Branch Naming Conventions

1. `feat/` for new capabilities.
2. `fix/` for bug fixes.
3. `docs/` for documentation-only changes.
4. `refactor/` for structure-only changes.
5. `chore/` for maintenance/tooling.
6. `ci/` for CI/CD changes.
7. `test/` for test changes.

**Format:** `<type>/<scope-description>`

## Heredoc Commit Example

Bash

```bash
git commit -F - <<EOF
feat(dashboard): add real-time update indicator

Implements a visual indicator that shows when dashboard data
is being refreshed. This helps users understand when they are
viewing stale data during network delays.
EOF
```

## Branch-Split Command Sequences

When work on the current branch has diverged from its stated scope, split uncommitted changes to a new correctly-scoped branch:

Bash

```bash
# Stash current work
git stash push -m "split: <new-scope-description>"

# Create the correctly-scoped branch from the same base
git checkout -b <type>/<new-scope-description>

# Pop the stash onto the new branch
git stash pop
```

If some changes belong on the original branch and some do not, use interactive staging before stashing:

Bash

```bash
# Stage only the in-scope changes and commit them first
git add -p
git commit -F - <<EOF
<type>(<scope>): <subject>

<body>
EOF

# Now stash the remaining out-of-scope changes
git stash push -m "split: <new-scope-description>"
git checkout -b <type>/<new-scope-description>
git stash pop
```

## Disallowed Commit Message Patterns

Avoid:

1. `git commit -m "...$var..."`
2. `git commit -m "..." -m "..."`
3. `git commit -m "subject" -m "body"`
