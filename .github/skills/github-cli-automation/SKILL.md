---
name: github-cli-automation
description: 'Non-interactive GitHub CLI execution for repositories, PRs, actions, and merges using gh'
---

# GitHub CLI Automation Engine

## Purpose
Enforces non-interactive execution parameters for managing repositories, pull requests, actions, and merges using the GitHub CLI (`gh`).

## When to Use
Triggered whenever the agent needs to initialize remote repositories, create branches, manage PR lifecycles, monitor CI/CD pipelines, or finalize code merges.

## Procedure
1. **Repository Creation:** When bootstrapping a new project remote, use non-interactive visibility flags:
   ```bash
   gh repo create <repo_name> --public --source=. --remote=origin
   ```
2. **Pull Request Lifecycle:** Always check for existing upstream tracking before opening a PR. Create PRs with explicit titles and bodies, skipping interactive prompt loops entirely:
   ```bash
   gh pr create --title "type(scope): summary" --body "Detailed description of changes"
   ```
3. **Pipeline Monitoring:** To track GitHub Actions workflow status, explicitly use the watch command. Avoid launching interactive web dashboards or terminal TUIs that hang the agent:
   ```bash
   gh run watch
   ```
4. **Autonomous Merging:** When pipelines pass and a PR satisfies repository constraints, execute the merge using automated squash parameters. Never leave a hanging terminal prompt:
   ```bash
   gh pr merge --squash --delete-branch
   ```

## Success Criteria
GitHub infrastructure states are mutated entirely through non-interactive CLI flags, returning clean exit codes without stalling the agent execution loop.
