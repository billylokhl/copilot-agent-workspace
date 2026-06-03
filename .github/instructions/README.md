## Instruction Files (overview)

- **global-agent.instructions.md**: Primary global entrypoint discovered by VS Code for workspace-agnostic policies and routing guidance.
- **copilot-instructions.md**: Workspace-scoped guidance and examples. Keep repository-specific policies and longer-form examples here.
- **instructions/*.instructions.md**: Scoped instruction files that VS Code discovers natively. Use `applyTo` frontmatter to target file globs.

How VS Code discovers instructions
- VS Code will load instruction files placed in paths configured in `chat.instructionsFilesLocations` (see user settings). Prefer placing globally reusable instructions under `.github/instructions/` in the source-of-truth repository.

Adding new instruction files
- Create a `*.instructions.md` file under `.github/instructions/` and include YAML frontmatter with `applyTo` to scope discovery.

Avoiding duplication
- Keep global guidance concise. Place language- or domain-specific policies in separate `*.instructions.md` scoped files. Do not include runtime self-load directives in `github.copilot.chat.customInstructions`.
