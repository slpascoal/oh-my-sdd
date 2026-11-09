# Disciplina de Execução

A higiene de mudança governa como a edição é feita. A disciplina de execução governa como o trabalho é provado. O pipeline já tinha spec antes do código e evidência depois; estas regras cobrem o trecho do meio.

## As quatro regras

| Regra | O que garante |
|---|---|
| **Evidência antes de claim** | Uma conclusão só é afirmada depois que o comando rodou nesta execução e seu output e exit code foram lidos. "Deve funcionar" não é status. |
| **Teste primeiro** | Mudança de comportamento começa com um teste que falha pelo motivo esperado, depois o mínimo para passar, depois a suíte inteira. |
| **Causa raiz primeiro** | Verificação falhou aciona investigação antes da correção. Reproduzir, instrumentar, isolar. Após três correções falhas, parar e questionar a arquitetura. |
| **Registrar, não improvisar** | Decisão interna ao plano vira ruling registrado. Escopo, dependência, segurança e operação irreversível param e perguntam. |

As regras completas ficam em `knowledge/8-verification-discipline.md`, `9-test-first-execution.md`, `10-systematic-debugging.md` e `11-execution-records.md`.

## Onde cada regra atua

| Fase | Artefato | Regra aplicada |
|---|---|---|
| Constitution | `constitution.md` | Seção **Execução e evidência**: comando de teste, política de teste-primeiro, exceções permitidas |
| Specify | `spec.md` | **Modo descoberta** quando o pedido não traz resultado observável, usuário ou critério verificável |
| Plan | `plan.md` | **Global Constraints**, **Review Focus**, **Interfaces** por tarefa e self-review |
| Tasks | `tasks.md` | `consome:`/`produz:` e `passos:` RED→GREEN para tarefas de comportamento |
| Implement | código | Teste primeiro, verificação lida antes do checkbox, debugging em falha, rulings registrados, review opcional de contexto fresco |

## Rigor proporcional

- **QUICK** — evidência antes de claim e causa raiz em correção. Sem ciclo TDD formal; o gate de evidência continua valendo.
- **SMALL** — acrescenta teste-primeiro para tarefas de comportamento e `passos:` nas tarefas.
- **MEDIUM / LARGE** — conjunto completo, mais review opcional de contexto fresco, que é oferta e nunca checkpoint.

## Como aparece nos artefatos

```md
## Global Constraints
- Node.js >= 18.18.0
- Respostas HTTP sempre JSON; erros no padrão RFC 7807

## Review Focus
- Requisições concorrentes de exportação compartilhando o mesmo cursor
```

```md
- [ ] 3. Adicionar o endpoint de exportação
      altera: src/api/export.ts
      consome: buildExportQuery(filter) da tarefa 2
      produz: ExportResponse para a tarefa 4
      verifica: npm test -- export.test.ts
      passos:
        1. escrever teste que falha (RED)
        2. rodar e confirmar a falha esperada
        3. implementar o mínimo (GREEN)
        4. rodar e confirmar verde
```

```md
Ruling: reutilizar o paginador existente em vez de criar helper de cursor — já limita a 100 linhas — custo se errado: um refactor extra na tarefa 4
```

## O que não muda

Nenhuma skill nova, nenhuma fase nova, nenhum checkpoint humano novo. A ordem continua `constitution → specify → plan → tasks → implement`. Um ruling nunca autoriza mudança de escopo, dependência nova, operação destrutiva ou efeito externo — esses casos continuam parando e perguntando.
