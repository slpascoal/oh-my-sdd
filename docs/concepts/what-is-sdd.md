# What is Spec-Driven Development (SDD)?

Spec-Driven Development (SDD) is a software engineering methodology where **structured specifications take the role of the main source of truth** for a project, rather than the source code itself.

With the rise of Generative AI agents that generate code in bulk, the market realized that the trial-and-error approach, dubbed "Vibe Coding", creates hard-to-maintain code that accumulates technical debt. SDD emerges as the structured answer to this scenario, treating AI not as an improvising assistant, but as an executor of formalized intentions, operating within explicit contracts and well-defined boundaries.

## Three levels of maturity

SDD can be categorized into three levels of maturity:

- **Spec-first**: The specification is written first to guide the AI, but is not necessarily updated after the code is generated.
- **Spec-anchored**: The specification and code coexist; when the system evolves, the specification is updated simultaneously, serving as a continuous basis for maintenance.
- **Spec-as-source**: The specification is the only artifact edited by humans. Autonomous agents automatically generate and regenerate the source code from any changes made to it.

`oh-my-sdd` operates at the **spec-anchored** level: every feature keeps its `spec.md`, `plan.md`, and `tasks.md` alongside the code in `.oh-my-sdd/specs/<slug>/`, so the specification stays a living reference rather than a one-off planning document.
