# Orchestration-Aware Model Recommendation

## Status

Design appendix and rationale document.

Global policy authority: /Users/billylokhl/Library/Application Support/Code/User/prompts/coding-agent-policy.md

This document is non-authoritative for policy and must not conflict with the global policy.

## Purpose

1. Preserve design rationale for orchestration-aware recommendation.
2. Capture implementation-oriented notes for future model-discovery integration.
3. Track open questions that may refine the policy.

## Key rationale

1. Subagent model inheritance means parent model choice can affect entire workflows.
2. Per-role-only optimization is insufficient for orchestrated multi-role tasks.
3. The practical target is the lowest expected cost model likely to succeed end-to-end.

## Non-authoritative reference flow

1. Determine ownership and orchestration needs per global policy.
2. Enumerate participating roles.
3. Compute capability ceiling from role demands.
4. Filter discovered models to those meeting the ceiling.
5. Select lowest expected cost candidate likely to succeed.

## Integration notes

1. Model discovery should expose model ID, capability data, cost metadata, context size, and tool-use support.
2. Capability mapping should remain externalized and versioned.
3. Recommendation outputs should include rationale and fallback candidate.

## Open questions

1. Capability scoring source of truth.
2. Accuracy of workflow inference from free-text tasks.
3. Cost model precision for session-level estimates.
4. Tier update propagation and versioning cadence.

## Change note

1. 2026-06-03: Reconciled to defer all normative policy to coding-agent-policy.md.
