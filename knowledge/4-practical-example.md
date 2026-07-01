# 4. Practical Example of a `SPEC.md`

Below is the structure of a `SPEC.md` file that uses the recommended taxonomy and triggers in the EARS pattern.

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

## The Workflow from this Spec:

After saving this file as `SPEC.md`, the developer provides this document to the AI (such as GitHub Copilot, Claude Code, or Kiro), and the SDD workflow will take over:

1. **Rule Verification**: The AI compares this `SPEC.md` with its local `constitution.md` to check against global guidelines.

2. **Planning**: The AI generates a `PLAN.md` that will define the method signatures (e.g., API design or database schema).

3. **Tasks and Tests (TDAD)**: The AI generates a `TASKS.md` and can autonomously create unit tests before implementation to validate behavior, merging the SDD concept with Test-Driven Development (TDD) validation.

4. **Implementation**: The AI writes the final code in a modular and highly assertive way, staying strictly within the required guardrails.