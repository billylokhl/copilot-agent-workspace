# Copilot Asset Linking Policy

## Principles

- Single source of truth is the copilot-agent-workspace repo in ~/sandbox/copilot-agent-workspace.
- VS Code user-profile locations are consumers only and should be symlinked.
- Create in copilot-agent-workspace first, then link into VS Code.

## Locations

- Authoritative: ~/sandbox/copilot-agent-workspace/prompts and ~/sandbox/copilot-agent-workspace/agents.
- Consumers: ~/Library/Application Support/Code/User/prompts and ~/Library/Application Support/Code/User/agents.

## Add A New Global Asset

1. Create the new prompt or agent in the copilot-agent-workspace repo.
2. Run scripts/link-copilot-assets.sh to create or repair symlinks.
3. Run scripts/validate-copilot-links.sh and confirm PASS.

## Modify An Existing Asset

1. Edit the authoritative asset in copilot-agent-workspace.
2. Re-run scripts/link-copilot-assets.sh if links need repair.
3. Re-run scripts/validate-copilot-links.sh and confirm PASS.

## Validation Expectations

- Validation is read-only and must not modify any files.
- The validation script should report PASS only when all links exist and resolve inside copilot-agent-workspace.
