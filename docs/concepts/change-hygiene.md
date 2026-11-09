# Change Hygiene

Spec-Driven Development governs what comes **before** implementation (spec, plan) and what comes **after** (sensors, evidence gates). Change hygiene governs the **edit itself** — the moment the agent writes code.

## The gap it closes

Without rules for the edit, four failures recur even when the spec is good:

- A requirement is ambiguous and the agent silently picks one reading.
- The implementation grows speculative abstractions nobody asked for.
- The diff touches, reformats, or refactors code unrelated to the task.
- A task is checked off without any proof that it works.

Change hygiene turns these into observable behavior in the artifacts you already review.

## The four guardrails

| Guardrail | What it enforces |
|---|---|
| **Surface assumptions** | Assumptions, competing interpretations and open questions are written down. Genuine ambiguity stops the run instead of being filled silently. |
| **Minimum that solves** | No unrequested features, single-use abstractions, speculative configuration, or handling of impossible scenarios. |
| **Surgical diff** | Every changed line traces to a task. Untouched adjacent code is never reformatted or refactored. Only orphans created by the change are removed. |
| **Verifiable per task** | Each task declares how it will be verified before execution, and is not complete until that verification runs. |

The full rules live in `knowledge/7-change-hygiene.md`, installed with every skill.

## Where each guardrail acts

| Phase | Artifact | Guardrail applied |
|---|---|---|
| Constitution | `constitution.md` | A **Change hygiene** section with 3–5 absolute, stack-specific rules |
| Specify | `spec.md` | An **Assumptions and Ambiguities** section before the EARS requirements |
| Plan | `plan.md` | **Considered alternatives** and **complexity justification** |
| Tasks | `tasks.md` | Every task declares `altera:` and `verifica:`; the list ends with a diff audit |
| Implement | code | Assumptions are read first, verification runs before a task is checked off, out-of-scope files stop the run |

## Proportional rigor

Change hygiene follows the existing adaptive scale — there is no second ruler:

- **QUICK** — assumptions (only if ambiguity is real), minimum that solves, surgical diff. The single checkpoint is unchanged; the evidence gate replaces per-task verification.
- **SMALL** — the assumptions section is limited to three lines; `altera:`/`verifica:` are required.
- **MEDIUM / LARGE** — all four guardrails, with both human checkpoints preserved.

## What it looks like in the artifacts

```md
## Premissas e Ambiguidades

- Premissa: the export is paginated; assumed because the API returns at most 100 rows.
- Interpretações concorrentes: download file vs. background job — decision pending.
```

```md
## Alternativas consideradas

- Reuse the existing exporter — discarded because it writes synchronously and blocks the request.

## Justificativa de complexidade

- New queue adapter — solves the 30s request timeout; current consumers: 1 (justified by the hard limit).
```

```md
- [ ] 3. Add the export endpoint
      altera: src/api/export.ts, src/services/export.ts
      verifica: npm test -- export.test.ts
```

## What does not change

No new skill, no new phase, and no new human checkpoint. The orchestrator order stays `constitution → specify → plan → tasks → implement`. When a guardrail conflicts with `constitution.md`, the constitution always wins.
