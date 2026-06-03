---
name: model-recommendation
description: 'Prepare orchestration-aware model and specialist-agent recommendations for coding-agent prompts'
---

# Model Recommendation

## Purpose

This personal skill prepares coding-agent prompts by producing a human-facing model recommendation block (Mode, Agent,
Model, Thinking Mode, Session Recommendation, Reason) and then generating the prompt text. It is explicitly a
prompt-preparation assistant and does not switch Copilot/VS Code models automatically.

## When to Use

- When preparing a coding-agent task (Architect, Builder, Researcher, Auditor).
- When you want an orchestration-aware, cost-conscious model recommendation before running the prompt.

## High-Level Workflow

1. Determine task ownership (specialist Agent vs Default Agent orchestration).
2. Enumerate participating agents (if orchestration required).
3. Compute the capability ceiling using the policy (`model-capability-policy.json`).
4. Use the pre-computed ranked snapshot (`ranked-models.snapshot.json`) to pick the primary recommendation and
	provider-diverse alternatives.
5. Emit the Recommendation Block (exact format below) and the generated prompt the user should run.

## Recommendation Block Format

Mode:
Agent:
Model:
Thinking Mode:
Session Recommendation:
Reason:

Note: The Recommendation Block must appear verbatim at the top of the generated prompt so users can copy the `Model` and
manually select it in VS Code before running.

## Provider Alternatives

The skill includes provider-diverse alternatives (best eligible model per provider) so the user can select an equivalent
from another vendor if credentials/quota differ.

## Maintenance

Run these commands from the repository root:

```bash
node scripts/validate-model-capability-policy.js
node scripts/rank-available-models.js
# Single-role examples
node scripts/recommend-model.js --role Researcher
node scripts/recommend-model.js --role Builder
node scripts/recommend-model.js --role Architect
node scripts/recommend-model.js --role Auditor
# Workflow examples
node scripts/recommend-model.js --workflow Researcher,Architect,Auditor
node scripts/recommend-model.js --workflow Builder,Auditor
```

## Ownership Guidance

- If the user's task explicitly mentions a role (e.g. "Please perform an architecture review"), assign that specialist
	agent.
- If the task involves multiple concerns (design + implementation), use Default Agent orchestration and list
	participating agents.
- Prefer conservative routing: if ambiguous, assume `Builder` for code changes or `Researcher` for information-only
	tasks.

## Specialist Agent Guidance

- Specialist: clear single-role tasks where a focused behavior is required (e.g., security audit → Auditor).
- Default Agent orchestration: cross-role workflows where multiple agents must collaborate; recommend a model that
	satisfies the computed ceiling.

## Prompt Formatting

Place the Recommendation Block (exact format above) at the top, followed by a brief one-line session recommendation,
then the full generated prompt. Example:

```text
Mode: Agent
Agent: Architect
Model: claude-sonnet-4-6
Thinking Mode: unknown
Session Recommendation: Use claude-sonnet-4-6 for design review; verify thinking mode support before enabling.
Reason: Participants [Researcher, Architect, Auditor] require Tier 3; cheapest Tier 3 at medium cost is
claude-sonnet-4-6 [anthropic]. Alternatives: OpenAI:o3, Anthropic:claude-opus-4-6.

<Generated prompt goes here>
```

## Notes and Constraints

- The skill does not modify `.agent.md` files or global instructions.
- The user must manually select the recommended model in VS Code's model picker before running the prompt.
- The skill uses local artifacts under `~/.copilot/model-recommendation/` and repository scripts; ensure snapshots are
	fresh.
