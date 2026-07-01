---
name: oh-my-sdd
description: Aplica Spec-Driven Development (SDD) de forma rigorosa antes de implementar qualquer tarefa — consulta a base de conhecimento em knowledge/, gera constitution.md, spec.md, plan.md e tasks.md, e só libera a implementação após validação humana explícita. Use quando o usuário pedir para "aplicar SDD", "criar specs antes de implementar", "seguir spec-driven development", ou fornecer uma tarefa via texto livre ou card/link do Jira que deva ser especificada antes de codar.
allowed-tools: Read, Write, Glob, Grep
---

# When to use this skill

Use sempre que uma tarefa de desenvolvimento deva ser especificada antes de ser implementada:

```
/oh-my-sdd "adicionar endpoint de logout que invalida o refresh token"
/oh-my-sdd PROJ-123
/oh-my-sdd https://empresa.atlassian.net/browse/PROJ-123
```

Também se aplica automaticamente quando o usuário descreve uma nova funcionalidade e pede para seguir SDD, criar specs primeiro, ou trabalhar a partir de um card do Jira sem ainda ter uma especificação escrita.

# How to use this skill

O argumento é **texto livre descrevendo a tarefa** ou **uma chave/URL do Jira** (ex: `PROJ-123`, `https://.../browse/PROJ-123`).

> [!IMPORTANT]
> - **Nunca escreva código de implementação antes dos dois checkpoints humanos das Fases 4 e 5.** Este é o ponto central da skill — pular o checkpoint anula o propósito do SDD.
> - A base de conhecimento em `knowledge/` (ao lado deste arquivo) é a fonte inegociável sobre como estruturar specs. Leia-a antes de escrever qualquer spec, mesmo que já pareça familiar.
> - Nunca sobrescreva `constitution.md` ou specs de features já validadas sem avisar o usuário e obter confirmação explícita.
> - Todas as chamadas de leitura independentes dentro de uma fase DEVEM ser feitas em paralelo.

# Tool usage flow

## Phase 1 — Identificar o Input

**Goal**: determinar se o argumento é uma tarefa em texto livre ou uma referência ao Jira.

1. Se o argumento casar com o padrão de chave do Jira (ex: `[A-Z]+-\d+`) ou for uma URL contendo `/browse/`:
   - Delegue para a skill `jira-fetch` já instalada (ou, na ausência dela, para as tools MCP Atlassian disponíveis como `mcp__atlassian__getJiraIssue`) para obter título, descrição e critérios de aceite do card.
   - Se nenhuma delas estiver disponível, informe o usuário e peça a descrição da tarefa em texto livre.
2. Caso contrário, trate o argumento como a descrição direta da tarefa.

Ao final desta fase você deve ter: um **título de feature** e uma **descrição de intenção** (de onde quer que tenha vindo).

## Phase 2 — Consultar a Base de Conhecimento SDD

**Goal**: carregar o conhecimento inegociável sobre SDD antes de gerar qualquer artefato.

1. Leia `knowledge/0-sdd-index.md` (caminho relativo à pasta desta skill) para confirmar a lista de documentos.
2. Leia, em paralelo, os demais arquivos referenciados por ele: `1-what-is-sdd.md`, `2-goal-of-sdd.md`, `3-best-practices-spec.md`, `4-practical-example.md`, `5-best-practices-constitution.md`, `6-example-constitution.md`.

Esses documentos definem: os três níveis de maturidade do SDD (spec-first, spec-anchored, spec-as-source), a hierarquia `constitution.md → SPEC.md → PLAN.md → TASKS.md`, a sintaxe EARS/GEARS para requisitos, e como equilibrar nível de detalhe (nem vago, nem pseudocódigo). Use-os como referência ativa em todas as fases seguintes — não apenas como leitura de contexto.

## Phase 3 — Constitution do Projeto

**Goal**: garantir que existe uma constituição vigente para o projeto onde a tarefa será implementada.

1. Verifique se `.oh-my-sdd/constitution.md` existe no projeto atual (use `Glob`).
2. **Se não existir**: pergunte ao usuário as decisões-chave — stack de tecnologia permitida, padrões de arquitetura/nomenclatura, guardrails de segurança (segredos, sanitização de input, autenticação) — e gere `.oh-my-sdd/constitution.md` seguindo o modelo de `knowledge/5-best-practices-constitution.md` e o exemplo de `knowledge/6-example-constitution.md`. Use linguagem absoluta ("sempre"/"nunca"), trave a stack, e mantenha o documento restrito a regras globais do repositório (não descreva features aqui).
3. **Se já existir**: leia-o e trate-o como restrição vinculante para todas as fases seguintes. Nunca o sobrescreva sem avisar o usuário e obter confirmação explícita.

## Phase 4 — Gerar `spec.md` (checkpoint humano #1)

**Goal**: produzir a especificação funcional da feature e obter validação antes de seguir.

1. Derive um slug curto em kebab-case a partir do título da feature (ex: "Logout com invalidação de refresh token" → `logout-invalidate-refresh-token`).
2. Verifique se `.oh-my-sdd/specs/<slug>/spec.md` já existe:
   - Se existir, leia o estado atual e trate esta execução como uma **continuação** — não regenere do zero; apresente o conteúdo existente ao usuário e pergunte o que deseja ajustar antes de editar.
   - Se não existir, gere um novo `spec.md`.
3. Estruture o `spec.md` seguindo exatamente o modelo de `knowledge/4-practical-example.md`, guiado pelas boas práticas de `knowledge/3-best-practices-spec.md`:
   - **Intenção e visão geral**: o quê e o porquê, sem detalhes de implementação.
   - **Requisitos funcionais** em sintaxe EARS/GEARS (`When [gatilho], o sistema shall [ação]`, `If [condição indesejada], o sistema shall [resposta]`, `While [estado], o sistema shall [ação]`).
   - **Critérios de aceite** como checklist verificável.
   - **Requisitos não-funcionais e contratos** (segurança, schemas de dados, dependências externas proibidas/permitidas), sempre coerentes com `constitution.md`.
4. Escreva o arquivo em `.oh-my-sdd/specs/<slug>/spec.md`.
5. **Checkpoint bloqueante**: apresente o `spec.md` completo ao usuário e pergunte explicitamente se ele valida esta especificação ou quer ajustes. Não prossiga para a Fase 5 sem uma confirmação clara. Se o usuário pedir ajustes, edite e apresente novamente até a confirmação.

## Phase 5 — Gerar `plan.md` e `tasks.md` (checkpoint humano #2)

**Goal**: traduzir a spec validada em estratégia técnica e tarefas executáveis, com uma segunda validação antes de liberar a implementação.

1. Com `spec.md` validado, gere `.oh-my-sdd/specs/<slug>/plan.md`: decisões arquiteturais, escolha de bibliotecas, esquema de dados/API — o "como", respeitando estritamente `constitution.md`.
2. Gere `.oh-my-sdd/specs/<slug>/tasks.md`: quebra do plano em tarefas atômicas e sequenciais, pequenas o suficiente para serem validadas individualmente (ver `knowledge/3-best-practices-spec.md`, seção "Break Work into Small Deliveries").
3. **Checkpoint bloqueante**: apresente `plan.md` e `tasks.md` ao usuário e aguarde confirmação explícita de que pode iniciar a implementação. Nenhum código de implementação deve ser escrito antes desta confirmação.

## Phase 6 — Implementação

**Goal**: implementar exatamente o que foi especificado e validado, nada além disso.

1. Somente após a confirmação da Fase 5, implemente seguindo `tasks.md` tarefa por tarefa, respeitando as restrições de `constitution.md`.
2. Não introduza requisitos, bibliotecas ou decisões arquiteturais que não constem em `spec.md`/`plan.md`. Se durante a implementação surgir a necessidade de desviar do que foi especificado, pare e avise o usuário antes de continuar — não decida isso silenciosamente.
3. Ao concluir, informe ao usuário quais tarefas de `tasks.md` foram implementadas e quais critérios de aceite de `spec.md` foram atendidos.
