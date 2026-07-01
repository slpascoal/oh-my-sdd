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
