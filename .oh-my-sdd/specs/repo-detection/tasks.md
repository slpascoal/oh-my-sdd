## Decisões

- **Base existente reaproveitada:** `sensor init` (detect.js) já varre repo e grava sensors.json — esta feature completa: `runtime.json` default, confirmação interativa (inquirer quando TTY, `--yes` para non-interactive) e merge de re-scan.
- **runtime.json default:** `{"autonomous_mode": false}` (documentado; flags futuras entram aqui) — versionado em `.oh-my-sdd/config/`.
- **Re-scan = merge aditivo:** sensors novos detectados entram; nenhum sensor existente é removido nem alterado sem confirmação; entry cujo backing artifact sumiu = sugerida como stale (aviso, não remoção).
- **Projeto sem package.json/stack:** proposta mínima (só runtime.json) + sensors builtin como opcionais + aviso.

## Tasks

- [x] 1. `lib/commands/sensor.js`: init grava `runtime.json` default; confirmação interativa (inquirer) quando TTY sem `--yes`; proposta exibida antes de gravar.
- [x] 2. `lib/commands/sensor.js`: re-scan com config existente = merge aditivo (novos detectados entram, existentes preservados, stale sugerido sem remover); nunca regenera config autorada.
- [x] 3. Verificação executável: fixture Node com tests+tsconfig (3 sensors + runtime.json); fixture sem package.json (proposta mínima + aviso); re-scan com config autorada (novo sensor entra, existente intacto, nada removido).
- [x] 4. README + docs cli EN/PT (sensor init: runtime.json + comportamento de re-scan).
- [x] 5. Commit e push sem tag (fecha a suíte 8/8).
