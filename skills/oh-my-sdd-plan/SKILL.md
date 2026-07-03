---
name: oh-my-sdd-plan
description: Traduz um spec.md já validado em decisões técnicas (plan.md) — arquitetura, esquema de dados/API, bibliotecas — respeitando constitution.md. Geralmente invocada pela skill oh-my-sdd depois do checkpoint de oh-my-sdd-specify.
allowed-tools: Read, Write, Glob, Grep
model: claude-sonnet-5
---

# When to use this skill

Use depois que um `spec.md` já foi validado pelo usuário, para gerar o plano técnico correspondente:

```
/oh-my-sdd-plan <slug-da-feature>
```

# How to use this skill

O argumento é o **slug da feature** — deve corresponder a uma pasta `.oh-my-sdd/specs/<slug>/` com `spec.md` já validado.

> [!IMPORTANT]
> - Não gere `plan.md` se `spec.md` não existir ou estiver visivelmente incompleto — nesse caso, avise quem chamou em vez de inventar conteúdo.
> - Todo o "como" deve respeitar estritamente as restrições de `constitution.md`. Se o spec exigir algo que a constitution proíbe, pare e reporte o conflito em vez de decidir por conta própria.
> - Esta skill não tem checkpoint humano próprio — `plan.md` é validado junto com `tasks.md` na fase seguinte (`oh-my-sdd-tasks`).

# Tool usage flow

## Phase 1 — Ler Spec e Constitution

Execute em paralelo:

1. `Read` em `.oh-my-sdd/specs/<slug>/spec.md`.
2. `Read` em `.oh-my-sdd/constitution.md` do projeto.

## Phase 2 — Gerar `plan.md`

Gere `.oh-my-sdd/specs/<slug>/plan.md` traduzindo o "o quê" do spec no "como" técnico, conforme a definição de `PLAN.md` em `knowledge/3-best-practices-spec.md` (seção A): *"Translates the abstract spec into the how (architectural decisions, database schemas, library choices)"*. Estruture com, no mínimo:

- **Decisões arquiteturais**: como os requisitos funcionais do spec se traduzem em módulos/camadas/fluxos, dentro da stack travada por `constitution.md`.
- **Esquema de dados/API**: formatos, endpoints, tabelas ou contratos afetados.
- **Bibliotecas e dependências**: apenas as já permitidas por `constitution.md`; se precisar de algo novo, justifique explicitamente e sinalize como decisão a confirmar.

Mantenha o nível de detalhe do "como" sem descer a pseudocódigo linha-a-linha — isso é papel da fase de implementação, não do plano (ver `knowledge/3-best-practices-spec.md`, seção C sobre não superespecificar).

Escreva o arquivo e reporte ao chamador que `plan.md` foi gerado, sem pedir validação aqui (isso ocorre na fase de `tasks`).
