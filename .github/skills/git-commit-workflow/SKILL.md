---
name: git-commit-workflow
description: 'Create reliable, scope-correct commits with conventional commit messages and mandatory body text. Use when: commit this; commit to git; create a commit; git commit these changes; stage and commit; make a conventional commit; compose commit message.'
---

# Git Commit Workflow

Create reliable, scope-correct commits with proper conventional commit messages.

## Use when / Natural prompts
- commit this
- commit to git
- create a commit
- git commit these changes
- stage and commit
- make a conventional commit
- compose commit message

This skill owns safe staging, status review, conventional commits, and commit-message composition.

## Non-Interactive Requirement (HARD RULE)

All commits in this workflow must be non-interactive.

- Always use heredoc (`git commit -F - <<EOF`) or file-based commit (`git commit -F /path/to/msg.txt`).
- Never use `-m` flags for commits with bodies.
- Never allow interactive editor sessions during commit.

Set `GIT_EDITOR=true` immediately before every commit command to prevent accidental interactive editor invocations.

## Pre-Commit Checklist

### Step 0a: Verify you are NOT on main/master

Bash

```bash
current_branch=$(git branch --show-current)
if [[ "$current_branch" == "main" || "$current_branch" == "master" ]]; then
  echo "ERROR: Cannot commit directly to $current_branch"
  exit 1
fi
```

#### Step 0b: Verify branch purpose matches your work

Before committing, ask:

"Does this branch name match what I'm changing?"

If branch purpose does not match, create a correctly scoped branch before continuing.

**Action when branch doesn't match:**

Bash

```bash
# Create new branch from appropriate base point
git checkout -b <type>/<scope-description>

# If you need changes from current branch, branch from it instead
git checkout -b <type>/<scope-description> current-branch-name
```

#### Step 0c: Re-check branch scope before EVERY commit

Branch purpose must be validated for each new commit, not just once per session. If work scope changed after the previous commit or MR merge, create a new branch before committing.

If scope no longer matches, stop and split to a correctly scoped branch. For branch-split command sequences and examples, see:

1. `.github/skills/git-commit-workflow-examples/SKILL.md`

### 1. Review All Changes

Bash

```bash
git status
git diff
git diff --stat
```

### 2. Categorize Changes

Group changes by logical concern (new features, bug fixes, documentation, tests, refactors). Each logical group becomes one commit.

### 3. Update Docs and Tests (MANDATORY for behavioral changes)

Before staging, ensure docs and tests are current for each logical group.

Quick checks:

- [ ] Docstrings and README reflect the change
- [ ] Tests cover new/modified code paths
- [ ] All tests pass

For comprehensive pre-flight documentation and test update patterns, see:

1. `.github/skills/update-docs-and-tests/SKILL.md`

### 3.5. CI Parity Guard (MANDATORY)

Run CI-parity checks before commit. At minimum, run the repository's style checks and markdown lint for touched markdown files.

For full CI-parity and rollout-aware details, see:

1. `.github/skills/git-commit-workflow-appendix/SKILL.md`

### 4. Stage First Logical Group

Bash

```bash
# Stage specific files (include related docs and tests)
git add path/to/changed/files

# Or stage interactively for partial file staging
git add -p path/to/file.py
```

**Verify staging:**

Bash

```bash
git diff --staged
```

### 5. Generate Commit Message

Use **Conventional Commits**: `<type>(<scope>): <subject>` + **mandatory** body.

- **Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- **Subject:** Imperative mood, lowercase, no period, max 50 chars, no emojis
- **Body:** MANDATORY. Explain what and why. Wrap at 72 chars.

### 6. Commit Using Heredoc (CRITICAL)

Use heredoc commit format for reliable non-interactive commits.

Set `GIT_EDITOR=true` immediately before the commit command as a safety guard:

Bash

```bash
export GIT_EDITOR=true
git commit -F - <<EOF
<type>(<scope>): <subject>

<body explaining what and why>
EOF
```

For full heredoc examples and disallowed message patterns, see:

1. `.github/skills/git-commit-workflow-examples/SKILL.md`

**Hard reliability rules:**

1. Set `GIT_EDITOR=true` before every commit command – no exceptions.
2. After a heredoc commit block, do not append chained actions (`&&`, `||`, `;`) in the same terminal command.
3. Run commit and verification as separate terminal commands.

Never use multi-`-m` commit messages for this workflow.

### 7. Verify Commit

Bash

```bash
git log -1
git show
```

For split-command commit/verify examples, see:

1. `.github/skills/git-commit-workflow-examples/SKILL.md`

### 7.5 Commit Reliability Guard (Tool-Driven Shells)

Always verify commit outcome immediately after commit attempts:

Bash

```bash
git log -1 --oneline
git status --short
```

For deterministic fallback patterns and troubleshooting details, see:

1. `.github/skills/git-commit-workflow-appendix/SKILL.md`

### 8. Repeat for Remaining Groups

Bash

```bash
git status            # Check remaining changes
git add <files>       # Stage next logical group
# Commit with heredoc (Step 6)
```

### 9. Final Verification

Bash

```bash
git status            # Should be clean
git log --oneline -5  # Review history
```

## Success Criteria

- Each commit contains one logical change
- All commits have properly formatted messages with bodies
- No mixed concerns in a single commit
- Docs and tests updated for behavioral changes
- All tests pass before committing
- Commits are on a feature branch, never directly on `main`
- Branch scope is re-validated before every commit; mismatches are split to a new branch
