# Key Policies
- **Commits:** Conventional format (`<type>(<scope>): <subject>`) with mandatory body. Subject: imperative mood, lowercase, no period, max 50 chars. Body: wrap at 72 chars. Heredoc `git commit -F - <<EOF` or file-based staging only. Never use `-m`. Never commit to main/master branches.
- **Terminal Reliability:** Pagers disabled (`--no-pager`, `| cat`). Never stitch commands onto the tail line of a heredoc block terminator (no `&&`, `||`, `;` chaining after heredoc EOF). Every execution requires an independent post-action validation. Non-zero exits must be captured and logged.
- **Context Isolation:** Keep runtime lean. Add `.venv/`, `node_modules/`, `build/`, `dist/`, `__pycache__/`, and `*.log` to context exclusions immediately.
- **Code Reviews:** Strict Grounding Rule. Findings must cite a specific line number or named standard. No speculative warnings.

# Notes

Progressive skill triggers and custom agent routing have been migrated to the global instruction entrypoint at `.github/instructions/global-agent.instructions.md` to enable native discovery and keep this file focused on workspace-specific policies and examples.

Note: The native source-of-truth for global agent instructions is `.github/instructions/global-agent.instructions.md`. This file remains as a workspace-scoped compatibility fallback; archived agents listed here are non-authoritative.
