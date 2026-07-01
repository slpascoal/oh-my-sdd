# oh-my-sdd

Skill global do Claude Code que aplica **Spec-Driven Development (SDD)** de forma rigorosa: antes de implementar qualquer tarefa, o Claude consulta uma base de conhecimento sobre SDD e gera `constitution.md` → `spec.md` → `plan.md` → `tasks.md`, com validação humana obrigatória antes de liberar a implementação.

## Instalação

```bash
npx oh-my-sdd install
```

Isso instala a skill globalmente em `~/.claude/skills/oh-my-sdd/`, disponível em qualquer projeto aberto no Claude Code — a instalação não depende do diretório em que o comando é executado.

## Uso

Depois de instalada, a skill é descoberta automaticamente pelo Claude Code sempre que uma tarefa deva ser especificada antes de implementada. Também pode ser invocada diretamente:

```
/oh-my-sdd "adicionar endpoint de logout que invalida o refresh token"
/oh-my-sdd PROJ-123
/oh-my-sdd https://empresa.atlassian.net/browse/PROJ-123
```

O fluxo:

1. **Identifica o input** — texto livre ou uma chave/URL do Jira (usa a skill `jira-fetch` ou tools MCP Atlassian para buscar o card, se disponíveis).
2. **Consulta `knowledge/`** — a base inegociável sobre SDD, EARS/GEARS e a hierarquia de specs.
3. **Garante uma `constitution.md`** no projeto (`.oh-my-sdd/constitution.md`), criando-a na primeira vez se não existir.
4. **Gera `spec.md`** da feature e **para para validação humana** antes de continuar.
5. **Gera `plan.md` e `tasks.md`** e **para novamente** antes de liberar a implementação.
6. **Implementa** estritamente o que foi especificado e validado.

## Outros comandos

```bash
npx oh-my-sdd status      # mostra se está instalado e se algum arquivo foi modificado manualmente
npx oh-my-sdd uninstall   # remove a skill de ~/.claude/skills/oh-my-sdd/
```

## Base de conhecimento

A pasta [`knowledge/`](./knowledge) documenta os fundamentos do SDD usados pela skill: níveis de maturidade (spec-first, spec-anchored, spec-as-source), boas práticas para escrever specs e constitutions, sintaxe EARS/GEARS e exemplos práticos completos.

## Licença

MIT
