---
name: oh-my-sdd-implement
description: Implementa uma feature seguindo estritamente tasks.md e as restrições de constitution.md, marcando o progresso em tasks.md e reportando os critérios de aceite de spec.md atendidos. Só deve ser ativada depois que os checkpoints humanos de oh-my-sdd-specify e oh-my-sdd-tasks tiverem sido confirmados. Geralmente invocada pela skill oh-my-sdd.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# When to use this skill

Use depois que `spec.md`, `plan.md` e `tasks.md` de uma feature já foram validados pelo usuário, para efetivamente implementar o código:

```
/oh-my-sdd-implement <slug-da-feature>
```

# How to use this skill

O argumento é o **slug da feature** — deve corresponder a uma pasta `.oh-my-sdd/specs/<slug>/` com `spec.md`, `plan.md` e `tasks.md` já validados. O orquestrador também pode ativar esta skill em **modo QUICK**, passando um mini-spec inline (sem pasta `specs/<slug>/`).

> [!IMPORTANT]
> - Não introduza requisitos, bibliotecas ou decisões arquiteturais que não constem em `spec.md`/`plan.md`. Se notar necessidade de desviar do especificado, **pare e avise o usuário** em vez de decidir silenciosamente.
> - Respeite estritamente as restrições de `constitution.md` (stack travada, padrões de código, guardrails de segurança) durante toda a implementação.
> - Aplique `knowledge/7-change-hygiene.md` durante toda a edição de código: premissas explícitas, mínimo que resolve, diff cirúrgico e verificação antes de concluir.
> - Aplique `knowledge/8-verification-discipline.md` (sem evidência fresca, sem claim), `knowledge/9-test-first-execution.md` (teste que falhou primeiro para tarefas de comportamento), `knowledge/10-systematic-debugging.md` (causa raiz antes da correção) e `knowledge/11-execution-records.md` (rulings internos registrados).
> - Marque cada tarefa como concluída em `tasks.md` (`- [x]`) imediatamente após implementá-la **e após executar a verificação declarada, lendo output e exit code** — nunca em lote no final.

# Tool usage flow

> [!IMPORTANT]
> - **Modo QUICK (mini-spec inline):** não há `specs/<slug>/` nem `tasks.md` — o escopo é o mini-spec recebido. Implemente respeitando `constitution.md`; derive um pseudo-slug do título para sensors. Aplique os guardrails A (premissas, se houver ambiguidade real), B (mínimo que resolve) e C (diff cirúrgico) de `knowledge/7-change-hygiene.md`, mais a disciplina de evidência (`knowledge/8`) e causa raiz em correção (`knowledge/10`). TDD formal e verificação por tarefa são substituídos pelo gate de evidência da Fase 3, que roda **somente se** `.oh-my-sdd/config/sensors.json` existir.
> - **Escape de escala:** se durante a implementação a tarefa exceder o escopo previsto (mais arquivos, mais decisões de design, escopo do mini-spec/tasks insuficiente), **pare imediatamente**, explique ao usuário que a tarefa excedeu a escala prevista e aguarde reclassificação pelo orquestrador — **nunca** cresça silenciosamente dentro de QUICK.

## Phase 1 — Ler Contexto e Detectar Retomada

Execute em paralelo:

Em modo QUICK, pule os itens 1-2 (não existem) e leia apenas a constitution (item 3), implementando contra o mini-spec.

1. `Read` em `.oh-my-sdd/specs/<slug>/tasks.md`.
2. `Read` em `.oh-my-sdd/specs/<slug>/spec.md`.
3. `Read` em `.oh-my-sdd/constitution.md` do projeto.
4. `Read` em `.oh-my-sdd/runtime/sessions/<slug>.json` — **se existir**, reporte o estado antes de agir: "feature <slug>, N/M tarefas concluídas, retomando da tarefa N+1". Se o slug do session não tiver pasta em `specs/`, o session está órfão: descarte com aviso ao usuário.
5. `Read` em `.oh-my-sdd/runtime/sessions/<slug>.rulings.md` — **se existir**, carregue as decisões já registradas antes de tocar código.

Verifique quais tarefas de `tasks.md` já têm checkbox marcado (`- [x]`) — essas são consideradas concluídas de uma execução anterior; não as reimplemente, apenas confirme rapidamente que ainda estão coerentes com o código atual antes de seguir.

**Session de execução (fonte de progresso fino):** no início da execução, grave via `Write` em `.oh-my-sdd/runtime/sessions/<slug>.json`:

```json
{"slug": "<slug>", "phase": "implement", "taskIndex": 0, "taskCount": <M>, "startedAt": "<ISO-8601>", "updatedAt": "<ISO-8601>", "status": "in-progress"}
```

Se o session não existir ou estiver corrompido (JSON inválido, campos ausentes), **reconstrua** a partir dos checkboxes de `tasks.md` e siga — runtime é cache; `tasks.md` é a fonte de verdade formal. Se divergirem (ex: session diz tarefa 5, checkboxes dizem 3), confie nos checkboxes e sincronize o session.

## Phase 2 — Implementar Tarefa por Tarefa

1. Percorra as tarefas pendentes de `tasks.md`, na ordem em que aparecem.
2. **Antes da primeira edição de cada tarefa:** leia a seção "Premissas e Ambiguidades" do `spec.md`, o campo `verifica:` da tarefa e os rulings já registrados. Se a tarefa for ambígua na prática, **pare e pergunte** — nunca preencha a lacuna em silêncio.
3. **Tarefa que muda comportamento:** siga `knowledge/9-test-first-execution.md` — escreva o teste que falha, confirme a falha, implemente o mínimo, confirme o verde. Tarefa de configuração, documentação ou geração pode usar verificação por inspeção declarada em `verifica:`.
4. Para cada tarefa: implemente exatamente o que ela descreve, usando `Read`/`Edit`/`Write`/`Bash` conforme necessário (ex: rodar testes, instalar dependências já previstas em `plan.md`), respeitando `constitution.md` e os guardrails B (mínimo que resolve) e C (diff cirúrgico) de `knowledge/7-change-hygiene.md`.
5. **Antes de marcar a tarefa como concluída:** execute a verificação declarada em `verifica:` e **leia o output e o exit code** (`knowledge/8-verification-discipline.md`). Se passar, marque o checkbox em `tasks.md` (`Edit`), registre no session e **imediatamente** atualize `taskIndex`/`updatedAt` (`Write`) — nunca em lote no final.
6. **Se a verificação falhar:** aplique as quatro fases de `knowledge/10-systematic-debugging.md` — causa raiz antes de qualquer correção. Corrija um problema por vez e rode a verificação novamente. Se três correções falharem, **pare**, reporte o padrão observado e a hipótese arquitetural, e aguarde o usuário — nunca tente a quarta correção sozinho.
7. **Decisão interna ao plano:** registre em `.oh-my-sdd/runtime/sessions/<slug>.rulings.md` no formato `Ruling: <decisão> — <motivo> — <custo se errado>` e continue. **Se a decisão envolver escopo, dependência, segurança, operação irreversível, efeito externo ou conflito com `spec.md`/`constitution.md`: pare e pergunte** — nunca vira ruling.
8. Se a tarefa não tiver campo `verifica:` (tasks antigas), derive uma verificação concreta antes de marcar como concluída; sem verificação executada, a tarefa permanece pendente.
9. Se, durante a implementação, perceber que a tarefa exige algo fora do que `spec.md`/`plan.md` previram — incluindo arquivo fora do campo `altera:` — **pare imediatamente**, explique o conflito ao usuário e aguarde orientação antes de continuar. Nunca reverta ou amplie escopo silenciosamente.

## Phase 3 — Gate de evidência e relatório final

Ao concluir todas as tarefas (ou ao pausar por um conflito), **antes de qualquer relatório final** — e após o gate passar:

**Arquivamento da session:** com todas as tarefas `[x]` e sensors obrigatórios passando (ou sem `sensors.json`), mova o session para `.oh-my-sdd/runtime/sessions/archived/<slug>.json` com `"status": "done"` — assim sessões novas não retomam features fechadas. Se pausou por conflito, mantenha o session com `"status": "paused"` e o motivo.

**Review opcional (MEDIUM/LARGE):** antes dos sensors, ofereça revisão de contexto fresco usando a skill `code-review` (ou comando equivalente do ambiente), passando `spec.md`, `plan.md`, `tasks.md` e o diff da feature. Se o usuário aceitar, corrija findings **Critical/Important** em um único passe, cada correção verificada por teste que falhou primeiro, e rode a suíte. Review é oferta, não checkpoint; findings Minor vão para o relatório.

1. Execute `npx oh-my-sdd sensor run <slug>` (via `Bash`). Este comando roda os sensors declarados em `.oh-my-sdd/config/sensors.json` e grava evidências em `.oh-my-sdd/runtime/sensors/<slug>/`.
2. **Gate bloqueante:** se qualquer sensor `required: true` falhar, **não emita o relatório final** — apresente a saída do sensor ao usuário, sugira a correção e só re-emita o relatório após nova execução com passagem. Sensor obrigatório que não pode executar (comando inexistente/timeout) também bloqueia, com motivo claro.
3. Para cada critério da seção "Critérios de Aceite" do `spec.md`, classifique com evidência:
   - **Atendido** — somente se um sensor (mapeado em `criteria` do `sensors.json` ou logicamente ligado) passou, ou se existir nota de verificação manual em `.oh-my-sdd/runtime/sensors/<slug>/manual-checks.md`.
   - **Pendente de verificação** — sem sensor que o prove nem nota manual. **Nunca** reporte como atendido.
4. Então reporte ao usuário/chamador:
   1. Quais tarefas de `tasks.md` foram implementadas nesta execução.
   2. Critérios de aceite **atendidos com evidência** (sensor + resultado) — comparando o código gerado contra cada item do checklist, no espírito do loop de validação descrito em `knowledge/2-goal-of-sdd.md` (*"AI agents can compare the code they generate directly against the acceptance criteria listed in the specification"*).
   3. Critérios **pendentes de verificação** (sem evidência) — explícitos, nunca silenciados.
5. Se um critério for verificável manualmente, registre a nota em `.oh-my-sdd/runtime/sensors/<slug>/manual-checks.md` (formato: `- [ ] <critério> — verificado manualmente, <data>`); só critérios com nota registrada podem ser reportados como atendidos sem sensor.
