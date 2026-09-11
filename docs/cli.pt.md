# Referência da CLI

O `oh-my-sdd` traz uma CLI pequena, invocada via `npx`, que gerencia a instalação global das 6 skills.

## `install`

```bash
npx oh-my-sdd install
```

Instala (ou reinstala) as 6 skills em `~/.claude/skills/`, junto com uma cópia da base de conhecimento dentro de cada uma, e grava um manifest de integridade em `~/.claude/skills/.oh-my-sdd-manifest.json`. Se as skills já estiverem instaladas, pede confirmação antes de reinstalar.

## `status`

```bash
npx oh-my-sdd status
```

Reporta:

- Se o `oh-my-sdd` está instalado, e a versão do pacote instalada.
- Quais das 6 skills estão presentes (`✓`) ou ausentes (`✗`).
- Se algum arquivo instalado foi modificado manualmente desde a instalação (comparado contra o manifest SHA-256) — apenas informativo, nada é sobrescrito.

## `uninstall`

```bash
npx oh-my-sdd uninstall
```

Pede confirmação, depois remove as 6 pastas de skill de `~/.claude/skills/` e o arquivo de manifest. Veja [Segurança e Dados](safety.md) para saber exatamente o que isso toca e o que não toca.

## `sensor`

```bash
npx oh-my-sdd sensor init --yes
npx oh-my-sdd sensor run <feature-slug>
npx oh-my-sdd sensor status <feature-slug>
```

Verificação executável para features SDD. Sensors são comandos reais (detectados automaticamente por stack ou editados por você) que **provam** — em vez de presumir — a integridade do código após a implementação.

### `sensor init`

Varre o projeto (qualquer stack: Node, Python, Go, Rust, Java) e grava `.oh-my-sdd/config/sensors.json` com os comandos resolvidos para sua stack:

| Sensor | Detecta | Exemplos de comando resolvido |
|---|---|---|
| `tests-passing` | `package.json` `scripts.test`, pytest, go.mod, Cargo.toml, pom.xml, gradle | `npm test`, `pytest`, `go test ./...`, `cargo test` |
| `typecheck-clean` | tsconfig/jsconfig, pyrightconfig, mypy, Cargo.toml | `npx tsc --noEmit`, `pyright`, `mypy .`, `cargo check` |
| `lint` | eslint/biome, ruff, golangci, flake8, clippy | `npx eslint .`, `ruff check .`, `golangci-lint run` |

Sensors detectados ficam `required: true`; não detectados permanecem opcionais e são pulados com motivo em runtime. Edite o arquivo para mudar comandos, timeouts ou obrigatoriedade — é a fonte única de verdade.

Também garante `.oh-my-sdd/runtime/` no `.gitignore` (nunca commitado).

### `sensor run <slug>`

Roda cada sensor declarado para o slug da feature e grava evidências JSON em `.oh-my-sdd/runtime/sensors/<slug>/` (comando, exit code, duração, saída truncada, timestamp, fingerprint). Sai 1 e imprime a saída da falha se qualquer sensor `required` falhar — é o gate bloqueante que a skill `oh-my-sdd-implement` roda antes do relatório final.

### `sensor status <slug>`

Tabela read-only de evidências por sensor, incluindo se cada evidência ainda é válida contra o fingerprint atual do código. Editar arquivo rastreado após sensor passar **expira a evidência** — re-execute para renovar.

### Evidência de critérios de aceite

A skill `oh-my-sdd-implement` só pode reportar um critério de aceite como atendido com evidência: sensor passando (mapeado em `criteria` do `sensors.json`) ou nota de verificação manual em `.oh-my-sdd/runtime/sensors/<slug>/manual-checks.md`. Critérios sem nenhum dos dois são reportados como **pendente de verificação** — nunca como atendidos.

## `report`

```bash
npx oh-my-sdd report [--json]
```

Tabela de portfólio de todas as features SDD do projeto atual: slug, fase atual, progresso de tarefas (`N/M`) e critérios de aceite pendentes. Prioridade de derivação de fase: session ativa em runtime > checkboxes de `tasks.md` > presença de artefatos. Com `--json`, emite array estável de `{slug, phase, tasks_done, tasks_total, pending_criteria}` (schema documentado; breaking change = major). Read-only — em projeto sem `.oh-my-sdd/`, mensagem amigável e exit 0.
