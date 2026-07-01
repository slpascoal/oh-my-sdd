# 3. How to Create 100% Effective `.md` Specs

Using Markdown (`.md`) files has become the standard ("Lingua Franca") for SDD.

Markdown consumes fewer tokens than structured formats like JSON or XML, and its header structure (`#`, `##`) creates a semantic hierarchy that AI models understand perfectly.

To create highly effective specifications, follow these best practices:

## A. Structure Your Artifacts Hierarchically

In modern SDD, there isn't just one loose file, but a hierarchy of artifacts that guide the AI from the abstract to the operational:

- `constitution.md` (Governance): Contains the immutable laws of the project (e.g., "Always use strict typing", "Never expose API keys").
- `SPEC.md` (The Intention): Defines the "What" and the "Why". It encapsulates business rules and acceptance criteria, remaining agnostic regarding specific technologies.
- `PLAN.md` (The Strategy): Translates the abstract spec into the "How" (architectural decisions, database schemas, library choices).
- `TASKS.md` (The Execution): The breakdown of the plan into atomic, sequential tasks that the AI can execute without losing context.

## B. Use Syntactic Patterns like EARS / GEARS

For natural language to be interpreted flawlessly by agents, use syntactic standardizations like EARS (Easy Approach to Requirements Syntax) or GEARS. They introduce trigger keywords that facilitate logical comprehension by the AI:

- **Event-Driven**: When [trigger], the system shall [action].
- **State-Driven**: While [state], the system shall [action].
- **Unwanted Behavior**: If [network error], the system shall [return a clear message].

## C. Balance the Level of Detail (Avoid extremes)

- **Do not under-specify**: Vague guidelines will cause the AI to hallucinate to try to fill the gaps with generic training data.
- **Do not over-specify (Over-engineering)**: Writing pseudocode takes away the AI's freedom to find the best algorithmic solution. The cost of refining the specification should always be lower than the cost of fixing a wrong implementation. Keep Level 1 (Intention and Contracts) very strict, but allow flexibility in Level 2 (Internal Implementation).

## D. Break Work into Small Deliveries

AI performs much better on smaller tasks. A good SDD-oriented spec should facilitate breaking down the scope so that individual steps can be validated easily.