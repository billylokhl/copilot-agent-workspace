# Instruction Governance

## Purpose
Enforces structural synchronicity across global and granular configuration rule sets.

## When to Use
Modifying, introducing, or deprecating instructions or trigger files.

## Procedure

1. Keep the core `.github/copilot-instructions.md` context light. Avoid massive narrative text blocks.
2. Ensure that any structural addition, deletion, or modification made inside the `.github/skills/` folder is cleanly mapped to a matching row update in the master instructions file trigger table within the exact same atomic commit.
3. Prevent circular indexing dependencies across individual `.instructions.md` layers.

## Success Criteria
Instruction configurations remain unified, highly atomic, and completely devoid of circular dependencies.
