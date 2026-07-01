# Practical Example of a `SPEC.md`

Below is the structure of a `SPEC.md` file that uses the recommended taxonomy and triggers in the EARS pattern — the same structure `oh-my-sdd-specify` follows when generating `.oh-my-sdd/specs/<slug>/spec.md`.

```md
# Spec: User Authentication System

## 1. Intention and Overview
The system requires a secure authentication module to protect private resources. The central priority is to ensure that passwords are never stored in plain text and that the login API response time is under 500ms.

## 2. Functional Requirements (EARS/GEARS Pattern)
- **[Req-01]** **When** the user submits a valid email and password, the system **shall** generate and return a JWT token valid for 24 hours.
- **[Req-02]** **If** the provided password is incorrect, the system **shall** return an HTTP 401 Unauthorized code with a generic error message ("Invalid credentials").
- **[Req-03]** **While** the network is unstable, the system **shall** make up to 3 connection attempts to the database before failing.
- **[Req-04]** **Optional:** **Where** applicable, the system **may** offer a "Remember me" option, extending the JWT to 7 days.

## 3. Acceptance Criteria
- [ ] All endpoints return strict JSON format.
- [ ] The generated JWT token contains the user's `role` embedded in the payload.
- [ ] Session creation logs activity (without exposing sensitive data) in the project's standard format.

## 4. Non-Functional Requirements and Constraints (Contracts)
- **Security:** Password hashing MUST obligatorily use the `bcrypt` library.
- **Data Schema (Input):**
  - `email`: string (required, regex validation)
  - `password`: string (required, minimum of 8 characters)
- **External Dependencies:** Using third-party identity providers (like Google/Facebook) is prohibited in this version.
```

## The workflow from this spec

After this `spec.md` is validated at checkpoint #1, `oh-my-sdd` moves on to:

1. **Rule verification** — `oh-my-sdd-plan` compares the spec against `constitution.md` to check it against global guidelines.
2. **Planning** — `oh-my-sdd-plan` generates a `plan.md` that defines method signatures, API design, and database schema.
3. **Tasks** — `oh-my-sdd-tasks` generates a `tasks.md`, breaking the plan into atomic, sequential tasks, then pauses for checkpoint #2.
4. **Implementation** — `oh-my-sdd-implement` writes the final code in a modular way, staying strictly within the guardrails set by `spec.md`, `plan.md`, and `constitution.md`.
