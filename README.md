# oh-my-sdd

Conjunto de skills globais do Claude Code que aplicam **Spec-Driven Development (SDD)** de forma rigorosa: antes de implementar qualquer tarefa, o Claude analisa o projeto, gera `constitution.md` → `spec.md` → `plan.md` → `tasks.md`, com validação humana obrigatória antes de liberar a implementação.

## Instalação

```bash
npx oh-my-sdd install
```

Isso instala as 6 skills globalmente em `~/.claude/skills/`, disponíveis em qualquer projeto aberto no Claude Code — a instalação não depende do diretório em que o comando é executado.

## Arquitetura

Uma skill orquestradora (`oh-my-sdd`) ativa, em sequência, 5 skills especializadas — uma por fase do SDD:

| Skill | Responsabilidade |
|---|---|
| `oh-my-sdd` | Orquestra o fluxo, identifica o input (texto livre ou Jira) e ativa as demais em ordem |
| `oh-my-sdd-constitution` | Analisa o projeto (stack, convenções, lint) e gera/confirma `.oh-my-sdd/constitution.md`, perguntando ao usuário só o que não puder inferir |
| `oh-my-sdd-specify` | Gera `spec.md` em EARS/GEARS — **checkpoint humano #1** |
| `oh-my-sdd-plan` | Traduz o spec validado em decisões técnicas (`plan.md`) |
| `oh-my-sdd-tasks` | Quebra o plano em tarefas atômicas (`tasks.md`) — **checkpoint humano #2** |
| `oh-my-sdd-implement` | Implementa tarefa por tarefa, só depois dos dois checkpoints confirmados |

Cada skill instalada é autocontida: recebe sua própria cópia de [`knowledge/`](./knowledge), a base de conhecimento sobre SDD (níveis de maturidade, sintaxe EARS/GEARS, hierarquia de artefatos, exemplos práticos) que fundamenta como cada fase gera seu documento.

## Uso

Depois de instalada, o fluxo é descoberto automaticamente pelo Claude Code sempre que uma tarefa deva ser especificada antes de implementada. Também pode ser invocado diretamente:

```
/oh-my-sdd "adicionar endpoint de logout que invalida o refresh token"
/oh-my-sdd PROJ-123
/oh-my-sdd https://empresa.atlassian.net/browse/PROJ-123
```

## Outros comandos

```bash
npx oh-my-sdd status      # mostra quais das 6 skills estão instaladas e se algum arquivo foi modificado manualmente
npx oh-my-sdd uninstall   # remove as 6 skills de ~/.claude/skills/
```

## Base de conhecimento

A pasta [`knowledge/`](./knowledge) documenta os fundamentos do SDD usados por cada skill: níveis de maturidade (spec-first, spec-anchored, spec-as-source), boas práticas para escrever specs e constitutions, sintaxe EARS/GEARS e exemplos práticos completos.

## Licença

MIT
