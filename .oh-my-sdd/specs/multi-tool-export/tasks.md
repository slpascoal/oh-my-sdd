## Decisões

- **lib/commands/export.js** + **lib/templates/sdd-rules/rules.md** (conteúdo destilado, tool-agnostic, <200 linhas).
- **Mapa de superfícies:** cursor → `.cursor/rules/oh-my-sdd.mdc` (own-file); windsurf → `.windsurf/rules/oh-my-sdd.md` (own-file); zed → `.zed/rules/oh-my-sdd.md` (own-file); codex → seção marcada em `AGENTS.md`; gemini → seção marcada em `GEMINI.md`.
- **Marcadores de seção:** `<!-- oh-my-sdd:start -->` / `<!-- oh-my-sdd:end -->` — re-run substitui só o trecho próprio (idempotente), nunca toca conteúdo de terceiros.
- `<tool>` inválido → lista suportadas, exit 1. Sem precondição de Claude Code no conteúdo.
- Verificação executável em fixture /tmp (own-file, merge idempotente, AGENTS.md pré-existente, tool inválida).

## Tasks

- [x] 1. `lib/templates/sdd-rules/rules.md`: workflow SDD destilado — pipeline constitution→spec→plan→tasks→implement, checkpoints obrigatórios, layout `.oh-my-sdd/`, restrição da constitution, critérios com evidência.
- [x] 2. `lib/commands/export.js`: mapa de superfícies (own-file vs marked-section), write idempotente, `export <tool>` com validação.
- [x] 3. `bin/oh-my-sdd.js`: registrar `export` + help.
- [x] 4. Verificação executável em fixture: cursor own-file; codex em AGENTS.md pré-existente (merge + re-run idempotente); inválido → exit 1; conteúdo sem menção a Claude Code como precondição.
- [x] 5. README + docs cli EN/PT (seção export com tabela de superfícies).
- [ ] 6. Commit e push sem tag.
