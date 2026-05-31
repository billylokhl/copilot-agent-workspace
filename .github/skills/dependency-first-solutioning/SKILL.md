---
name: dependency-first-solutioning
description: 'Prioritize verified external libraries over custom code to reduce bloat and maintenance burden'
---

# Dependency First Solutioning

## Purpose
Mitigates custom code-bloat by prioritizing verified, well-maintained external libraries.

## When to Use
Before drafting or introducing any new internal functional utility or helper module.

## Procedure

1. Query official package registries (e.g., PyPI, npm) to see if an active open-source library covers the use case.
2. Assess structural maintenance factors: licensing compliance, release consistency, and performance overhead.
3. If no match is found and custom logic is mandatory, append a clear block comment at the top of the utility file detailing why a library was bypassed.
4. Update dependencies directly inside the workspace `pyproject.toml` or `package.json`.
5. For Python projects, ensure the correct virtual environment is activated before installing packages.

For Python environment management, see:

1. `.github/skills/python-env-selection/SKILL.md`

## Success Criteria
No redundant boilerplate code is added when verified, mature ecosystem solutions are available.
