# Exemplo Prático de um `SPEC.md`

Abaixo está a estrutura de um arquivo `SPEC.md` que usa a taxonomia recomendada e os gatilhos do padrão EARS — a mesma estrutura que a `oh-my-sdd-specify` segue ao gerar `.oh-my-sdd/specs/<slug>/spec.md`.

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

## O fluxo de trabalho a partir dessa spec

Depois que esse `spec.md` é validado no checkpoint #1, o `oh-my-sdd` avança para:

1. **Verificação de regras** — a `oh-my-sdd-plan` compara a spec com o `constitution.md` para checar contra as diretrizes globais.
2. **Planejamento** — a `oh-my-sdd-plan` gera um `plan.md` que define assinaturas de método, design de API e esquema de banco de dados.
3. **Tasks** — a `oh-my-sdd-tasks` gera um `tasks.md`, quebrando o plano em tarefas atômicas e sequenciais, e então pausa para o checkpoint #2.
4. **Implementação** — a `oh-my-sdd-implement` escreve o código final de forma modular, permanecendo estritamente dentro dos limites definidos por `spec.md`, `plan.md` e `constitution.md`.
