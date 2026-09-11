# Spec: Roteamento por escala no orquestrador

## 1. Intenção e Visão Geral

O orquestrador `oh-my-sdd` roda o pipeline completo para qualquer tarefa — typo passa pelo mesmo processo de um sistema de auth. Esta feature adiciona classificação de escala antes da ativação das sub-skills: trivial recebe fluxo enxuto, complexo mantém fluxo completo. Menos cerimônia para o trivial, disciplina intacta para o arriscado.

Prioridade central: adequar cerimônia ao risco. Tarefa pequena nunca paga custo de pipeline completo; tarefa grande nunca escapa dos checkpoints humanos.

## 2. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** o orquestrador recebe uma tarefa e o projeto tem constitution vigente, o sistema **shall** classificar a tarefa em QUICK / SMALL / MEDIUM / LARGE antes de ativar qualquer sub-skill, com critérios explícitos no SKILL.md (arquivos tocados, escopo de negócio, risco de regressão, decisão de design necessária).
- **[Req-02]** **When** a classificação é QUICK (bug fix isolado, typo, 1-2 arquivos, sem decisão de design), o sistema **shall** pular constitution/specify/plan/tasks e ativar `oh-my-sdd-implement` com mini-spec inline (intenção ≤5 linhas + critérios ≤5 itens) gravado em `runtime/`, com checkpoint único de confirmação antes de codar.
- **[Req-03]** **If** durante um fluxo QUICK/SMALL a tarefa excede a escala prevista (mais arquivos/decisões), o sistema **shall** parar, reclassificar para cima e retomar o pipeline da fase apropriada — nunca crescer silenciosamente dentro de QUICK.
- **[Req-04]** **When** a classificação é SMALL (1 feature isolada, 3-10 arquivos, design já coberto pela constitution), o sistema **shall** rodar constitution (confirmação) + specify condensado (Intenção + EARS + critérios, sem seções extras) + tasks com seção "Decisões" embutida (plan embutido em tasks.md), mantendo os 2 checkpoints humanos obrigatórios.
- **[Req-05]** **When** a classificação é MEDIUM (decisões de design, 10-30 arquivos) ou LARGE (sistemas/compliance/mudança ampla), o sistema **shall** rodar o pipeline completo atual, sem alteração.
- **[Req-06]** **If** o usuário discorda da classificação, o sistema **shall** aceitar override explícito e registrá-lo em `runtime/`; o modelo pode reclassificar para cima a qualquer momento, mas nunca rebaixa escala sem override do usuário.
- **[Req-07]** **When** classificando, o sistema **shall** exibir classificação + motivo em uma linha ("escala SMALL — motivo: 1 feature, ~5 arquivos, sem decisão de design") e registrá-la em `runtime/`.

##  critérios

## 3. Critérios de Aceite

- [ ] Tarefa QUICK (ex: corrigir typo em mensagem) classifica e roda mini-spec + checkpoint único, sem abrir pasta `specs/`.
- [ ] Tarefa MEDIUM roda pipeline completo idêntico ao atual.
- [ ] Escape de escala (QUICK que cresce) dispara reclassificação visível ao usuário.
- [ ] Override do usuário é respeitado e registrado.
- [ ] Classificação + motivo aparecem em uma linha na saída.
- [ ] README e docs EN/PT descrevem os 4 níveis e critérios.

## 4. Non-Functional Requirements and Contracts

- **Skills only:** implementação é alteração de SKILL.md do orquestrador + specify condensado; sem código CLI novo obrigatório.
- **Registro:** classificação e overrides em `.oh-my-sdd/runtime/scale.json` (gitignored).
- **Coerência:** QUICK mantém checkpoint humano obrigatório (constitution: implement nunca começa sem confirmação explícita).
- **Docs:** README/docs EN+PT sempre atualizados junto com a mudança de skill.
