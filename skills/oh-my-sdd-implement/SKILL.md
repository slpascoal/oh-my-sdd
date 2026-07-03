---
name: oh-my-sdd-implement
description: Implementa uma feature seguindo estritamente tasks.md e as restrições de constitution.md, marcando o progresso em tasks.md e reportando os critérios de aceite de spec.md atendidos. Só deve ser ativada depois que os checkpoints humanos de oh-my-sdd-specify e oh-my-sdd-tasks tiverem sido confirmados. Geralmente invocada pela skill oh-my-sdd.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
model: claude-haiku-4-5
---

# When to use this skill

Use depois que `spec.md`, `plan.md` e `tasks.md` de uma feature já foram validados pelo usuário, para efetivamente implementar o código:

```
/oh-my-sdd-implement <slug-da-feature>
```

# How to use this skill

O argumento é o **slug da feature** — deve corresponder a uma pasta `.oh-my-sdd/specs/<slug>/` com `spec.md`, `plan.md` e `tasks.md` já validados.

> [!IMPORTANT]
> - Não introduza requisitos, bibliotecas ou decisões arquiteturais que não constem em `spec.md`/`plan.md`. Se notar necessidade de desviar do especificado, **pare e avise o usuário** em vez de decidir silenciosamente.
> - Respeite estritamente as restrições de `constitution.md` (stack travada, padrões de código, guardrails de segurança) durante toda a implementação.
> - Marque cada tarefa como concluída em `tasks.md` (`- [x]`) imediatamente após implementá-la, não em lote no final.

# Tool usage flow

## Phase 1 — Ler Contexto e Detectar Retomada

Execute em paralelo:

1. `Read` em `.oh-my-sdd/specs/<slug>/tasks.md`.
2. `Read` em `.oh-my-sdd/specs/<slug>/spec.md`.
3. `Read` em `.oh-my-sdd/constitution.md` do projeto.

Verifique quais tarefas de `tasks.md` já têm checkbox marcado (`- [x]`) — essas são consideradas concluídas de uma execução anterior; não as reimplemente, apenas confirme rapidamente que ainda estão coerentes com o código atual antes de seguir.

## Phase 2 — Implementar Tarefa por Tarefa

1. Percorra as tarefas pendentes de `tasks.md`, na ordem em que aparecem.
2. Para cada tarefa: implemente exatamente o que ela descreve, usando `Read`/`Edit`/`Write`/`Bash` conforme necessário (ex: rodar testes, instalar dependências já previstas em `plan.md`), respeitando `constitution.md`.
3. Ao concluir a tarefa, marque seu checkbox em `tasks.md` (`Edit`).
4. Se, durante a implementação, perceber que a tarefa exige algo fora do que `spec.md`/`plan.md` previram: **pare imediatamente**, explique o conflito ao usuário e aguarde orientação antes de continuar.

## Phase 3 — Reportar Resultado

Ao concluir todas as tarefas (ou ao pausar por um conflito), reporte ao usuário/chamador:

1. Quais tarefas de `tasks.md` foram implementadas nesta execução.
2. Quais critérios de aceite de `spec.md` (seção "Critérios de Aceite") foram atendidos — comparando explicitamente o código gerado contra cada item do checklist, no espírito do loop de validação descrito em `knowledge/2-goal-of-sdd.md` (*"AI agents can compare the code they generate directly against the acceptance criteria listed in the specification"*).
3. Critérios de aceite que ainda não puderam ser verificados ou que ficaram pendentes.
