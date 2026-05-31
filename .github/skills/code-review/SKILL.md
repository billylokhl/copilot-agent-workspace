---
name: code-review
description: 'Automated parallelized audits for security (OWASP Top 10), correctness, and style compliance with strict grounding'
---

# Parallel Code Review Engine

## Purpose
Provides automated, parallelized correctness, security, and architectural pattern audits.

## When to Use
Triggered upon explicit pull request generation, file modification loops, or direct code audit requests.

## Procedure
1. Audit the current code footprint across three decoupled dimensions: OWASP Top 10 Security vulnerabilities, operational runtime logic, and style compliance.
2. Apply the **Strict Grounding Rule**: Omit all conversational warnings or speculative concerns. Every valid entry must attach directly to a specific file line number or established rule standard.
3. Return results strictly inside a single flat JSON array structure grouped cleanly by severity labels:
   ```json
   [
     {
       "file": "main.py",
       "line": 42,
       "severity": "BLOCKING",
       "rule_violated": "OWASP-A03:2021-Injection",
       "description": "Raw string concatenation detected within database execution path.",
       "fix_action": "Parameterize input values using localized database driver abstractions."
     }
   ]
   ```

## Success Criteria
Output complies perfectly with the flat JSON schema containing exclusively verified, grounded flaws.
