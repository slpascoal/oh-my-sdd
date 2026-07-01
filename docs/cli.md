# CLI Reference

`oh-my-sdd` ships a small CLI, invoked via `npx`, that manages the global installation of the 6 skills.

## `install`

```bash
npx oh-my-sdd install
```

Installs (or reinstalls) all 6 skills into `~/.claude/skills/`, along with a copy of the knowledge base inside each one, and writes an integrity manifest at `~/.claude/skills/.oh-my-sdd-manifest.json`. If the skills are already installed, asks for confirmation before reinstalling.

## `status`

```bash
npx oh-my-sdd status
```

Reports:

- Whether `oh-my-sdd` is installed, and the installed package version.
- Which of the 6 skills are present (`✓`) or missing (`✗`).
- Whether any installed file was modified manually since installation (compared against the SHA-256 manifest) — informational only, nothing is overwritten.

## `uninstall`

```bash
npx oh-my-sdd uninstall
```

Asks for confirmation, then removes all 6 skill folders from `~/.claude/skills/` and the manifest file. See [Safety & Data](safety.md) for exactly what this does and doesn't touch.
