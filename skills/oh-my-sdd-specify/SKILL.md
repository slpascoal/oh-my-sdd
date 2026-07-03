---
name: oh-my-sdd-specify
description: Gera a especificação funcional (spec.md) de uma feature em .oh-my-sdd/specs/<slug>/spec.md, usando a sintaxe EARS/GEARS e a estrutura de knowledge/4-practical-example.md, e obtém validação humana explícita antes de liberar a fase de planejamento. Geralmente invocada pela skill oh-my-sdd depois do checkpoint de constitution.
allowed-tools: Read, Write, Glob, Grep
model: claude-sonnet-5
---

# When to use this skill

Use para gerar ou editar a especificação funcional de uma feature já identificada:

```
/oh-my-sdd-specify <slug-da-feature> "<título/descrição da feature>"
```

# How to use this skill

O argumento é o **slug da feature** (kebab-case) e, opcionalmente, o título/descrição — necessário na primeira geração, opcional em continuações.

> [!IMPORTANT]
> - **Nunca retorne o controle para quem a chamou antes do checkpoint da Fase 4 ser confirmado pelo usuário.** Este é o ponto central da skill.
> - Se `.oh-my-sdd/specs/<slug>/spec.md` já existir, trate como edição/continuação — nunca regenere do zero silenciosamente.
> - `constitution.md` é restrição vinculante: nada no spec pode contradizê-la.

# Tool usage flow

## Phase 1 — Ler Contexto Vinculante

Execute em paralelo:

1. `Read` em `.oh-my-sdd/constitution.md` do projeto (se existir) — trate como restrição vinculante para tudo que for gerado.
2. `Glob`/`Read` em `.oh-my-sdd/specs/<slug>/spec.md` para verificar se já existe uma versão anterior.

## Phase 2 — Continuação ou Geração Nova

- **Se `spec.md` já existe**: apresente o conteúdo atual ao usuário e pergunte explicitamente o que deseja ajustar. Edite com base na resposta antes de seguir para o checkpoint (Fase 4).
- **Se não existe**: prossiga para a Fase 3.

## Phase 3 — Gerar `spec.md`

Estruture o documento seguindo **exatamente** o modelo de `knowledge/4-practical-example.md`:

1. **Intenção e Visão Geral** — o quê e o porquê, sem detalhes de implementação.
2. **Requisitos Funcionais** em sintaxe EARS/GEARS (ver `knowledge/3-best-practices-spec.md`, seção B):
   - Event-Driven: `**When** [gatilho], o sistema **shall** [ação].`
   - Unwanted Behavior: `**If** [condição indesejada], o sistema **shall** [resposta].`
   - State-Driven: `**While** [estado], o sistema **shall** [ação].`
3. **Critérios de Aceite** como checklist verificável (`- [ ] ...`).
4. **Requisitos Não-Funcionais e Contratos** — segurança, schema de dados, dependências externas proibidas/permitidas — sempre coerentes com `constitution.md`.

Ao balancear o nível de detalhe, siga `knowledge/3-best-practices-spec.md` seção C: seja estrito na intenção e nos contratos (Nível 1), mas não escreva pseudocódigo de implementação (isso é papel de `plan.md`/`tasks.md`, Nível 2).

Escreva em `.oh-my-sdd/specs/<slug>/spec.md`.

## Phase 4 — Checkpoint Bloqueante

Apresente o `spec.md` completo ao usuário e pergunte explicitamente: "Você valida esta especificação, ou quer ajustes?"

- Se pedir ajustes: edite e apresente novamente. Repita até validação explícita.
- Se validar: reporte ao chamador "spec validado" e finalize — quem a chamou (a skill `oh-my-sdd`) prossegue para `oh-my-sdd-plan`.
- Se o usuário quiser pausar/abandonar: reporte isso ao chamador em vez de "validado".
