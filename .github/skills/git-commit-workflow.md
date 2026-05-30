# Git Commit Workflow

## Purpose
Enforces deterministic, structured commit states preventing interactive terminal locking.

## When to Use
Prior to staging or finalizing any git commit inside the repository.

## Procedure
1. Verify the current working branch is not main or master using `git branch --show-current`.
2. Format the message according to the Conventional Commits specification (`type(scope): description`) with a mandatory blank line and a body explaining the "why" behind the change.
3. Execute the commit strictly using the file-stream or heredoc input block to avoid quote-escaping issues or accidental interactive terminal loops:
   ```bash
   git commit -F - <<EOF
   feat(core): implement localized agent skill triggers

   Adds underlying infrastructure for running isolated domain specific
   markdown skill files under the .github root directory.
   EOF
   ```
