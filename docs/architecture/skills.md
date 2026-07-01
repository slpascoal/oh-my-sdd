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

- If it already exists, it's read and confirmed — no regeneration, no questions.
- If it doesn't, the skill analyzes `package.json` / `composer.json` / `pyproject.toml` / `go.mod`, lint/formatter configs, folder structure, and existing naming conventions to **infer** the stack and conventions. It only asks the user about what can't be safely inferred (e.g. specific security guardrails, allowed/forbidden external dependencies).
- The document follows the structure and rules from the [constitution best practices](../concepts/constitution-best-practices.md) and [example](../concepts/constitution-example.md): absolute language ("always"/"never"), an explicit agent persona, a locked technology stack, and no feature-specific content.

## `oh-my-sdd-specify`

**Allowed tools:** `Read`, `Write`, `Glob`, `Grep`

Generates `.oh-my-sdd/specs/<slug>/spec.md`:

- Treats `constitution.md` as a binding constraint.
- If `spec.md` already exists, treats it as an edit/continuation instead of regenerating from scratch.
- Structures the document exactly like the [practical spec example](../concepts/spec-example.md), using EARS/GEARS syntax for functional requirements, a verifiable acceptance-criteria checklist, and non-functional requirements/contracts.
- **Checkpoint #1**: presents the spec and does not hand control back to the orchestrator until the user explicitly validates it (or explicitly pauses/abandons).

## `oh-my-sdd-plan`

**Allowed tools:** `Read`, `Write`, `Glob`, `Grep`

Translates the validated `spec.md` into `.oh-my-sdd/specs/<slug>/plan.md`: architectural decisions, data/API schema, and library choices — the "how" — always within the constraints of `constitution.md`. Has no checkpoint of its own; `plan.md` is validated together with `tasks.md` in the next phase.

## `oh-my-sdd-tasks`

**Allowed tools:** `Read`, `Write`, `Glob`, `Grep`

Breaks `plan.md` into `.oh-my-sdd/specs/<slug>/tasks.md` — small, atomic, sequential tasks, each independently verifiable.

**Checkpoint #2**: presents `plan.md` **and** `tasks.md` together and does not hand control back until the user explicitly confirms implementation can start.

## `oh-my-sdd-implement`

**Allowed tools:** `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`

Implements the feature:

- Reads `tasks.md`, `spec.md`, and `constitution.md`; detects which tasks are already checked off (resume support).
- Implements task by task, respecting `constitution.md`. If it needs to deviate from what was specified, it stops and asks instead of deciding silently.
- Checks off each task in `tasks.md` as it's completed.
- Reports which tasks were implemented and which acceptance criteria from `spec.md` were met — comparing the generated code directly against the checklist.
