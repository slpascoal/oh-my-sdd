# 9. Execução com teste primeiro

**Lei de ferro:** nenhum código de produção sem um teste que falhou primeiro.

Se o teste passou de primeira, você não sabe se ele testa a coisa certa. Teste que nunca falhou não prova nada.

## Ciclo

### 1. RED — escrever o teste

- Um comportamento por teste, nome claro.
- Use código real; mock só quando inevitável.
- O teste expressa o contrato desejado, com os valores exatos do spec.

### 2. Verificar o RED

Execute o teste e **veja a falha**. Confirme:

- falha, não erro de sintaxe ou import;
- a mensagem de falha é a esperada;
- falha porque a funcionalidade não existe, não porque o teste está errado.

Teste que passa aqui está testando comportamento existente: corrija o teste.

### 3. GREEN — mínimo para passar

Implemente o mínimo que faz o teste passar. Sem features extras, sem abstração antecipada, sem configuração especulativa.

### 4. Verificar o GREEN

Execute o teste e **veja passar**. Depois rode a suíte inteira do projeto — verde no arquivo da tarefa não é suíte verde. Falha que já existia e não foi mencionada no relatório é omissão.

### 5. REFACTOR

Só com a suíte verde: remover duplicação, melhorar nomes, extrair helpers. Não adicionar comportamento.

## Exceções

Somente com aprovação explícita do usuário:

- protótipo descartável;
- código gerado;
- arquivo de configuração sem lógica testável.

"É simples demais para testar" não é exceção.

## Bug

Reproduza primeiro: escreva o teste que falha com o sintoma, confirme a falha, corrija, confirme o verde. A correção sem teste que reproduz é tentativa, não conserto.

## Antes de concluir

- [ ] Todo comportamento novo tem teste.
- [ ] Cada teste foi visto falhar pelo motivo esperado.
- [ ] O código foi mínimo para passar.
- [ ] A suíte inteira passou.
- [ ] Nenhum output sujo (erros, warnings) foi ignorado.
