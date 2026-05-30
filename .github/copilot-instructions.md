# Key Policies
- **Commits:** Conventional format with mandatory body. Heredoc `git commit -F - <<EOF` or file-based staging only. Never use `-m`. Never commit to main/master branches.
- **Terminal Reliability:** Pagers disabled (`--no-pager`, `| cat`). No `&&` chaining after heredoc terminators. Every execution requires an independent post-action validation. Non-zero exits must be captured and logged.
- **Context Isolation:** Keep runtime lean. Add `.venv/`, `node_modules/`, `build/`, `dist/`, `__pycache__/`, and `*.log` to context exclusions immediately.
- **Code Reviews:** Strict Grounding Rule. Findings must cite a specific line number or named standard. No speculative warnings.

# Skill Triggers
| Trigger | Phase | Priority | Skill File Path |
| :--- | :--- | :--- | :--- |
| Git Operations & Commits | Pre-commit | High | `.github/skills/git-commit-workflow.md` |
| Git Commit Examples & Branch Splitting | Reference | High | `.github/skills/git-commit-workflow-examples.md` |
| Git Hygiene, CI Parity & MR Links | Pre-action | High | `.github/skills/git-commit-workflow-appendix.md` |
| Untracking Files / Hygiene | Pre-action | Medium | `.github/skills/git-tracking-hygiene.md` |
| Executing Terminal Commands | Pre-action | High | `.github/skills/terminal-reliability.md` |
| Workspace Virtual Environments | Incident | High | `.github/skills/python-env-selection.md` |
| Local File Workspace Changes | Post-action | Medium | `.github/skills/workspace-context-hygiene.md` |
| Reviewing Pull Requests / Diffs | Pre-action | High | `.github/skills/code-review.md` |
| Pre-flight Document Updates | Pre-commit | Medium | `.github/skills/update-docs-and-tests.md` |
| Adding Codebase Dependencies | Pre-action | Medium | `.github/skills/dependency-first-solutioning.md` |
| Refining Configuration Logic | Incident | Low | `.github/skills/instruction-governance.md` |
| GitHub Remote Lifecycle Management | Pre-action | High | `.github/skills/github-cli-automation.md` |
| Initializing New Repositories | Pre-action | Medium | `.github/skills/project-bootstrap-baseline.md` |
| Drafting Architectural Design Docs | Pre-action | Medium | `.github/skills/design-doc-authoring.md` |
| Reviewing Architectural Plans | Pre-action | High | `.github/skills/design-doc-review.md` |
| Incrementing Version Releases | Pre-action | Medium | `.github/skills/version-bump-strategy.md` |
| Registering New Model Tools / MCP | Pre-action | High | `.github/skills/map-tool-suitability-and-design.md` |
