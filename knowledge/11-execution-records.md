# 11. Registros de execução

Decisões tomadas durante a implementação não podem viver só na memória da sessão. Este arquivo define o que se registra, onde e o que **nunca** se decide sozinho.

## Ruling

Decisão interna ao plano — detalhe que o spec e o plano não fixaram, mas que não muda escopo, contrato externo nem segurança — é registrada e a execução continua:

```md
Ruling: <decisão> — <motivo> — <custo se errado>
```

Exemplos legítimos: qual nome de variável interna seguir, como dividir um helper, qual estrutura de dados local usar.

## O que sempre para

**Nunca** vira ruling. Pare e pergunte ao usuário:

- mudança de escopo ou de requisito;
- alteração de dependência, stack ou configuração de segurança;
- operação destrutiva ou irreversível;
- escrita fora do repositório ou efeito externo;
- conflito entre spec, plano e constitution;
- tarefa que exige arquivo fora do campo `altera:`.

Em dúvida genuína, a regra da constitution prevalece: pergunte.

## Onde registrar

- `.oh-my-sdd/runtime/sessions/<slug>.rulings.md`, no mesmo diretório de runtime da sessão.
- Uma linha por decisão, na ordem em que foi tomada.
- Nada de reescrever rulings antigos; corrija com um novo ruling que referencie o anterior.

## Retomada

Depois de compactação ou nova sessão, a ordem de confiança é:

1. `tasks.md` — fonte formal de progresso.
2. `git log` — commits existem mesmo quando a memória não lembra.
3. Rulings registrados — decisões já tomadas.
4. Session em runtime — cache fino.

Se divergirem, `tasks.md` e git vencem; sincronize o cache, nunca o contrário.

## Relatório final

Toda linha `Ruling:` aparece no relatório final com o custo se errado. Decisão tomada no lugar do usuário não pode chegar a ele por acaso nem por omissão.
