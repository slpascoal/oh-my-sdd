# 7. Higiene de mudança para agentes de código

Quatro regras comportamentais que reduzem desperdício e regressão durante a implementação. Valem a partir da primeira edição de código e não substituem `constitution.md` — quando houver conflito, a constitution sempre vence.

## A. Explicitar antes de decidir

- **Sempre** declare as premissas que o spec não fixou.
- **Sempre** liste as interpretações concorrentes quando houver mais de uma leitura razoável do requisito.
- **Sempre** diga quando existir um caminho mais simples, mesmo que o spec sugira outro.
- **Nunca** preencha lacuna em silêncio: se algo estiver genuinamente indefinido, pare e pergunte.

## B. Mínimo que resolve

- **Nunca** implemente o que a tarefa não pediu.
- **Nunca** crie abstração com um único consumidor.
- **Nunca** adicione configuração, extensibilidade ou fallback especulativos.
- **Nunca** trate cenário que o domínio torna impossível.
- **Sempre** reduza o volume de código antes de concluir, se ele passar do que a tarefa justifica.

## C. Diff cirúrgico

- **Sempre** garanta que toda linha alterada rastreie a uma tarefa de `tasks.md`.
- **Nunca** reformate, renomeie, reordene ou "melhore" código adjacente que a tarefa não pede para alterar.
- **Sempre** siga o estilo existente do arquivo, mesmo que discorde dele.
- **Sempre** remova apenas órfãos criados pela própria mudança.
- **Nunca** apague código morto pré-existente: mencione no relatório e deixe a decisão para o usuário.

## D. Meta verificável por tarefa

- **Sempre** declare como a tarefa será verificada antes de executá-la.
- **Sempre** comece bug por um teste ou checagem que reproduz o problema, e só então corrija.
- **Sempre** mantenha testes verdes antes e depois de uma refatoração.
- **Nunca** considere uma tarefa concluída sem a verificação declarada executada.
