## Decisões

- **Estado de sessão via regra de skill, sem CLI novo:** implement grava/atualiza `runtime/sessions/<slug>.json` com a tool `Write` — formato contratual do spec (slug, fase, taskIndex, taskCount, timestamps, status).
- **tasks.md continua fonte de verdade formal** (checkboxes); session.json é progresso fino/retomada — divergência = sync (marcar checkboxes de tarefas realmente concluídas).
- **.gitignore garantido pelo orquestrador** no primeiro uso do fluxo (idempotente), não pelo instalador — evita tocar em projetos sem SDD.
- **Arquivamento:** todas as tarefas `[x]` + sensors passaram (ou sem sensors.json) → session movida para `runtime/sessions/archived/`.
- Corrupção/ausência de runtime: reconstruir de tasks.md e seguir (Req-06); session de slug inexistente: descartar com aviso (Req-08).

## Tasks

- [x] 1. `skills/oh-my-sdd-implement/SKILL.md`: Fase 1 — retomada lê `runtime/sessions/<slug>.json` (se existir) e reporta estado ("feature X, N/M tarefas"); gravação inicial do session no início da execução.
- [x] 2. `skills/oh-my-sdd-implement/SKILL.md`: Fase 2 — atualizar session.json (taskIndex, updated) imediatamente após cada checkbox marcado; gravação `Write` explícita.
- [x] 3. `skills/oh-my-sdd-implement/SKILL.md`: Fase 3 — arquivamento da session ao fechar feature (specs/<slug>/ + sensors ok); regra de reconstrução quando runtime ausente/corrompido; descarte com aviso de session órfã.
- [x] 4. `skills/oh-my-sdd/SKILL.md`: Fase 2 — passo novo garantindo `.oh-my-sdd/runtime/` no .gitignore do projeto alvo (idempotente, nunca remove entradas), e apresentação do layout (specs/+config/ versionados, runtime/ gitignored).
- [x] 5. README + docs EN/PT: layout de diretórios `.oh-my-sdd/` (specs/config versionados, runtime gitignored) + session/retomada.
- [x] 6. Verificação: leitura integral, coerência dos 3 SKILL.md/alvos, CA-1..CA-6 do spec cobertos; evidência em manual-checks.md.
