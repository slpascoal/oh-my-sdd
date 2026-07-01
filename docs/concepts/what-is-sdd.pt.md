# O que é Spec-Driven Development (SDD)?

Spec-Driven Development (SDD) é uma metodologia de engenharia de software em que **especificações estruturadas assumem o papel de principal fonte de verdade** de um projeto, em vez do próprio código-fonte.

Com a ascensão de agentes de IA generativa que produzem código em massa, o mercado percebeu que a abordagem de tentativa e erro, apelidada de "Vibe Coding", cria código difícil de manter e que acumula dívida técnica. O SDD surge como a resposta estruturada a esse cenário, tratando a IA não como uma assistente improvisadora, mas como executora de intenções formalizadas, operando dentro de contratos explícitos e limites bem definidos.

## Três níveis de maturidade

O SDD pode ser categorizado em três níveis de maturidade:

- **Spec-first**: A especificação é escrita primeiro para guiar a IA, mas não é necessariamente atualizada depois que o código é gerado.
- **Spec-anchored**: A especificação e o código coexistem; quando o sistema evolui, a especificação é atualizada simultaneamente, servindo como base contínua para manutenção.
- **Spec-as-source**: A especificação é o único artefato editado por humanos. Agentes autônomos geram e regeneram automaticamente o código-fonte a partir de qualquer alteração feita nela.

O `oh-my-sdd` opera no nível **spec-anchored**: cada feature mantém seu `spec.md`, `plan.md` e `tasks.md` junto do código em `.oh-my-sdd/specs/<slug>/`, então a especificação permanece uma referência viva em vez de um documento de planejamento descartável.
