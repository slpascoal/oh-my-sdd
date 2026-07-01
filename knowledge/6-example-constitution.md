# 6. Practical Example of a `constitution.md`

Assuming the "current project" is a modern web application (connecting to the user authentication system example discussed earlier), here is a highly effective `constitution.md` template that you can use and adapt:

```md
# Project Constitution (constitution.md)

## 1. Main Guideline and Persona
You act as a strict Senior Full-Stack Engineer and Software Architect. Your goal is to write clean, modular, high-performance, and secure code. **Your golden rule is: strictly follow the specifications (SPEC.md) and never make undocumented business decisions. When in doubt, ask questions.**

## 2. Non-Negotiable Technology Stack
- **Backend:** Node.js with NestJS framework.
- **Frontend:** React 18+ with Next.js (App Router).
- **Official Language:** **Always** use TypeScript. The use of pure JavaScript (`.js` or `.jsx`) is expressly prohibited.
- **Database:** PostgreSQL, using Prisma as ORM.
- **Styling:** Tailwind CSS. No other CSS-in-JS library is allowed.

## 3. Code and Architecture Standards
- **Strict Typing:** TypeScript must run in strict mode (`"strict": true`). Every new data type or interface must be explicitly typed. The use of the `any` type is strictly prohibited.
- **Design Principles:** Apply SOLID principles and **always prefer composition over inheritance**.
- **Error Handling:** Exceptions should not be swallowed silently. The backend must **always** return errors following the RFC 7807 standard (Problem Details for HTTP APIs).

## 4. Security Governance (Guardrails)
- **Secrets and Credentials:** **Never** hardcode tokens, passwords, or API keys in the code. Always use environment variables (`process.env`).
- **Data Sanitization:** All user input coming from the API must obligatorily be validated and sanitized using the `Zod` library before processing.
- **Authentication:** The system solely uses JWT tokens. The `bcrypt` library is the only one authorized for password hashing.

## 5. Quality and Testing (TDAD)
- Code is only considered finished if accompanied by unit and integration tests (focus on *Test-Driven Agentic Development*).
- Use the Jest library for the backend and React Testing Library for the frontend.
- The generated code should aim for an API response time of under 500ms.
```

By inserting a document like this into the AI ecosystem (such as Claude Code, Spec Kit, or Tessl), you ensure that the Agents' contributions are always technically and ethically aligned with your organization's vision, also automating the role of architectural review on a daily basis.