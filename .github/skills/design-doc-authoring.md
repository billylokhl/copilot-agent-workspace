# Design Doc Authoring

## Purpose
Enforces an explicit, highly technical 11-section framework for defining complex technical architectures.

## When to Use
Mandatory before writing or implementing any major engineering overhaul, breaking change, or new domain layer.

## Procedure

1. Initialize a design markdown file under a localized `docs/design/` architecture directory.
2. Structure the document explicitly using these 11 ATX headings:
   1. `# Title & Metadata`
   2. `## Problem Statement`
   3. `## Goals`
   4. `## Non-Goals`
   5. `## Background Context`
   6. `## Proposed Solution`
   7. `## Alternative Approach A`
   8. `## Alternative Approach B`
   9. `## Execution Plan`
   10. `## Open Questions & Risks`
   11. `## References`
3. Route the completed draft directly into the `design-doc-review.md` validation engine before breaking ground on code.

## Success Criteria
The technical architectural design document is fully articulated across all 11 core criteria blocks without shortcuts.
