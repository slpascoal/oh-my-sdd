# Skills Reference

## `oh-my-sdd` (orchestrator)

**Allowed tools:** `Read`, `Glob`, `Grep`, `Skill`

Entry point for the whole flow. It:

1. Identifies the input — free text, or a Jira key/URL (delegating to `jira-fetch` or an Atlassian MCP tool when available).
2. Derives a kebab-case slug for the feature and checks whether `.oh-my-sdd/specs/<slug>/` already exists (new feature vs. resume).
3. Activates `oh-my-sdd-constitution`, `oh-my-sdd-specify`, `oh-my-sdd-plan`, `oh-my-sdd-tasks`, and `oh-my-sdd-implement`, strictly in that order, waiting for each checkpoint signal before continuing.

It never generates `constitution.md`, `spec.md`, `plan.md`, `tasks.md`, or implementation code directly.

## `oh-my-sdd-constitution`

**Allowed tools:** `Read`, `Write`, `Glob`, `Grep`

Ensures the project has a `.oh-my-sdd/constitution.md`:

- If it already exists, it's read and confirmed — no regeneration, no questions. A regeneration/merge request scans sources again and proposes a **diff**, never regenerating from scratch (your manual edits stay untouched).
- **Sources first:** it scans `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.windsurfrules`, `CONTRIBUTING.md`, root lint/format configs and `.github/workflows/` in a fixed order, extracting rules **with source citations**. Conflicting rules between sources are listed and asked — never silently resolved.
- Then it analyzes the code (`package.json` / `composer.json` / `pyproject.toml` / `go.mod`, folder structure, naming conventions) to fill gaps, asking the user only what neither sources nor code resolved (typically ≤2 questions).
- Every rule ends up traceable: the generated constitution carries a `## Fontes` (Sources) block mapping each rule to its origin file, with code-inferred rules marked as such.
- The document follows the structure and rules from the [constitution best practices](../concepts/constitution-best-practices.md) and [example](../concepts/constitution-example.md): absolute language ("always"/"never"), an explicit agent persona, a locked technology stack, and no feature-specific content.
- It requires a **Change hygiene** section with 3–5 absolute rules derived from `knowledge/7-change-hygiene.md` (explicit assumptions, minimum that solves, surgical diff, verification before completion), specialized for the detected stack. In merge mode these rules are proposed as a diff and never overwrite manual edits.
- It requires an **Execution and evidence** section adapted from `knowledge/8-verification-discipline.md` and `knowledge/9-test-first-execution.md`: the project's test command, test-first policy, allowed exceptions, and the ban on claims without fresh evidence.

## `oh-my-sdd-specify`

**Allowed tools:** `Read`, `Write`, `Glob`, `Grep`

Generates `.oh-my-sdd/specs/<slug>/spec.md`:

- Treats `constitution.md` as a binding constraint.
- If `spec.md` already exists, treats it as an edit/continuation instead of regenerating from scratch.
- Structures the document exactly like the [practical spec example](../concepts/spec-example.md), using EARS/GEARS syntax for functional requirements, a verifiable acceptance-criteria checklist, and non-functional requirements/contracts.
- Requires an **Assumptions and Ambiguities** section before the EARS requirements: assumptions, competing interpretations and open questions are written down; ambiguity is presented to the user, never silently resolved. In `scale=SMALL` the section is limited to three lines.
- Has a **discovery mode**: when the request has no observable outcome, user or verifiable criterion, it asks at most three open questions, one at a time, before generating the spec.
- **Checkpoint #1**: presents the spec and does not hand control back to the orchestrator until the user explicitly validates it (or explicitly pauses/abandons).

## `oh-my-sdd-plan`

**Allowed tools:** `Read`, `Write`, `Glob`, `Grep`

Translates the validated `spec.md` into `.oh-my-sdd/specs/<slug>/plan.md`: architectural decisions, data/API schema, and library choices — the "how" — always within the constraints of `constitution.md`. It also records **considered alternatives** (at least one discarded with a reason), a **complexity justification** (each abstraction, layer or new dependency must state today's problem and current consumers), **Global Constraints** (exact values copied from the spec), **Review Focus** (risks no test covers) and **Interfaces** per task (consumes/produces with exact signatures). A self-review checks spec coverage, type consistency and plan proportion before release. Has no checkpoint of its own; `plan.md` is validated together with `tasks.md` in the next phase.

## `oh-my-sdd-tasks`

**Allowed tools:** `Read`, `Write`, `Glob`, `Grep`

Breaks `plan.md` into `.oh-my-sdd/specs/<slug>/tasks.md` — small, atomic, sequential tasks, each independently verifiable. Every task declares `altera:` (files/modules it may touch) and `verifica:` (the concrete command, test or inspection that proves completion). Tasks crossing interfaces add `consome:`/`produz:` with exact signatures; behavior-changing tasks add `passos:` with the RED→confirm failure→GREEN→confirm pass cycle (reduced steps allowed for configuration/docs with a stated reason). The list always ends with a **diff audit** task comparing `git diff --stat` against the declared scope.

**Checkpoint #2**: presents `plan.md` **and** `tasks.md` together and does not hand control back until the user explicitly confirms implementation can start.

## `oh-my-sdd-implement`

**Allowed tools:** `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`

Implements the feature:

- Reads `tasks.md`, `spec.md`, and `constitution.md`; detects which tasks are already checked off (resume support).
- Implements task by task, respecting `constitution.md` and the change-hygiene guardrails. If it needs to deviate from what was specified — including touching a file outside the task's `altera:` — it stops and asks instead of deciding silently.
- For behavior-changing tasks, follows test-first execution: write the failing test, confirm the failure, implement the minimum, confirm it passes.
- Runs the task's declared `verifica:` and reads its output and exit code before checking it off; a task whose verification did not run stays unchecked and is reported as pending.
- On a failed verification, applies the four systematic-debugging phases and fixes root causes only; after three failed fixes it stops and reports the architectural hypothesis.
- Records plan-internal decisions as `Ruling: decision — reason — cost if wrong`; scope, dependency, security, irreversible actions and spec conflicts stop and ask instead.
- On MEDIUM/LARGE, may offer an optional fresh-context review (no new human checkpoint) and fixes Critical/Important findings in a single test-first pass.
- Checks off each task in `tasks.md` as it's completed.
- Reports which tasks were implemented and which acceptance criteria from `spec.md` were met — comparing the generated code directly against the checklist.
