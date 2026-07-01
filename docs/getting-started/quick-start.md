# Quick Start

Once [installed](installation.md), open Claude Code in any project and give it a task through the orchestrator skill.

## Starting from free text

```
/oh-my-sdd "add a logout endpoint that invalidates the refresh token"
```

## Starting from a Jira card

```
/oh-my-sdd PROJ-123
/oh-my-sdd https://company.atlassian.net/browse/PROJ-123
```

If the [`jira-fetch`](https://github.com) skill or an Atlassian MCP tool is available, `oh-my-sdd` fetches the issue's title, description, and acceptance criteria automatically. Otherwise, it asks you to paste the task description.

## What happens next

1. **Constitution** — if your project doesn't have `.oh-my-sdd/constitution.md` yet, Claude analyzes your codebase (stack, lint config, existing conventions) and generates it, asking you only what it couldn't infer. If it already exists, this step is a no-op confirmation.
2. **Specify** — Claude generates `.oh-my-sdd/specs/<slug>/spec.md` using EARS/GEARS syntax, then **stops and asks you to validate it**.
3. **Plan** — once the spec is validated, Claude generates `.oh-my-sdd/specs/<slug>/plan.md` — the architectural "how".
4. **Tasks** — Claude breaks the plan into `.oh-my-sdd/specs/<slug>/tasks.md`, then **stops again and asks you to confirm before any code is written**.
5. **Implement** — only after that second confirmation, Claude implements the tasks one by one, checking off each as it completes it, and reports which acceptance criteria from `spec.md` were met.

## Resuming a feature

If you run `/oh-my-sdd` again with the same task, Claude detects the existing `.oh-my-sdd/specs/<slug>/` folder and treats it as a continuation — showing you the current spec/plan/tasks and asking what you'd like to adjust, instead of starting over.

## Learn more

- [Architecture Overview](../architecture/overview.md) — how the 6 skills fit together
- [Skills Reference](../architecture/skills.md) — what each skill does in detail
- [SDD Concepts](../concepts/what-is-sdd.md) — the methodology behind it all
