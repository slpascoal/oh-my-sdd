# Plan: Gates de evidência com sensors

## 1. Decisões Arquitecturais

- **Execução de sensors vive no CLI, não na skill.** Skills são markdown puro (constitution §2); o implement invoca `npx oh-my-sdd sensor run <slug>` via Bash. O CLI é o único lugar com `child_process` e escrita de evidências.
- **Módulo novo `lib/sensors/`** com três responsabilidades: `detect.js` (detecção de repo → proposta sensors.json), `runner.js` (execução não-interactiva + evidência), `evidence.js` (leitura/validação de evidências, fingerprint, status).
- **Comando `sensor`** com subcomandos: `sensor init` (detect + escreve config), `sensor run <slug>`, `sensor status <slug>`. Registro em `bin/oh-my-sdd.js`.
- **Fingerprint para expiração de evidência (Req-08b):** hash sha256 de `git rev-parse HEAD` + `git status --porcelain` (repo git) ou, sem git, hash de mtimes de arquivos fonte (glob `**/*.{js,ts,json,md}` limitado a 500 arquivos). Evidência válida só se fingerprint bate com o atual.
- **Skip por artefacto ausente (Req-03b):** runner pré-checa por tipo builtin — tests-passing sem runner de teste detectado → skip; typecheck-clean sem artefacto de typecheck → skip; lint sem linter → skip. Custom sensors sempre rodam.
- **Detecção por stack (personalizada, não hardcoded):** `detect.js` resolve comandos REAIS por stack e grava no sensors.json — config gerada é concreta, visível e editável. Matriz: tests (package.json scripts.test → pytest/pyproject → go.mod → Cargo.toml → pom.xml → build.gradle); typecheck (tsconfig/jsconfig → pyrightconfig/mypy.ini → Cargo.toml); lint (eslint/biome → ruff.toml → .golangci.yml → flake8 → Cargo.toml clippy). Fallback hardcoded (npm test etc.) só quando sensor declarado sem command E detecção falha. Execução é agnóstica de stack — spawn roda qualquer comando no cwd do projeto alvo.
- **Gate no skill implement:** antes do relatório final, implement roda `sensor run`; se algum required falha → bloquea, mostra saída, sugere correção; só re-emite relatório após pass. Critérios sem evidencia nem nota manual → "pendente de verificação".
- **.gitignore:** `sensor init` garante `.oh-my-sdd/runtime/` no .gitignore do projeto (idempotente, nunca remove entradas existentes).

## 2. Esquema de Dados

### sensors.json (config, versionado)
```json
{
  "sensors": {
    "tests-passing": { "command": "npm test", "required": true, "timeout": 300 },
    "typecheck-clean": { "command": "npx tsc --noEmit", "required": true, "timeout": 120 },
    "lint": { "command": "npx eslint .", "required": false, "timeout": 60 }
  },
  "criteria": {
    "<feature-slug>": {
      "<critério exato>": { "sensor": "tests-passing" }
    }
  }
}
```
- `command` opcional: ausente → default builtin (tests-passing → script test do package.json, senão `npm test`; typecheck-clean → `npx tsc --noEmit`; lint → `npx eslint .`).
- `criteria` mapea critério de aceite do spec → sensor; opcional, populado por `sensor init` heurístico + edição manual.

### Evidencia (runtime, gitignored) — `.oh-my-sdd/runtime/sensors/<slug>/<sensor>.json`
```json
{
  "sensor": "tests-passing",
  "command": "npm test",
  "status": "passed | failed | skipped | timeout",
  "exitCode": 0,
  "durationMs": 1234,
  "output": "últimas 50 linhas / 4KB",
  "timestamp": "2026-09-11T...Z",
  "fingerprint": "sha256...",
  "reason": "motivo de skip/falha (opcional)"
}
```

### manual-checks.md — `.oh-my-sdd/runtime/sensors/<slug>/manual-checks.md`
Lista critérios verificados manualmente: `- [ ] <critério> — verificado manualmente, <data>`.

## 3. Bibliotecas e Dependências

- **Nenhuna dependência runtime nova** (constitution §2). `child_process`, `crypto` (sha256), `fs` — builtins.
- chalk (existente) para tabela de `sensor status`.

## 4. Contratos de Comando

- `npx oh-my-sdd sensor init` — detecta repo (cwd), propone sensors.json, exibe achados, grava após confirmação (--yes para non-interactive).
- `npx oh-my-sdd sensor run <slug>` — roda sensors declarados para <slug>; exit 0 se todos required passaram, 1 se algum required falhou; imprime resultado por sensor.
- `npx oh-my-sdd sensor status <slug>` — tabela: sensor, status, exit code, duração, fingerprint válido?; leitura-only.

## 5. Estrategia de Verificación (test plan)

- **CA-1 (detecção):** repo fixture com tests+tsconfig → `sensor init` propone 3 sensors corretos.
- **CA-2 (gate):** sensor required propositadamente falhando → `sensor run` exit 1 e skill implement bloquea report.
- **CA-3 (pendente):** critério sem evidencia → implement reporta "pendente de verificação".
- **CA-4 (evidencia):** inspecionar JSON em runtime/sensors/ — campos completos.
- **CA-5 (comando inexistente):** sensor custom com comando inexistente → failed con motivo, exit 1.
- **CA-6 (fingerprint):** rodar sensor, modificar fuente, `sensor status` muestra evidencia expirada.

## 6. Documentación (sempre junto à implementação)

- README.md: sección "Sensors e evidencia" (config, comandos, gate).
- docs/ EN + PT: página o sección nova; mkdocs.yml nav se página nova.
- skills/oh-my-sdd-implement/SKILL.md: Fase 3 reescrita com gate de evidencia.
