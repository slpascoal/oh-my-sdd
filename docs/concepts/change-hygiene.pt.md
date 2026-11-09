# Higiene de Mudança

O Spec-Driven Development governa o que vem **antes** da implementação (spec, plan) e o que vem **depois** (sensors, gate de evidência). A higiene de mudança governa a **edição em si** — o momento em que o agente escreve código.

## A lacuna que ela fecha

Sem regras para a edição, quatro falhas se repetem mesmo com uma boa spec:

- Um requisito é ambíguo e o agente escolhe uma leitura em silêncio.
- A implementação cresce com abstrações especulativas que ninguém pediu.
- O diff toca, reformata ou refatora código sem relação com a tarefa.
- Uma tarefa é marcada como concluída sem qualquer prova de que funciona.

A higiene de mudança transforma isso em comportamento observável nos artefatos que você já revisa.

## Os quatro guardrails

| Guardrail | O que garante |
|---|---|
| **Premissas explícitas** | Premissas, interpretações concorrentes e perguntas em aberto ficam registradas. Ambiguidade real para a execução em vez de ser preenchida em silêncio. |
| **Mínimo que resolve** | Nada de features não pedidas, abstrações de uso único, configuração especulativa ou tratamento de cenários impossíveis. |
| **Diff cirúrgico** | Toda linha alterada rastreia a uma tarefa. Código adjacente intocado nunca é reformatado ou refatorado. Só órfãos criados pela própria mudança são removidos. |
| **Verificação por tarefa** | Cada tarefa declara como será verificada antes de executar, e não é concluída até essa verificação rodar. |

As regras completas ficam em `knowledge/7-change-hygiene.md`, instalado com cada skill.

## Onde cada guardrail atua

| Fase | Artefato | Guardrail aplicado |
|---|---|---|
| Constitution | `constitution.md` | Seção **Higiene de mudança** com 3–5 regras absolutas e específicas da stack |
| Specify | `spec.md` | Seção **Premissas e Ambiguidades** antes dos requisitos EARS |
| Plan | `plan.md` | **Alternativas consideradas** e **justificativa de complexidade** |
| Tasks | `tasks.md` | Toda tarefa declara `altera:` e `verifica:`; a lista termina com auditoria de diff |
| Implement | código | Premissas são lidas primeiro, a verificação roda antes de marcar a tarefa, arquivo fora do escopo para a execução |

## Rigor proporcional

A higiene de mudança segue a escala adaptativa existente — não há segunda régua:

- **QUICK** — premissas (só se a ambiguidade for real), mínimo que resolve, diff cirúrgico. O checkpoint único não muda; o gate de evidência substitui a verificação por tarefa.
- **SMALL** — a seção de premissas é limitada a três linhas; `altera:`/`verifica:` são obrigatórios.
- **MEDIUM / LARGE** — os quatro guardrails, com os dois checkpoints humanos preservados.

## Como aparece nos artefatos

```md
## Premissas e Ambiguidades

- Premissa: a exportação é paginada; assumido porque a API retorna no máximo 100 linhas.
- Interpretações concorrentes: download de arquivo vs. job em background — decisão pendente.
```

```md
## Alternativas consideradas

- Reutilizar o exportador existente — descartada porque escreve de forma síncrona e bloqueia a requisição.

## Justificativa de complexidade

- Novo adaptador de fila — resolve o timeout de 30s da requisição; consumidores atuais: 1 (justificado pelo limite rígido).
```

```md
- [ ] 3. Adicionar o endpoint de exportação
      altera: src/api/export.ts, src/services/export.ts
      verifica: npm test -- export.test.ts
```

## O que não muda

Nenhuma skill nova, nenhuma fase nova e nenhum checkpoint humano novo. A ordem do orquestrador continua `constitution → specify → plan → tasks → implement`. Quando um guardrail conflita com `constitution.md`, a constitution sempre vence.
