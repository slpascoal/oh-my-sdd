# 2. What is the Goal of SDD?

The main goal of SDD is to **elevate the level of abstraction in development**, shifting the developer's focus from "writing code" to becoming an "architect of intention".

By adopting this approach, the aims are to:

- **Provide rich context to AI**: An AI without context acts like an intern on their first day of work. Specs provide the background and project rules, reducing the chance of the AI inventing inappropriate solutions (hallucinations).
- **Avoid technical debt and Context Drift**: It prevents AI from breaking the system when trying to fix bugs without understanding the global architecture, and fights the silent accumulation of problems in AI-generated codebases.
- **Eliminate ambiguity**: AI models try to fill gaps in vague instructions (e.g., "improve user experience") without warning. SDD enforces the provision of clear and precise operational limits.
- **Enable validation loops**: AI agents can compare the code they generate directly against the acceptance criteria listed in the specification (Verifier Agent), approving the implementation even before human review.