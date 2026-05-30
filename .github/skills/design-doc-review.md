# Design Doc Review Engine

## Purpose
Provides rigorous structural criteria for critique and safety auditing of proposed design specifications.

## When to Use
Executed prior to approving a design document draft or initializing implementation code blocks.

## Procedure

1. Critique the incoming architecture file against 5 strict system pillars: Justified Problem, Measurable Goals, Genuine Alternatives, Clear Dependencies, and Handled Failure Modes.
2. Format all review feedback outputs distinctly using standardized severity markers to ensure scannability:
   - `[BLOCKING]` For critical architectural flaws, security gaps, or unhandled data failure loops.
   - `[IMPORTANT]` For structural gaps, missing edge cases, or heavy maintenance footprints.
   - `[SUGGESTION]` For minor optimizations, style alignments, or non-critical quality improvements.

## Success Criteria
Review feedback is returned as clear, non-conversational points explicitly categorized by the three severity markers.
