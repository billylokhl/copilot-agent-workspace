---
name: git-commit-workflow-appendix
description: 'CI parity checks, commit reliability guards, and GitLab MR link generation'
---

# Git Commit Workflow Appendix

## Commit Reliability Guard (Tool-Driven Shells)

For deterministic fallback patterns and troubleshooting details, see:

Bash

```bash
git log -1 --oneline
git status --short
```

If commit output is ambiguous, re-run commit in deterministic heredoc format and re-verify.

## MR Link Generation (MANDATORY)

When sharing GitLab MR creation links, prefill at least:

1. `merge_request[source_branch]`
2. `merge_request[target_branch]`
3. `merge_request[title]`

Recommended:

1. `merge_request[description]`

**Template:**

```
https://gitlab.com/<namespace>/<project>/-/merge_requests/new?merge_request[source_branch]=<branch>&merge_request[target_branch]=main&merge_request[title]=<url-encoded-title>&merge_request[description]=<url-encoded-description>
```

Do not rely on default title derivation from latest commit subject.

## CI Parity Guard

Before committing, run local checks that mirror CI pipeline:

### Python Projects

Bash

```bash
# Style checks
ruff check .
black --check .

# Type checks
mypy .

# Tests
pytest
```

### Markdown Files

Bash

```bash
# Lint touched markdown files
markdownlint **/*.md
```

### General

Always run the repository's standard test suite and style checks before committing.

If CI checks are configured in `.github/workflows/` or similar, review those files to understand what will run in CI and replicate locally.
