# Execution Discipline

Change hygiene governs how the edit is made. Execution discipline governs how the work is proven. The pipeline already had a spec before the code and evidence after it; these rules cover the stretch in between.

## The four rules

| Rule | What it enforces |
|---|---|
| **Evidence before claims** | A conclusion is stated only after the command ran in this execution and its output and exit code were read. "Should work" is not a status. |
| **Test first** | Behavior changes start with a test that fails for the expected reason, then the minimum code to pass, then the whole suite. |
| **Root cause first** | A failed verification triggers investigation before a fix. Reproduce, instrument, isolate. After three failed fixes, stop and question the architecture. |
| **Record, don't improvise** | Plan-internal decisions become a logged ruling. Scope, dependency, security and irreversible decisions stop and ask. |

The full rules live in `knowledge/8-verification-discipline.md`, `9-test-first-execution.md`, `10-systematic-debugging.md` and `11-execution-records.md`.

## Where each rule acts

| Phase | Artifact | Rule applied |
|---|---|---|
| Constitution | `constitution.md` | **Execution and evidence** section: test command, test-first policy, allowed exceptions |
| Specify | `spec.md` | **Discovery mode** when the request has no observable outcome, user or verifiable criterion |
| Plan | `plan.md` | **Global Constraints**, **Review Focus**, **Interfaces** per task, plus self-review |
| Tasks | `tasks.md` | `consome:`/`produz:` and the RED→GREEN `passos:` for behavior tasks |
| Implement | code | Test first, verification read before the checkbox, debugging on failure, rulings logged, optional fresh-context review |

## Proportional rigor

- **QUICK** — evidence before claims and root-cause-first on corrections. No formal TDD cycle; the evidence gate still applies.
- **SMALL** — adds test-first for behavior tasks and the task `passos:`.
- **MEDIUM / LARGE** — the full set, plus an optional fresh-context review that is an offer, never a checkpoint.

## What it looks like in the artifacts

```md
## Global Constraints
- Node.js >= 18.18.0
- HTTP responses always JSON; errors use RFC 7807

## Review Focus
- Concurrent export requests sharing the same cursor
```

```md
- [ ] 3. Add the export endpoint
      altera: src/api/export.ts
      consome: buildExportQuery(filter) from task 2
      produz: ExportResponse for task 4
      verifica: npm test -- export.test.ts
      passos:
        1. write failing test (RED)
        2. run and confirm the expected failure
        3. implement the minimum (GREEN)
        4. run and confirm green
```

```md
Ruling: reuse the existing paginator instead of a new cursor helper — it already caps at 100 rows — cost if wrong: one extra refactor in task 4
```

## What does not change

No new skill, no new phase, no new human checkpoint. The order stays `constitution → specify → plan → tasks → implement`. A ruling never authorizes scope changes, new dependencies, destructive operations or external effects — those still stop and ask.
