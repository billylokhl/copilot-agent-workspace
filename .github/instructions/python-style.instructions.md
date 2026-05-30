---
applyTo: "**/*.py"
---
# Python Style Guide
- **Core Standard:** Adhere to strict PEP 8 alignment paradigms.
- **Line Density:** Max horizontal length is bounded at 99 characters.
- **Type Hinting:** Explicit structural type hints are mandatory for all public functions, arguments, and interface layers.
- **Documentation:** Utilize clean, explicit Google-style docstrings across every functional block.
- **Path Manipulation:** Mandate the use of modern `pathlib` primitives. Completely avoid legacy `os.path` operations.
- **Defaults & Scope:** Never specify mutable parameters (e.g., empty lists or dictionaries) as default arguments in signatures. Catch highly specific, narrow exceptions rather than utilizing blanket `except Exception:` traps.
- **Import Sequence:** Structure imports cleanly by structural blocks separated by single lines: Standard library modules, Third-party extensions, Local system packages. Wildcard `*` imports are strictly forbidden.
