# Referência de Skills

## `oh-my-sdd` (orquestrador)

**Tools permitidas:** `Read`, `Glob`, `Grep`, `Skill`

Ponto de entrada de todo o fluxo. Ela:

1. Identifica o input — texto livre, ou uma chave/URL do Jira (delegando para `jira-fetch` ou uma tool MCP Atlassian quando disponível).
2. Deriva um slug em kebab-case para a feature e verifica se `.oh-my-sdd/specs/<slug>/` já existe (feature nova vs. retomada).
3. Ativa `oh-my-sdd-constitution`, `oh-my-sdd-specify`, `oh-my-sdd-plan`, `oh-my-sdd-tasks` e `oh-my-sdd-implement`, estritamente nessa ordem, esperando o sinal de cada checkpoint antes de continuar.

Ela nunca gera `constitution.md`, `spec.md`, `plan.md`, `tasks.md`, nem código de implementação diretamente.

## `oh-my-sdd-constitution`

**Tools permitidas:** `Read`, `Write`, `Glob`, `Grep`

Garante que o projeto tenha um `.oh-my-sdd/constitution.md`:

- Se já existir, é lido e confirmado — sem regeneração, sem perguntas.
- Se não existir, a skill analisa `package.json` / `composer.json` / `pyproject.toml` / `go.mod`, configs de lint/formatter, estrutura de pastas e convenções de nomenclatura já existentes para **inferir** a stack e as convenções. Só pergunta ao usuário o que não pode ser inferido com segurança (ex.: guardrails de segurança específicos, dependências externas permitidas/proibidas).
- O documento segue a estrutura e as regras das [boas práticas de constitution](../concepts/constitution-best-practices.md) e do [exemplo prático](../concepts/constitution-example.md): linguagem absoluta ("sempre"/"nunca"), uma persona explícita para o agente, uma stack tecnológica travada, e nenhum conteúdo específico de feature.

## `oh-my-sdd-specify`

**Tools permitidas:** `Read`, `Write`, `Glob`, `Grep`

Gera `.oh-my-sdd/specs/<slug>/spec.md`:

- Trata `constitution.md` como restrição vinculante.
- Se `spec.md` já existir, trata como edição/continuação em vez de regenerar do zero.
- Estrutura o documento exatamente como o [exemplo prático de spec](../concepts/spec-example.md), usando sintaxe EARS/GEARS para requisitos funcionais, um checklist verificável de critérios de aceite, e requisitos não-funcionais/contratos.
- **Checkpoint #1**: apresenta o spec e não devolve o controle ao orquestrador até o usuário validá-lo explicitamente (ou pausar/abandonar explicitamente).

## `oh-my-sdd-plan`

**Tools permitidas:** `Read`, `Write`, `Glob`, `Grep`

Traduz o `spec.md` validado em `.oh-my-sdd/specs/<slug>/plan.md`: decisões arquiteturais, esquema de dados/API e escolha de bibliotecas — o "como" — sempre dentro das restrições de `constitution.md`. Não tem checkpoint próprio; `plan.md` é validado junto com `tasks.md` na fase seguinte.

## `oh-my-sdd-tasks`

**Tools permitidas:** `Read`, `Write`, `Glob`, `Grep`

Quebra `plan.md` em `.oh-my-sdd/specs/<slug>/tasks.md` — tarefas pequenas, atômicas e sequenciais, cada uma verificável de forma independente.

**Checkpoint #2**: apresenta `plan.md` **e** `tasks.md` juntos e não devolve o controle até o usuário confirmar explicitamente que a implementação pode começar.

## `oh-my-sdd-implement`

**Tools permitidas:** `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`

Implementa a feature:

- Lê `tasks.md`, `spec.md` e `constitution.md`; detecta quais tarefas já estão marcadas (suporte a retomada).
- Implementa tarefa por tarefa, respeitando `constitution.md`. Se precisar desviar do que foi especificado, para e pergunta em vez de decidir silenciosamente.
- Marca cada tarefa em `tasks.md` conforme é concluída.
- Reporta quais tarefas foram implementadas e quais critérios de aceite de `spec.md` foram atendidos — comparando o código gerado diretamente contra o checklist.
