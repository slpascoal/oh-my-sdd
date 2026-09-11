# Spec: Separação de estado de runtime

## 1. Intenção e Visão Geral

Hoje `.oh-my-sdd/` mistura artefatos versionáveis (spec/plan/tasks) com estado efêmero. Esta feature separa três camadas: artefatos (versionados), config (versionados) e runtime (gitignored) — progresso de execução, evidências e sessão deixam de poluir o git diff e o checkbox do tasks.md deixa de ser o único mecanismo de estado.

Prioridade central: artefato versionado é fonte de verdade do design; runtime é estado efêmero de execução, nunca commitado.

## 2. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** o fluxo SDD inicializa qualquer estado em um projeto alvo, o sistema **shall** usar o layout: `.oh-my-sdd/specs/` (versionado), `.oh-my-sdd/config/` (versionado), `.oh-my-sdd/runtime/` (gitignored — sessions/, sensors/, traces/, scale.json).
- **[Req-02]** **When** o implement inicia uma execução, o sistema **shall** gravar `.oh-my-sdd/runtime/sessions/<slug>.json` com: slug, fase atual, índice da tarefa em execução, timestamps (started/updated), e atualizá-lo a cada tarefa concluída.
- **[Req-03]** **When** o implement é retomado, o sistema **shall** ler o session.json e reportar estado ("feature X, 3/7 tarefas, tarefa 4 em execução") antes de agir.
- **[Req-04]** **When** todas as tarefas terminam e sensors passam, o sistema **shall** arquivar o session (mover para `runtime/sessions/archived/` ou marcar status done).
- [Req-05] **When** a instalação/primeiro uso em um projeto alvo, o sistema **shall** garantir entrada em `.gitignore` cobrindo `.oh-my-sdd/runtime/` (adicionar se ausente, nunca remover entradas existentes).
- **[Req-06]** **If** runtime/ está ausente ou corrompido, o sistema **shall** reconstruir estado mínimo a partir de tasks.md (checkboxes) e seguir — runtime é cache, tasks.md continua sendo fonte de verdade dos checkboxes.
- [Req-07] **When** reportando progresso, o sistema **shall** tratar session.json como fonte de progresso fino e tasks.md como fonte de progresso formal; divergência = sync (marca checkboxes de tarefas realmente concluídas).
- **[Req-08]** **If** um runtime session existe mas specs/<slug>/ foi removido, o sistema **shall** descartar o session com aviso.

## 3. Critérios de Aceite

- [ ] Implement grava session.json e o atualiza a cada tarefa (verificável por inspeção).
- [ ] .gitignore do projeto alvo ganha entrada runtime/ na inicialização, idempotente.
- [ ] Retomada lê session e reporta "3/7 tarefas" sem re-ler todo histórico.
- [ ] Runtime corrompido/ausente: fluxo continua reconstruindo de tasks.md.
- [ ] runtime/ nunca aparece em git status (gitignored).
- [ ] README + docs EN/PT atualizados com o layout de diretórios.

## 4. Non-Functional Requirements and Contracts

- **tasks.md é fonte de verdade formal** (checkboxes); runtime é otimização — nunca inverter essa relação.
- **Sem dependências runtime novas**; escrita de session via código lib ou regra em SKILL.md.
- **Layout contratual:** specs/ + config/ versionados; runtime/ gitignored — documentado em README/docs.
- **Coerência:** session-hooks (feature 5) consome este formato de session.json.
