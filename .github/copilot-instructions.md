# Key Policies
- **Commits:** Conventional format (`<type>(<scope>): <subject>`) with mandatory body. Subject: imperative mood, lowercase, no period, max 50 chars. Body: wrap at 72 chars. Heredoc `git commit -F - <<EOF` or file-based staging only. Never use `-m`. Never commit to main/master branches.
- **Terminal Reliability:** Pagers disabled (`--no-pager`, `| cat`). Never stitch commands onto the tail line of a heredoc block terminator (no `&&`, `||`, `;` chaining after heredoc EOF). Every execution requires an independent post-action validation. Non-zero exits must be captured and logged.
- **Context Isolation:** Keep runtime lean. Add `.venv/`, `node_modules/`, `build/`, `dist/`, `__pycache__/`, and `*.log` to context exclusions immediately.
- **Code Reviews:** Strict Grounding Rule. Findings must cite a specific line number or named standard. No speculative warnings.

# Core Skills (Always Active)

Read and apply these skills for all relevant operations:

| When | Skill Path |
| :--- | :--- |
| Any git commit or branch operation | `.github/skills/git-commit-workflow/SKILL.md` |
| Any terminal command execution | `.github/skills/terminal-reliability/SKILL.md` |
| Code review or quality audit request | `.github/skills/code-review/SKILL.md` |
| Workspace initialization or context changes | `.github/skills/workspace-context-hygiene/SKILL.md` |

**Note:** Core skills reference additional specialized skills internally as needed. Additional skills available in `.github/skills/` for specialized workflows (repository setup, design docs, versioning, Python environments, GitHub automation, etc.).
