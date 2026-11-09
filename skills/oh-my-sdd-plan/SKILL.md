---
name: oh-my-sdd-plan
description: Traduz um spec.md já validado em decisões técnicas (plan.md) — arquitetura, esquema de dados/API, bibliotecas — respeitando constitution.md. Geralmente invocada pela skill oh-my-sdd depois do checkpoint de oh-my-sdd-specify.
allowed-tools: Read, Write, Glob, Grep
---

# When to use this skill

Use depois que um `spec.md` já foi validado pelo usuário, para gerar o plano técnico correspondente:

```
/oh-my-sdd-plan <slug-da-feature>
```

# How to use this skill

O argumento é o **slug da feature** — deve corresponder a uma pasta `.oh-my-sdd/specs/<slug>/` com `spec.md` já validado.

> [!IMPORTANT]
> - Não gere `plan.md` se `spec.md` não existir ou estiver visivelmente incompleto — nesse caso, avise quem chamou em vez de inventar conteúdo.
> - Todo o "como" deve respeitar estritamente as restrições de `constitution.md`. Se o spec exigir algo que a constitution proíbe, pare e reporte o conflito em vez de decidir por conta própria.
> - Esta skill não tem checkpoint humano próprio — `plan.md` é validado junto com `tasks.md` na fase seguinte (`oh-my-sdd-tasks`).

# Tool usage flow

## Phase 1 — Ler Spec e Constitution

Execute em paralelo:

1. `Read` em `.oh-my-sdd/specs/<slug>/spec.md`.
2. `Read` em `.oh-my-sdd/constitution.md` do projeto.

## Phase 2 — Gerar `plan.md`

Gere `.oh-my-sdd/specs/<slug>/plan.md` traduzindo o "o quê" do spec no "como" técnico, conforme a definição de `PLAN.md` em `knowledge/3-best-practices-spec.md` (seção A): *"Translates the abstract spec into the how (architectural decisions, database schemas, library choices)"*. Estruture com, no mínimo:

- **Decisões arquiteturais**: como os requisitos funcionais do spec se traduzem em módulos/camadas/fluxos, dentro da stack travada por `constitution.md`.
- **Esquema de dados/API**: formatos, endpoints, tabelas ou contratos afetados.
- **Bibliotecas e dependências**: apenas as já permitidas por `constitution.md`; se precisar de algo novo, justifique explicitamente e sinalize como decisão a confirmar.
- **Global Constraints**: copie do `spec.md`, literalmente, os valores que valem para todas as tarefas — versões mínimas, formatos, limites, nomes obrigatórios, dependências proibidas. Cada tarefa herda implicitamente esta seção.
- **Review Focus**: liste os riscos que o spec implica e que nenhum teste cobre — classes de input, condições de borda, falhas prováveis de uso. Para cada linha, garanta que exista uma tarefa cujo teste a exercita.
- **Interfaces por tarefa**: para cada tarefa, declare o que ela **consome** de tarefas anteriores e o que **produz** para as seguintes, com nomes, parâmetros e tipos exatos. Implementador vê só a própria tarefa; esta seção é como ele conhece os contratos vizinhos.
- **Alternativas consideradas**: registre ao menos uma alternativa descartada e o motivo. Nunca aceite a primeira arquitetura sem comparar com a mais simples.
- **Justificativa de complexidade**: para cada abstração, camada, padrão ou dependência nova, declare qual problema real ela resolve **hoje** e quantos consumidores atuais ela tem. Abstração com um único consumidor exige justificativa explícita ou sai do plano.

Mantenha o nível de detalhe do "como" sem descer a pseudocódigo linha-a-linha — isso é papel da fase de implementação, não do plano (ver `knowledge/3-best-practices-spec.md`, seção C sobre não superespecificar).

**Self-review obrigatório antes de escrever o arquivo:** (1) cada requisito do spec aponta para uma tarefa; (2) nomes e assinaturas usados em tarefas posteriores são idênticos aos definidos nas anteriores; (3) os valores de Global Constraints batem com o spec; (4) o plano não é várias vezes maior que o spec (se for, substitua corpos de código por assinaturas e testes). Corrija inline; não é preciso re-revisar.

Escreva o arquivo e reporte ao chamador que `plan.md` foi gerado, sem pedir validação aqui (isso ocorre na fase de `tasks`).
