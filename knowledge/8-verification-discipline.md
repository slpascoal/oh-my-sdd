# 8. Disciplina de verificação

**Lei de ferro:** nenhuma afirmação de conclusão sem evidência fresca. Se o comando não rodou nesta execução, o resultado não existe.

## O gate

Antes de afirmar que algo está pronto, funcionando ou corrigido:

1. **Identifique** qual comando prova a afirmação.
2. **Execute** o comando completo — não um recorte, não uma execução anterior.
3. **Leia** o output inteiro e o exit code; conte falhas.
4. **Compare** o resultado com o esperado.
5. **Só então** afirme — citando o comando e o resultado.

Pular qualquer passo é afirmar sem verificar.

## O que não é evidência

- "Deve funcionar", "provavelmente passa", "parece correto".
- Execução anterior, mesmo da mesma sessão.
- Lint passando quando a afirmação é sobre compilação ou teste.
- Relato de sucesso de outro agente ou de uma ferramenta, sem conferir a saída.
- Leitura do diff — diff bonito não prova comportamento.

## Quando aplicar

**Sempre** antes de:
- marcar tarefa como concluída;
- fazer commit ou abrir PR;
- emitir relatório final;
- dizer que um bug foi corrigido.

**Nunca** reporte critério de aceite como atendido sem sensor, teste ou nota de verificação manual registrada. Sem prova, o estado correto é "pendente de verificação".

## Formato do registro

```md
Verificação: `<comando>` → exit 0; saída relevante: `<linha>`
```

Comando e resultado vão no relatório. A conclusão vem depois da evidência, nunca antes.
