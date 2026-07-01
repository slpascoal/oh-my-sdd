# oh-my-sdd

A set of global Claude Code skills that rigorously enforce **Spec-Driven Development (SDD)**: before implementing any task, Claude analyzes the project, generates `constitution.md` → `spec.md` → `plan.md` → `tasks.md`, with mandatory human validation before implementation is allowed to start.

## Installation

```bash
npx oh-my-sdd install
```

This installs the 6 skills globally in `~/.claude/skills/`, available in any project opened in Claude Code — installation does not depend on the directory the command is run from.

## Architecture

An orchestrator skill (`oh-my-sdd`) activates, in sequence, 5 specialized skills — one per SDD phase:

| Skill | Responsibility |
|---|---|
| `oh-my-sdd` | Orchestrates the flow, identifies the input (free text or Jira) and activates the others in order |
| `oh-my-sdd-constitution` | Analyzes the project (stack, conventions, lint) and generates/confirms `.oh-my-sdd/constitution.md`, asking the user only what it can't infer |
| `oh-my-sdd-specify` | Generates `spec.md` in EARS/GEARS — **human checkpoint #1** |
| `oh-my-sdd-plan` | Translates the validated spec into technical decisions (`plan.md`) |
| `oh-my-sdd-tasks` | Breaks the plan into atomic tasks (`tasks.md`) — **human checkpoint #2** |
| `oh-my-sdd-implement` | Implements task by task, only after both checkpoints are confirmed |

Each installed skill is self-contained: it gets its own copy of [`knowledge/`](./knowledge), the SDD knowledge base (maturity levels, EARS/GEARS syntax, artifact hierarchy, practical examples) that underpins how each phase generates its document.

## Usage

Once installed, the flow is automatically discovered by Claude Code whenever a task should be specified before being implemented. It can also be invoked directly:

```
/oh-my-sdd "add a logout endpoint that invalidates the refresh token"
/oh-my-sdd PROJ-123
/oh-my-sdd https://company.atlassian.net/browse/PROJ-123
```

## Other commands

```bash
npx oh-my-sdd status      # shows which of the 6 skills are installed and whether any file was manually modified
npx oh-my-sdd uninstall   # removes the 6 skills from ~/.claude/skills/
```

## Knowledge base

The [`knowledge/`](./knowledge) folder documents the SDD fundamentals used by every skill: maturity levels (spec-first, spec-anchored, spec-as-source), best practices for writing specs and constitutions, EARS/GEARS syntax, and complete practical examples.

## License

MIT
