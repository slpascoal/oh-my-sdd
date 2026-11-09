# 10. Debugging sistemático

**Lei de ferro:** nenhuma correção sem investigação de causa raiz. Correção de sintoma é falha de processo.

## Fase 1 — Causa raiz

Antes de propor qualquer correção:

1. **Leia o erro inteiro.** Stack trace completo, linha, arquivo, código de erro.
2. **Reproduza de forma consistente.** Passos exatos, frequência. Se não reproduz, colete mais dados — não chute.
3. **Verifique mudanças recentes.** Diff, commits, dependências, configuração, ambiente.
4. **Instrumente fronteiras** em sistemas multi-componente: registre o que entra e sai de cada camada antes de propor correção. Descubra **onde** quebra, depois investigue aquele ponto.
5. **Rastreie o fluxo de dados** até a origem do valor ruim. Corrija na origem, não no sintoma.

## Fase 2 — Padrão

- Encontre código semelhante que funciona.
- Compare o quebrado com o funcional, listando todas as diferenças.
- Entenda dependências, configuração e premissas.

## Fase 3 — Hipótese

- Formule **uma** hipótese específica: "X é a causa porque Y".
- Faça a menor mudança possível para testá-la.
- Uma variável por vez.
- Funcionou: Fase 4. Não funcionou: nova hipótese, sem empilhar correções.

## Fase 4 — Implementação

- Crie o teste que reproduz o problema e confirme que falha.
- Implemente uma única correção na causa raiz.
- Rode o teste e a suíte inteira.
- Sem "melhorias enquanto estou aqui".

## Regra das três tentativas

Se três correções falharam, o problema não é a hipótese: é a arquitetura. Pare, explique ao usuário o padrão observado (cada correção revela um novo problema em outro lugar) e aguarde decisão. Não tente a quarta correção sozinho.

## Sinais de que você está chutando

- "Correção rápida para agora, investigo depois."
- "Vou mudar X e ver o que acontece."
- Várias mudanças de uma vez.
- "Provavelmente é X."
- Nova correção depois de duas falhas.
