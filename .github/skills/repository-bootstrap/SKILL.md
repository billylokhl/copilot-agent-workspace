---
name: repository-bootstrap
description: >
  Standardized discovery workflow for unfamiliar repositories. Produces a
  concise bootstrap report covering purpose, authority hierarchy, required
  reading, instructions, skills, build/test commands, current state, risks,
  and recommended next actions. Use when: entering a new repository; onboarding
  to an unfamiliar codebase; first contact with a repository; understand this
  repo; what is this project; how do I get started here; bootstrap report.
---

# Repository Bootstrap Skill

## Purpose

When an agent enters an unfamiliar repository, execute a standardized
discovery workflow and emit a **Bootstrap Report** that any downstream
agent or human can act on immediately.

This skill is **repository-agnostic**: it works for software projects,
research corpora, documentation repositories, and mixed repositories.

---

## Invocation Triggers

Invoke this skill when the user or a coordinating agent says:

- "enter this repository"
- "bootstrap this repo"
- "what is this project?"
- "I need a bootstrap report"
- "onboard to this codebase"
- "first contact with this repo"
- "understand this repo"
- "how do I get started here?"
- Whenever an agent begins work in a repository it has not previously
  analyzed in the current session

---

## Required Inputs

| Input | Description |
|-------|-------------|
| Repository root path | Absolute path to the repository root (workspace root) |

## Optional Inputs

| Input | Description | Default |
|-------|-------------|---------|
| Depth hint | `shallow` (quick scan) or `deep` (full file read) | `shallow` |
| Role hint | `builder`, `architect`, `researcher`, `auditor` | `none` |
| Focus area | Specific subsystem, directory, or concern to prioritize | `none` |

---

## Discovery Workflow

Execute steps in order. Do **not** skip steps — absence of a file is
itself a finding and must be recorded as such.

### Step 1 — Anchor Files (Top-Level Orientation)

Check for each file. Record presence or absence.

```
AGENTS.md
README.md
CONTRIBUTING.md
CHANGELOG.md
LICENSE
.github/copilot-instructions.md
docs/project-principles.md
docs/ARCHITECTURE.md
docs/architecture.md
ADR/ (or docs/adr/, docs/decisions/)
```

Read every present anchor file. Extract:

- Repository purpose (one sentence)
- Primary stakeholder or audience
- Explicit authority hierarchy (if stated)
- Any "required reading before editing" lists
- Any "do not touch" warnings

### Step 2 — Instructions Inventory

Scan for instruction files:

```bash
find .github/instructions/ -name "*.instructions.md" 2>/dev/null
find .github/ -name "copilot-instructions.md" 2>/dev/null
find . -maxdepth 2 -name "AGENTS.md" 2>/dev/null
```

For each file found, record:

- File path
- `applyTo` pattern (from YAML frontmatter, if present)
- One-line summary of the rule or constraint it enforces

### Step 3 — Skills Inventory

Scan for skill files:

```bash
find .github/skills/ -name "SKILL.md" 2>/dev/null
```

For each skill found, record:

- Skill name (from frontmatter `name:` field or directory name)
- One-line description
- Invocation triggers (if listed)

### Step 4 — Build / Test / Run Workflow

Probe for standard configuration files. Record each found:

| File | Implication |
|------|-------------|
| `pyproject.toml` / `setup.py` / `setup.cfg` | Python package; check `[project.scripts]`, `[tool.pytest]` |
| `package.json` | Node.js; check `scripts` section |
| `Cargo.toml` | Rust; `cargo build`, `cargo test` |
| `go.mod` | Go; `go build ./...`, `go test ./...` |
| `Makefile` | Custom build targets; list targets with `make -qp` |
| `Dockerfile` / `docker-compose.yml` | Container-based workflow |
| `.github/workflows/*.yml` | CI/CD definitions; read job names and triggers |
| `tox.ini` / `.tox/` | Python tox environment |
| `justfile` | Just task runner |
| `deno.json` / `deno.jsonc` | Deno runtime |
| `mvnw` / `pom.xml` | Maven/Java |
| `gradlew` / `build.gradle` | Gradle/Java/Kotlin |

Extract the canonical build, test, and run commands. Prefer commands
explicitly documented in README or CONTRIBUTING over inferred defaults.

**Do not run any build or test commands during bootstrap.**
Record the commands only.

### Step 5 — Repository Structure Map

Produce a one-level directory listing. For each top-level entry, assign
a role label:

| Label | Meaning |
|-------|---------|
| `source` | Implementation code |
| `tests` | Test suite |
| `docs` | Documentation artifacts |
| `data` | Datasets, corpora, ledger files |
| `config` | Configuration files |
| `scripts` | Utility scripts |
| `output` | Generated artifacts |
| `infra` | Infrastructure / CI definitions |
| `assets` | Static assets (images, fonts, etc.) |
| `unknown` | Cannot be classified from name alone |

### Step 6 — Current State Assessment

Read the following to determine current state:

1. `README.md` — look for status badges, "current status" sections, known
   limitations, roadmap items
2. Any `CHANGELOG.md` — most recent entry
3. Any open-task files (`TODO.md`, `TASKS.md`, `docs/roadmap*.md`,
   `docs/*-roadmap*.md`)
4. `.github/workflows/` — identify if CI is configured and what it covers

Record:

- Stated maturity level (proof-of-concept / alpha / beta / stable / maintained / archived)
- Known limitations explicitly stated in documentation
- Open items or roadmap entries
- CI coverage (none / partial / full)

### Step 7 — Governance and Provenance Rules

Look for:

```
docs/research/governance-framework.md
docs/governance*.md
docs/project-principles*.md
GOVERNANCE.md
.github/CODEOWNERS
```

If found, extract:

- Decision-making authority (who owns what)
- Merge / promotion gates
- Evidence or provenance requirements
- Labeling conventions
- Prohibited actions explicitly listed

### Step 8 — Risk and Constraint Detection

Scan for explicit caution markers in anchor files and governance documents:

- Lines containing: `do not`, `never`, `prohibited`, `forbidden`,
  `must not`, `do NOT`, `WARNING`, `CAUTION`, `DANGER`
- Files or directories marked as "do not edit casually" or equivalent
- Hard rules in instruction files
- Files that are source-of-truth (edits break downstream systems)

Record each risk with its source file and line reference.

---

## Bootstrap Report Format

Emit the following report structure. Omit sections only if discovery
found no relevant information AND absence is explicitly noted.

```markdown
# Bootstrap Report — <repository-name>

**Generated:** <ISO date>
**Role hint:** <role if provided, else "none">
**Depth:** <shallow | deep>

---

## 1. Repository Identity

- **Purpose:** <one sentence>
- **Type:** <software | research | documentation | mixed>
- **Primary audience:** <stakeholders>
- **Maturity:** <maturity level>

---

## 2. Authority Hierarchy

Ordered list from highest to lowest authority. Source file cited for each.

1. <source> — <what it governs>
2. …

If no explicit hierarchy is documented: state "Not explicitly documented.
Inferred from anchor file presence: <list>."

---

## 3. Key Documents

| Document | Role | Path |
|----------|------|------|
| … | … | … |

---

## 4. Instructions Inventory

| File | applyTo | Rule summary |
|------|---------|--------------|
| … | … | … |

If none found: "No `.github/instructions/` directory detected."

---

## 5. Skills Inventory

| Skill | Description | Triggers |
|-------|-------------|----------|
| … | … | … |

If none found: "No `.github/skills/` directory detected."

---

## 6. Build / Test / Run Workflow

| Command | Purpose | Source |
|---------|---------|--------|
| … | … | … |

Environment notes (venv, containers, required env vars, etc.)

If none found: "No standard build configuration detected."

---

## 7. Current State

- **Maturity:** …
- **CI:** …
- **Known limitations:** …
- **Open items:** …

---

## 8. Risks / Constraints

| Risk | Severity | Source |
|------|----------|--------|
| … | HIGH / MEDIUM / LOW | … |

Severity guidance:
- HIGH: Irreversible actions, broken downstream provenance, data loss
- MEDIUM: Process violations, audit failures, rework required
- LOW: Style or convention deviations

---

## 9. Recommended Reading Order

Ordered list. Rationale for each entry.

1. <file> — <why read first>
2. …

---

## 10. Suggested Next Actions

Role-specific suggestions (if role hint was provided). Otherwise generic.

- [ ] <action>
- [ ] …
```

---

## Completion Checklist

Before emitting the Bootstrap Report, verify:

- [ ] All anchor files checked (presence and absence recorded)
- [ ] Instructions inventory complete
- [ ] Skills inventory complete
- [ ] Build/test commands extracted (not run)
- [ ] Repository structure mapped
- [ ] Current state assessed
- [ ] Governance documents read
- [ ] Risks catalogued with source citations
- [ ] Authority hierarchy ordered
- [ ] Recommended reading order justified

---

## Anti-Patterns

**Do not do any of the following:**

| Anti-pattern | Why prohibited |
|--------------|----------------|
| Infer purpose without reading anchor files | Produces unreliable identity section |
| Run build or test commands during bootstrap | Bootstrap is read-only; mutations belong to Builder role |
| Install dependencies during bootstrap | Same reason |
| Skip absent-file recording | Absence is a finding, not nothing |
| Treat README as authoritative if a higher-level governance doc exists | Authority hierarchy must be respected |
| Summarize governance docs without reading them | Paraphrase errors corrupt downstream agents |
| Assume directory naming conventions are universal | Label structure from content, not name alone |
| Emit the report before the completion checklist passes | Incomplete reports are worse than no report |
| Hard-code repository-specific paths | This skill must be repository-agnostic |
| Conflate "informational" with "authoritative" sources | Distinguish them explicitly in section 2 |

---

## Escalation Conditions

Stop and report to the user if:

1. **Conflicting authority claims** — two documents assert different
   authority hierarchies without resolution.
2. **Incomplete governance** — a governance framework is referenced in
   AGENTS.md or README but the file does not exist.
3. **Ambiguous repository type** — the repository contains both active
   implementation code and research artifacts with no clear separation policy.
4. **Security-sensitive files detected** — `.env`, unencrypted secrets,
   credentials in tracked files. Do not read these files. Report their
   presence only.
5. **Scope request exceeds bootstrap** — the user asks for implementation
   work during bootstrap. Return the Bootstrap Report and stop. Route
   implementation to Builder.
6. **Role conflict** — the requesting agent's role (e.g., Auditor) prohibits
   an action required to complete a bootstrap step. Record a verification
   gap and continue with remaining steps.

---

## Notes on Repository Types

### Software Projects
Priority sections: Build/Test Workflow, CI, Source structure.
Key files: `pyproject.toml`, `package.json`, `Makefile`, `.github/workflows/`.

### Research / Documentation Repositories
Priority sections: Authority Hierarchy, Governance, Provenance Rules.
Key files: `AGENTS.md`, `docs/project-principles.md`, governance framework,
instruction files.

### Mixed Repositories
Both sets of priorities apply. Explicitly map which directories belong to
which concern in the Structure Map section.

### Archived / Unmaintained Repositories
Note archival status prominently in section 7. Flag all suggested next
actions as informational only.
