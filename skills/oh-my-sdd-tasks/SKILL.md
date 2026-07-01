---
name: oh-my-sdd-tasks
description: Quebra um plan.md validado em tasks.md com tarefas atômicas e sequenciais, e obtém confirmação humana explícita (junto com o plan.md) antes de liberar a implementação. Geralmente invocada pela skill oh-my-sdd depois de oh-my-sdd-plan.
allowed-tools: Read, Write, Glob, Grep
---

# When to use this skill

Use depois que `plan.md` já foi gerado, para quebrá-lo em tarefas executáveis e obter o segundo checkpoint humano do fluxo SDD antes de qualquer implementação:

```
/oh-my-sdd-tasks <slug-da-feature>
```

# How to use this skill

O argumento é o **slug da feature** — deve corresponder a uma pasta `.oh-my-sdd/specs/<slug>/` com `plan.md` já existente.

> [!IMPORTANT]
> - **Nunca retorne o controle para quem a chamou antes do checkpoint da Fase 3 ser confirmado pelo usuário.** Nenhuma implementação deve começar sem essa confirmação.
> - Tarefas devem ser pequenas o bastante para serem validadas individualmente — não crie tarefas grandes e vagas.

# Tool usage flow

## Phase 1 — Ler Plan e Spec

Execute em paralelo:

1. `Read` em `.oh-my-sdd/specs/<slug>/plan.md`.
2. `Read` em `.oh-my-sdd/specs/<slug>/spec.md`.

## Phase 2 — Gerar `tasks.md`

Quebre `plan.md` em uma lista de tarefas atômicas e sequenciais, cada uma pequena o bastante para ser implementada e validada isoladamente, seguindo `knowledge/3-best-practices-spec.md`, seção D ("Break Work into Small Deliveries" — *"AI performs much better on smaller tasks... facilitate breaking down the scope so that individual steps can be validated easily"*).

Formate como checklist markdown, uma tarefa por linha, na ordem de execução:

```markdown
## Tasks

- [ ] 1. <tarefa atômica>
- [ ] 2. <tarefa atômica>
...
```

Cada tarefa deve deixar claro o que muda e onde (arquivo/módulo), sem virar pseudocódigo — o "como" detalhado de cada tarefa é resolvido durante a implementação, respeitando `plan.md`.

Escreva `.oh-my-sdd/specs/<slug>/tasks.md`.

## Phase 3 — Checkpoint Bloqueante

Apresente **`plan.md` e `tasks.md` juntos** ao usuário e pergunte explicitamente: "Confirma que pode iniciar a implementação com este plano e esta lista de tarefas?"

- Se pedir ajustes: edite `plan.md` e/ou `tasks.md` e apresente novamente. Repita até confirmação explícita.
- Se confirmar: reporte ao chamador "plano e tasks validados, pode implementar" e finalize — quem a chamou (a skill `oh-my-sdd`) prossegue para `oh-my-sdd-implement`.
- Se o usuário quiser pausar/abandonar: reporte isso ao chamador em vez de "validado".
