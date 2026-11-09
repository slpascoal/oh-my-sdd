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

- Se já existir, é lido e confirmado — sem regeneração, sem perguntas. Um pedido explícito de regeneração/merge varre as fontes de novo e propõe um **diff**, nunca regenera do zero (suas edições manuais ficam intocadas).
- **Fontes primeiro:** a skill varre `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.windsurfrules`, `CONTRIBUTING.md`, configs de lint/format da raiz e `.github/workflows/` em ordem fixa, extraindo regras **com citação da fonte**. Regras conflitantes entre fontes são listadas e perguntadas — nunca resolvidas silenciosamente.
- Depois analisa o código (`package.json` / `composer.json` / `pyproject.toml` / `go.mod`, estrutura de pastas, convenções de nomenclatura) para preencher lacunas, perguntando ao usuário só o que nem fontes nem código resolveram (tipicamente ≤2 perguntas).
- Toda regra fica rastreável: a constitution gerada traz um bloco `## Fontes` mapeando cada regra ao arquivo de origem; regras inferidas do código são marcadas como tal.
- O documento segue a estrutura e as regras das [boas práticas de constitution](../concepts/constitution-best-practices.md) e do [exemplo prático](../concepts/constitution-example.md): linguagem absoluta ("sempre"/"nunca"), uma persona explícita para o agente, uma stack tecnológica travada, e nenhum conteúdo específico de feature.
- Exige uma seção **Higiene de mudança** com 3–5 regras absolutas derivadas de `knowledge/7-change-hygiene.md` (premissas explícitas, mínimo que resolve, diff cirúrgico, verificação antes de concluir), especializadas para a stack detectada. No modo merge, essas regras entram como diff proposto e nunca sobrescrevem edições manuais.
- Exige uma seção **Execução e evidência** adaptada de `knowledge/8-verification-discipline.md` e `knowledge/9-test-first-execution.md`: comando de teste do projeto, política de teste-primeiro, exceções permitidas e proibição de claim sem evidência fresca.

## `oh-my-sdd-specify`

**Tools permitidas:** `Read`, `Write`, `Glob`, `Grep`

Gera `.oh-my-sdd/specs/<slug>/spec.md`:

- Trata `constitution.md` como restrição vinculante.
- Se `spec.md` já existir, trata como edição/continuação em vez de regenerar do zero.
- Estrutura o documento exatamente como o [exemplo prático de spec](../concepts/spec-example.md), usando sintaxe EARS/GEARS para requisitos funcionais, um checklist verificável de critérios de aceite, e requisitos não-funcionais/contratos.
- Exige uma seção **Premissas e Ambiguidades** antes dos requisitos EARS: premissas, interpretações concorrentes e perguntas em aberto ficam registradas; ambiguidade é apresentada ao usuário, nunca resolvida em silêncio. Em `scale=SMALL`, a seção é limitada a três linhas.
- Tem **modo descoberta**: quando o pedido não traz resultado observável, usuário ou critério verificável, faz no máximo três perguntas abertas, uma por vez, antes de gerar o spec.
- **Checkpoint #1**: apresenta o spec e não devolve o controle ao orquestrador até o usuário validá-lo explicitamente (ou pausar/abandonar explicitamente).

## `oh-my-sdd-plan`

**Tools permitidas:** `Read`, `Write`, `Glob`, `Grep`

Traduz o `spec.md` validado em `.oh-my-sdd/specs/<slug>/plan.md`: decisões arquiteturais, esquema de dados/API e escolha de bibliotecas — o "como" — sempre dentro das restrições de `constitution.md`. Também registra **alternativas consideradas** (ao menos uma descartada com motivo), **justificativa de complexidade** (cada abstração, camada ou dependência nova declara o problema real de hoje e os consumidores atuais), **Global Constraints** (valores exatos copiados do spec), **Review Focus** (riscos que nenhum teste cobre) e **Interfaces** por tarefa (consome/produz com assinaturas exatas). Um self-review confere cobertura do spec, consistência de tipos e proporção do plano antes de liberar. Não tem checkpoint próprio; `plan.md` é validado junto com `tasks.md` na fase seguinte.

## `oh-my-sdd-tasks`

**Tools permitidas:** `Read`, `Write`, `Glob`, `Grep`

Quebra `plan.md` em `.oh-my-sdd/specs/<slug>/tasks.md` — tarefas pequenas, atômicas e sequenciais, cada uma verificável de forma independente. Toda tarefa declara `altera:` (arquivos/módulos que pode tocar) e `verifica:` (comando, teste ou inspeção concreta que prova a conclusão). Tarefas que cruzam interfaces acrescentam `consome:`/`produz:` com assinaturas exatas; tarefas de comportamento acrescentam `passos:` com o ciclo RED→confirmar falha→GREEN→confirmar verde (passos reduzidos permitidos para configuração/docs com motivo declarado). A lista sempre termina com uma tarefa de **auditoria de diff**, comparando `git diff --stat` com o escopo declarado.

**Checkpoint #2**: apresenta `plan.md` **e** `tasks.md` juntos e não devolve o controle até o usuário confirmar explicitamente que a implementação pode começar.

## `oh-my-sdd-implement`

**Tools permitidas:** `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`

Implementa a feature:

- Lê `tasks.md`, `spec.md` e `constitution.md`; detecta quais tarefas já estão marcadas (suporte a retomada).
- Implementa tarefa por tarefa, respeitando `constitution.md` e os guardrails de higiene de mudança. Se precisar desviar do que foi especificado — incluindo tocar arquivo fora do `altera:` da tarefa —, para e pergunta em vez de decidir silenciosamente.
- Para tarefas que mudam comportamento, segue execução com teste primeiro: escreve o teste que falha, confirma a falha, implementa o mínimo e confirma o verde.
- Executa o `verifica:` declarado da tarefa e lê output e exit code antes de marcá-la; tarefa cuja verificação não rodou permanece desmarcada e é reportada como pendente.
- Em falha de verificação, aplica as quatro fases do debugging sistemático e corrige apenas causa raiz; após três correções falhas, para e reporta a hipótese arquitetural.
- Registra decisões internas ao plano como `Ruling: decisão — motivo — custo se errado`; escopo, dependência, segurança, operação irreversível e conflito com o spec param e perguntam.
- Em MEDIUM/LARGE, pode oferecer revisão opcional de contexto fresco (sem checkpoint humano novo) e corrige findings Critical/Important em um único passe test-first.
- Marca cada tarefa em `tasks.md` conforme é concluída.
- Reporta quais tarefas foram implementadas e quais critérios de aceite de `spec.md` foram atendidos — comparando o código gerado diretamente contra o checklist.
