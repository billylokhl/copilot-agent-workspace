# Git Commit Workflow Appendix

## Git Tracking Hygiene

### 1. List All Tracked Files

Bash

```bash
git ls-files
```

### 2. Identify Problem Files

Look for:

- Build artifacts: `*.pyc`, `__pycache__/`, `dist/`, `build/`, `*.egg-info/`
- Dependencies: `node_modules/`, `.venv/`, `venv/`
- IDE configs: `.vscode/`, `.idea/`, `*.swp`
- Logs and temp files: `*.log`, `*.tmp`, `.DS_Store`
- Secrets: `.env`, `*.key`, `credentials.*`

### 3. Check `.gitignore`

Bash

```bash
cat .gitignore
```

### 4. Fix Issues

Bash

```bash
# Remove from git but keep on disk
git rm --cached path/to/file

# Add missing patterns to .gitignore
echo "pattern_to_ignore" >> .gitignore
```

### 5. Commit if Changes Made

Bash

```bash
git add .gitignore
git commit -F - <<EOF
chore(git): update gitignore patterns

Prevents tracking of build artifacts and local environment files
to keep the repository clean and avoid committing sensitive data.
EOF
```

## Success Criteria

- No generated files are tracked
- No IDE configs are tracked
- No test outputs are tracked
- No secrets/credentials are tracked
- All source code, config, and docs are tracked
- `.gitignore` covers all common generated patterns

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
