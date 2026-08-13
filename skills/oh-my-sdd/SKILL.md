---
name: oh-my-sdd
description: Orquestra o fluxo completo de Spec-Driven Development (SDD) para uma tarefa — ativa, em sequência, as skills oh-my-sdd-constitution, oh-my-sdd-specify, oh-my-sdd-plan, oh-my-sdd-tasks e oh-my-sdd-implement, respeitando os checkpoints humanos de cada uma. Use quando o usuário pedir para "aplicar SDD", "spec-driven development", "criar specs antes de implementar", ou fornecer uma tarefa via texto livre ou card/link do Jira que deva ser especificada antes de codar.
allowed-tools: Read, Glob, Grep, Skill
---

# When to use this skill

Use como ponto de entrada sempre que uma tarefa de desenvolvimento deva passar pelo ciclo completo de SDD antes de ser implementada:

```
/oh-my-sdd "adicionar endpoint de logout que invalida o refresh token"
/oh-my-sdd PROJ-123
/oh-my-sdd https://empresa.atlassian.net/browse/PROJ-123
```

Também se aplica automaticamente quando o usuário descreve uma nova funcionalidade e pede para seguir SDD, criar specs primeiro, ou trabalhar a partir de um card do Jira sem ainda ter uma especificação escrita.

# How to use this skill

O argumento é **texto livre descrevendo a tarefa** ou **uma chave/URL do Jira** (ex: `PROJ-123`, `https://.../browse/PROJ-123`).

> [!IMPORTANT]
> - Esta skill é só o orquestrador. **Nunca gere `constitution.md`, `spec.md`, `plan.md`, `tasks.md`, nem escreva código de implementação diretamente aqui** — cada artefato e cada checkpoint humano pertence à sub-skill responsável por ele.
> - Ative as sub-skills sempre na mesma ordem: `oh-my-sdd-constitution` → `oh-my-sdd-specify` → `oh-my-sdd-plan` → `oh-my-sdd-tasks` → `oh-my-sdd-implement`. Não pule etapas nem execute em paralelo — cada uma depende do artefato validado pela anterior.
> - Só avance para a próxima sub-skill quando a anterior sinalizar explicitamente que seu artefato foi validado pelo usuário (quando aplicável).

# Tool usage flow

## Phase 1 — Identificar o Input

**Goal**: determinar se o argumento é uma tarefa em texto livre ou uma referência ao Jira.

1. Se o argumento casar com o padrão de chave do Jira (ex: `[A-Z]+-\d+`) ou for uma URL contendo `/browse/`:
   - Ative a skill `jira-fetch` já instalada (ou, na ausência dela, use as tools MCP Atlassian disponíveis como `mcp__atlassian__getJiraIssue`) para obter título, descrição e critérios de aceite do card.
   - Se nenhuma delas estiver disponível, informe o usuário e peça a descrição da tarefa em texto livre.
2. Caso contrário, trate o argumento como a descrição direta da tarefa.

Ao final desta fase você deve ter um **título de feature** e uma **descrição de intenção**.

## Phase 2 — Derivar Slug e Detectar Continuação

**Goal**: identificar se esta é uma feature nova ou a retomada de uma já iniciada.

1. Derive um slug curto em kebab-case a partir do título (ex: "Logout com invalidação de refresh token" → `logout-invalidate-refresh-token`).
2. Use `Glob` para verificar se `.oh-my-sdd/specs/<slug>/` já existe no projeto atual.
3. Informe ao usuário, em uma linha, se está iniciando uma feature nova ou retomando uma existente.

## Phase 3 — Ativar `oh-my-sdd-constitution`

Ative a skill `oh-my-sdd-constitution` (via ferramenta `Skill`) passando o contexto do projeto atual. Ela decide internamente se precisa gerar a constitution ou apenas confirmar que já existe — sempre a ative, mesmo em retomada.

## Phase 4 — Ativar `oh-my-sdd-specify`

Ative a skill `oh-my-sdd-specify` passando o título/descrição da feature e o slug derivado na Fase 2. Ela é responsável pelo checkpoint humano de validação do `spec.md`. **Só prossiga para a Fase 5 quando ela reportar que o spec foi validado pelo usuário.** Se ela reportar que o usuário abandonou/pausou, pare aqui e informe o usuário.

## Phase 5 — Ativar `oh-my-sdd-plan`

Ative a skill `oh-my-sdd-plan` passando o slug. Ela gera `plan.md` a partir do `spec.md` validado — sem checkpoint próprio.

## Phase 6 — Ativar `oh-my-sdd-tasks`

Ative a skill `oh-my-sdd-tasks` passando o slug. Ela é responsável pelo checkpoint humano de validação de `plan.md` + `tasks.md`. **Só prossiga para a Fase 7 quando ela reportar confirmação explícita do usuário para implementar.**

## Phase 7 — Ativar `oh-my-sdd-implement`

Ative a skill `oh-my-sdd-implement` passando o slug. Ao final, repasse ao usuário o resumo que ela retornar (tarefas implementadas e critérios de aceite atendidos).
