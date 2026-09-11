## Tasks

- [x] 1. `skills/oh-my-sdd/SKILL.md`: adicionar "Fase 2.5 — Classificar Escala" com tabela de critérios QUICK/SMALL/MEDIUM/LARGE, saída em uma linha (classificação + motivo), gravação de `.oh-my-sdd/runtime/scale.json`, e regras de override (usuário pode forçar; modelo só sobe escala).
- [x] 2. `skills/oh-my-sdd/SKILL.md`: fluxo QUICK — mini-spec (≤5 linhas + ≤5 critérios) em scale.json, checkpoint único antes de codar, ativação do implement em modo QUICK; fluxo SMALL — constitution (confirmação) + specify condensado + tasks com Decisões, 2 checkpoints mantidos.
- [x] 3. `skills/oh-my-sdd-specify/SKILL.md`: modo condensado para `scale=SMALL` — gera spec com Intenção + EARS + Critérios apenas; checkpoint de validação inalterado.
- [x] 4. `skills/oh-my-sdd-tasks/SKILL.md`: modo `scale=SMALL` — lê spec.md sem exigir plan.md, gera tasks.md com seção "Decisões" (plan embutido); checkpoint inalterado.
- [x] 5. `skills/oh-my-sdd-implement/SKILL.md`: modo QUICK (recebe mini-spec inline do orquestrador, sem specs/<slug>/, gate de sensors apenas se sensors.json existir) + detecção de escape de escala (para, reporta ao orquestrador para reclassificar para cima).
- [x] 6. Verificar: leitura integral dos 4 SKILL.md alterados (coerência de contratos entre skills), simulação dos 4 fluxos de escala contra CA-1..CA-5, confirmação de que pipeline MEDIUM/LARGE está byte-idêntico ao atual.
- [x] 7. README.md (seção "Adaptive scale") + docs EN/PT (seção em conceitos/getting-started, sem página nova).
