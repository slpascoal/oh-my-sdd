## Decisões

- **Dispatch em lib/commands/hook.js** (subcomandos install/uninstall/dispatch) — sem lib/hooks/ separada: dispatch é ~80 linhas, cabe no mesmo arquivo.
- **Gatilho por evento do stdin JSON do host** (`hook_event_name`: SessionStart/Stop) — sem flag --event; host manda tudo.
- **Detección de sessão ativa:** varre `runtime/sessions/*.json` (excluindo archived/), status in-progress/paused; progresso N/M do próprio session (taskIndex/taskCount), fallback parse de tasks.md.
- **Fail-silent:** try/catch global → exit 0 sem saída; stdin cap 8MiB; saída ≤10 linhas de texto plano (host decide como injetar).
- **install --with-hooks / hook install:** merge por evento em `.claude/settings.json` do projeto (cwd), preservando hooks de terceiros; uninstall remove só entradas cujo command contém `oh-my-sdd hook dispatch`.
- **Comando do hook:** `npx -y oh-my-sdd hook dispatch` — resolve em qualquer projeto sem path absoluto.

## Tasks

- [x] 1. `lib/commands/hook.js`: subcomando dispatch — lê stdin JSON (cap 8MiB, spawnSync indireto via stdin do processo), detecta SessionStart/Stop, varre sessions ativas, imprime hint ≤10 linhas ou silêncio; fail-silent total (exit 0).
- [x] 2. `lib/commands/hook.js`: subcomandos install/uninstall — merge por evento em `.claude/settings.json` do cwd preservando terceiros; uninstall remove apenas entradas próprias; idempotente.
- [x] 3. `bin/oh-my-sdd.js` + `lib/commands/install.js`: registrar comando hook; flag `--with-hooks` no install chama a mesma rotina de merge após instalar skills.
- [x] 4. Verificação executável real: fixture em /tmp com session ativa + tasks.md → dispatch com stdin SessionStart e Stop (saída esperada); settings.json pré-populado com hook de terceiros → install mantém + adiciona o nosso; uninstall remove só o nosso; sem session → silêncio.
- [x] 5. README (seção "Session hooks") + docs EN/PT (instalação opcional de hooks + comportamento).
- [ ] 6. Commit e push sem tag (passo final do usuário).
