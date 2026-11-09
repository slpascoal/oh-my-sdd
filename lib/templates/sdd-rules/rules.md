# Spec-Driven Development (SDD) rules

<!-- oh-my-sdd:start -->
You enforce Spec-Driven Development in this repository. Before implementing any non-trivial task, follow the pipeline below — never write implementation code before the artifacts are validated.

## Pipeline (strict order)

1. **Constitution** — ensure `.oh-my-sdd/constitution.md` exists (project global rules: locked stack, code standards, security guardrails, quality bar). It is a **binding constraint**: nothing you generate may contradict it.
2. **Specify** — write `.oh-my-sdd/specs/<slug>/spec.md` for the feature: intent, functional requirements in EARS syntax ("**When** X, the system **shall** Y"), and a verifiable acceptance-criteria checklist. **Stop and ask the user to validate it.**
3. **Plan** — translate the validated spec into `.oh-my-sdd/specs/<slug>/plan.md`: architecture decisions, data schemas, library choices (constitution-compliant).
4. **Tasks** — break the plan into `.oh-my-sdd/specs/<slug>/tasks.md`: atomic, sequential, individually verifiable checklist. **Stop and ask the user to confirm before any code.**
5. **Implement** — only after that confirmation: implement task by task, checking off each item in `tasks.md` immediately after completing it, strictly within `constitution.md` and the spec. If implementation demands something outside spec/plan, **stop and ask** — never decide silently.

## Rules

- **Never skip checkpoints.** Both human validations (spec, tasks) are blocking.
- **Never invent requirements** not present in the spec/plan; surface the conflict instead.
- **Evidence over self-assessment:** an acceptance criterion may only be reported as met with executable evidence (a passing check) or an explicit manual-verification note in `.oh-my-sdd/runtime/sensors/<slug>/manual-checks.md`; otherwise it stays "pending verification".
- **Respect `.oh-my-sdd/` layout:** `specs/` and `config/` are versioned; `runtime/` is execution state (gitignored) and must never be committed.
- Slugs are kebab-case; artifacts live under `.oh-my-sdd/specs/<slug>/`.

## Change hygiene (applies during implementation)

- **Surface before deciding:** state assumptions and competing interpretations; stop and ask when genuinely unclear. Never fill gaps silently.
- **Minimum that solves:** no unrequested features, no single-use abstractions, no speculative configuration or impossible-scenario handling.
- **Surgical diff:** every changed line must trace to a task; do not reformat or refactor adjacent untouched code; remove only orphans your change created.
- **Verifiable per task:** each task declares how it is verified before execution; a task without verification is not done.

## Execution discipline

- **Evidence before claims:** run the command, read its output and exit code, then state the result. No claim without a fresh run.
- **Test first:** for behavior changes, write the test, watch it fail, implement the minimum, watch it pass; run the whole suite before finishing.
- **Root cause first:** reproduce, instrument, isolate before fixing. After three failed fixes, stop and question the architecture with the user.
- **Record, don't improvise:** plan-internal decisions are logged as `Ruling: decision — reason — cost if wrong`. Scope, dependency, security, irreversible actions, and spec conflicts stop and ask.
<!-- oh-my-sdd:end -->
