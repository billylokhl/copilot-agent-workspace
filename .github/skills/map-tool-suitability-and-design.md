# Model Tool Suitability and Design

## Purpose
Governs the creation and structuring of Model Context Protocol (MCP) handlers and custom tool schemas.

## When to Use
Prior to introducing any new function hook, tool definition, or LLM-accessible execution abstraction.

## Procedure

1. Evaluate tool suitability against rigid criteria: The action must occur frequently, possess a clean deterministic contract, be safe to execute programmatically, and completely avoid messy interactive terminal parsing loops.
2. Reject anti-patterns immediately: Never create trivial code wrappers, unbounded token data streams, or tools that block waiting on interactive stdin inputs.
3. Design contract interfaces strictly using standard `verb_noun` naming conventions. Every tool must return a definitive boolean `success` field alongside targeted, validated path boundaries.

## Success Criteria
New tool abstractions expose structured, deterministic, and safe execution scopes to the model context.
