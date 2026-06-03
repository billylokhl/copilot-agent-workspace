---
applyTo: "**"
---
# Global Agent Guidance

- **Progressive Skill Triggering:** Use entry-point skills that then reference narrower skills. Do not enumerate every focused skill at the top level.
- **Agent Routing:** Use role-based routing: Architect, Builder, Researcher, Auditor. Default agent coordinates multi-role work.
- **Model & Policy Recommendation:** Prefer model and policy hints that are environment-agnostic and small (e.g., preferred model class, safety constraints). Delegate model choices to `model-recommendation` skill when context requires specifics.
- **Workflow Expectations:** Keep interactions task-oriented, cite exact files/lines when making code changes, and validate any terminal commands before and after execution.
- **Discovery First:** Rely on native VS Code instruction discovery under `.github/instructions/` and per-workspace `copilot-instructions.md`. Avoid self-referential runtime loading instructions.

This file is the primary global entrypoint for instructions discovered by VS Code across workspaces. Keep it concise and reserve detailed policies for scoped instruction files and skills.

- **Entry Mapping (Commit Intent):** Commit-related requests — e.g., "commit this", "stage and commit", "create a commit", "conventional commit" — should route to the `git-commit-workflow` skill in `.github/skills/git-commit-workflow/SKILL.md`.
