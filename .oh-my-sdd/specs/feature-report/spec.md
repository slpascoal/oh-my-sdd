# Spec: Relatório de features SDD (comando report)

## 1. Intenção e Visão Geral

O CLI hoje só mostra status de instalação. Esta feature adiciona `npx oh-my-sdd report`: portfólio de features SDD do projeto atual (slug, fase, progresso de tasks, critérios pendentes) em tabela e JSON.

Prioridade central: estado do SDD legível por humano e por script, sem abrir arquivo por arquivo.

## 2. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** report roda em projeto com `.oh-my-sdd/`, o sistema **shall** varrer `specs/*/` e derivar fase por slug: specify (spec sem plan), plan (plan sem tasks), tasks (tasks pendentes), implement (session ativa em runtime/sessions/), done (todas tasks `[x]`). Prioridade de derivação: session ativa > checkboxes > presença de artefatos.
- **[Req-02]** **When** slug está em implement/done, o sistema **shall** exibir progresso "N/M tarefas" e critérios de aceite pendentes (cruzando "Critérios de Aceite" do spec.md com evidências em runtime/sensors/<slug>/).
- **[Req-03]** **When** flag `--json`, o sistema **shall** emitir JSON (array de {slug, phase, tasks_done, tasks_total, pending_criteria[]}) — schema estável documentado.
- **[Req-04]** **If** `.oh-my-sdd/` não existe, o sistema **shall** exibir "Nenhum SDD neste projeto" e sair 0.
- **[Req-05]** Tabela via chalk, colunas: slug, fase, progresso, pendências; legível em 80 colunas.

## 3. Critérios de Aceite

- [ ] report no próprio repo lista as 8 features da suíte com fase correta.
- [ ] --json parseável por jq.
- [ ] Sem .oh-my-sdd/: mensagem amigável, exit 0.
- [ ] Prioridade de derivação respeitada (session > checkboxes > artefatos).
- [ ] README + docs EN/PT atualizados (comando + schema --json).

## 4. Non-Functional Requirements and Contracts

- Read-only: lê specs/ + runtime/, nunca grava.
- --json schema estável; breaking change = major bump.
- Sem deps runtime novas (chalk cobre tabela).
- Dogfood: o próprio repo é o primeiro usuário do report.
