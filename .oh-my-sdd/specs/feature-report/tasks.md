## Decisões

- **lib/commands/report.js**, comando `report` com flag `--json`; registro no bin.
- **Derivação de fase (prioridade):** session ativa em runtime/sessions/ (in-progress/paused) → `implement`; senão artifacts: tasks.md com pendentes → `tasks`; tasks.md toda `[x]` → `done`; plan.md → `plan`; spec.md → `specify`. QUICK (sem pasta specs/) não aparece no report.
- **Progresso N/M** dos checkboxes de tasks.md; **critérios pendentes** da seção "Critérios de Aceite" do spec.md, cruzados com runtime/sensors/<slug>/ (evidência JSON ou manual-checks com [x] = coberto; coarse-grained v1, documentado).
- Tabela via chalk (80 colunas); --json schema: [{slug, phase, tasks_done, tasks_total, pending_criteria[]}].
- Read-only: nunca grava.

## Tasks

- [x] 1. `lib/commands/report.js`: scanner de specs/*/ com derivação de fase, progresso N/M, critérios pendentes, tabela chalk + --json.
- [x] 2. `bin/oh-my-sdd.js`: registrar `report` + linha de help.
- [x] 3. Verificação executável: report no próprio repo (fases corretas das features da suíte), --json parseável por jq, projeto sem .oh-my-sdd → mensagem amigável exit 0.
- [x] 4. README + docs cli.md/cli.pt.md (seção report; sem página nova, sem nav).
- [ ] 5. Commit e push sem tag.
