# Guia Rápido

Depois de [instalado](installation.md), abra o Claude Code em qualquer projeto e dê uma tarefa através da skill orquestradora.

## Partindo de texto livre

```
/oh-my-sdd "adicionar endpoint de logout que invalida o refresh token"
```

## Partindo de um card do Jira

```
/oh-my-sdd PROJ-123
/oh-my-sdd https://empresa.atlassian.net/browse/PROJ-123
```

Se a skill [`jira-fetch`](https://github.com) ou uma tool MCP Atlassian estiver disponível, o `oh-my-sdd` busca automaticamente o título, a descrição e os critérios de aceite do card. Caso contrário, ele pede que você cole a descrição da tarefa.

## O que acontece depois

1. **Constitution** — se seu projeto ainda não tem `.oh-my-sdd/constitution.md`, o Claude analisa seu código (stack, configs de lint, convenções já existentes) e o gera, perguntando só o que não conseguiu inferir. Se já existir, esta etapa é apenas uma confirmação.
2. **Specify** — o Claude gera `.oh-my-sdd/specs/<slug>/spec.md` usando sintaxe EARS/GEARS, e então **para e pede para você validar**.
3. **Plan** — depois do spec validado, o Claude gera `.oh-my-sdd/specs/<slug>/plan.md` — o "como" arquitetural.
4. **Tasks** — o Claude quebra o plano em `.oh-my-sdd/specs/<slug>/tasks.md`, e então **para novamente e pede confirmação antes de qualquer código ser escrito**.
5. **Implement** — só depois dessa segunda confirmação, o Claude implementa as tarefas uma a uma, marcando cada uma como concluída, e reporta quais critérios de aceite de `spec.md` foram atendidos.

## Retomando uma feature

Se você rodar `/oh-my-sdd` de novo com a mesma tarefa, o Claude detecta a pasta `.oh-my-sdd/specs/<slug>/` já existente e trata como continuação — mostrando o spec/plan/tasks atuais e perguntando o que você quer ajustar, em vez de começar do zero.

## Saiba mais

- [Visão Geral da Arquitetura](../architecture/overview.md) — como as 6 skills se encaixam
- [Referência de Skills](../architecture/skills.md) — o que cada skill faz em detalhe
- [Conceitos de SDD](../concepts/what-is-sdd.md) — a metodologia por trás de tudo
