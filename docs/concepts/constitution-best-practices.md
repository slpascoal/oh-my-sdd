# Best Practices for Creating an Effective `constitution.md`

To ensure that the AI understands and respects your project's rules, follow these guidelines:

- **Be absolute and direct (use "Always" and "Never")**: Avoid vague suggestions. Use obligation verbs to create rigid guardrails. For example, instead of "try to keep the code secure", use "Never expose secrets or API keys in client code" or "Always use strict typing".
- **Define the agent's persona (system prompt)**: Establish right at the beginning what the role of the AI agent is (e.g., "You are a strict Senior Software Engineer"). This creates a "Reality Tunnel", forcing the AI to act within this level of demand and preventing it from assuming undocumented requirements.
- **Lock the technology stack**: Clearly specify the allowed languages, frameworks, and libraries. This prevents the AI from hallucinating non-existent packages or bringing in unwanted dependencies. (If the project migrates technology in the future, simply change this file and the AI will adopt the new standard.)
- **Establish code and architecture standards**: Document naming conventions, directory structure, and preferred design patterns, such as "Prefer composition over inheritance".
- **Keep the focus global (do not specify features here)**: The `constitution.md` is not the place to describe how the login screen works; that belongs in the `SPEC.md`. This document should only contain rules that apply to the entire repository.

`oh-my-sdd-constitution` applies these rules automatically: it analyzes your project's real stack and conventions first, and only asks you about what genuinely can't be inferred — see the [practical example](constitution-example.md) it follows.
