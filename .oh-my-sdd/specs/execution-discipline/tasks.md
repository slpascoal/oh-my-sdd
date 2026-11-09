## Tasks

> **Contexto de pesquisa (leitura obrigatória antes da tarefa 1):** `.oh-my-sdd/research/execution-discipline-integration.md`. Base de redação, posicionamento e justificativa; em dúvida, prevalece sobre improviso.

- [x] 1. `knowledge/8-verification-discipline.md`: criar com gate de evidência (identificar comando, executar, ler output/exit code, verificar, afirmar), proibições de claim sem execução e aplicação antes de marcar tarefa/commit/relatório.
      altera: knowledge/8-verification-discipline.md
      consome: —
      produz: gate de evidência referenciado por `implement` e `constitution`
      verifica: `grep -c` dos 5 passos e da lei de ferro; leitura integral confirma linguagem absoluta
      passos: reduzido (documentação) — criar, reler, conferir headings

- [x] 2. `knowledge/9-test-first-execution.md`: criar com RED→GREEN→REFACTOR, exigência de ver a falha, GREEN mínimo, suíte inteira antes de concluir e exceções explícitas (protótipo, código gerado, configuração).
      altera: knowledge/9-test-first-execution.md
      consome: —
      produz: ciclo TDD referenciado por `implement`
      verifica: leitura integral confirma ciclo, exceções e regra da suíte inteira
      passos: reduzido (documentação)

- [x] 3. `knowledge/10-systematic-debugging.md`: criar com quatro fases, instrumentação de fronteiras, hipótese única, teste que reproduz e parada após três correções falhas com questionamento arquitetural.
      altera: knowledge/10-systematic-debugging.md
      consome: —
      produz: processo de debugging referenciado por `implement`
      verifica: leitura integral confirma as quatro fases e a regra das três tentativas
      passos: reduzido (documentação)

- [x] 4. `knowledge/11-execution-records.md`: criar com formato `Ruling: decisão — motivo — custo se errado`, limite a decisões internas ao plano, lista do que sempre para, e retomada por ledger + `tasks.md` + git log.
      altera: knowledge/11-execution-records.md
      consome: —
      produz: contrato de ruling referenciado por `implement`
      verifica: leitura integral confirma formato, limite e lista de paradas
      passos: reduzido (documentação)

- [x] 5. `knowledge/0-sdd-index.md`: adicionar itens 8–11 apontando para os quatro arquivos novos, no formato dos itens existentes.
      altera: knowledge/0-sdd-index.md
      consome: nomes dos arquivos das tarefas 1–4
      produz: índice navegável
      verifica: `grep -c '8-verification-discipline.md\|9-test-first-execution.md\|10-systematic-debugging.md\|11-execution-records.md'` = 4

- [x] 6. `knowledge/6-example-constitution.md`: adicionar seção "Execution and evidence" com 3–5 regras absolutas (comando de teste, TDD, exceções, evidência antes de claim).
      altera: knowledge/6-example-constitution.md
      consome: knowledge/8 e 9
      produz: modelo da seção para a constitution
      verifica: `grep -n 'Execution and evidence'` retorna a seção; regras no formato Always/Never

- [x] 7. `skills/oh-my-sdd-constitution/SKILL.md`: exigir a seção "Execução e evidência" na Phase 4, com valores específicos da stack; manter merge por diff e edições manuais intocadas.
      altera: skills/oh-my-sdd-constitution/SKILL.md
      consome: tarefa 6
      produz: exigência da seção
      verifica: leitura integral da Phase 4 confirma exigência e merge

- [x] 8. `skills/oh-my-sdd-specify/SKILL.md`: adicionar modo descoberta na Phase 2/3 — até três perguntas abertas, uma por vez, quando a tarefa não tiver resultado observável, usuário ou critério verificável.
      altera: skills/oh-my-sdd-specify/SKILL.md
      consome: —
      produz: comportamento de descoberta
      verifica: leitura integral confirma gatilho, limite de três perguntas e retorno ao fluxo normal

- [x] 9. `skills/oh-my-sdd-plan/SKILL.md`: exigir Global Constraints, Review Focus, Interfaces por tarefa e self-review (cobertura, tipos, proporção) na Phase 2.
      altera: skills/oh-my-sdd-plan/SKILL.md
      consome: —
      produz: contrato de `plan.md`
      verifica: leitura integral confirma as quatro exigências

- [x] 10. `skills/oh-my-sdd-tasks/SKILL.md`: acrescentar `consome:`/`produz:` às tarefas que cruzam interfaces e `passos:` RED→falha→GREEN→verde para tarefas de comportamento, com exceção justificada.
      altera: skills/oh-my-sdd-tasks/SKILL.md
      consome: tarefa 9
      produz: contrato de `tasks.md`
      verifica: leitura integral da Phase 2 confirma campos, passos e exceção

- [x] 11. `skills/oh-my-sdd-implement/SKILL.md`: exigir teste que falhou primeiro para tarefas de comportamento; executar e ler output/exit code antes de `[x]`; acionar debugging em falha; parar após três tentativas; registrar rulings internos; ofertar review opcional em MEDIUM/LARGE.
      altera: skills/oh-my-sdd-implement/SKILL.md
      consome: tarefas 1–4, 9, 10
      produz: comportamento de execução completo
      verifica: leitura integral das Phases 1–3 confirma os seis comportamentos e preserva o gate de sensors

- [x] 12. `lib/templates/sdd-rules/rules.md`: adicionar bloco "Execution discipline" em inglês, entre os marcadores, sem alterar o restante.
      altera: lib/templates/sdd-rules/rules.md
      consome: tarefa 11
      produz: regras exportadas
      verifica: `grep -n 'Execution discipline'`; marcadores `oh-my-sdd:start/end` intactos

- [x] 13. `README.md`: adicionar seção "Execution discipline" com as quatro regras e a fase de atuação.
      altera: README.md
      consome: tarefa 12
      produz: documentação de entrada
      verifica: leitura da seção confirma quatro regras e fases

- [x] 14. `docs/architecture/skills.md` e `docs/architecture/skills.pt.md`: atualizar specify/plan/tasks/implement com modo descoberta, contratos e disciplina de execução.
      altera: docs/architecture/skills.md, docs/architecture/skills.pt.md
      consome: tarefas 8–11
      produz: referência de skills atualizada
      verifica: `grep` das novas capacidades retorna ocorrência nos dois idiomas

- [x] 15. `docs/concepts/execution-discipline.md` e `.pt.md`: criar páginas novas com problema, quatro regras, fase de atuação, proporcionalidade e exemplos de ruling/plan/tasks.
      altera: docs/concepts/execution-discipline.md, docs/concepts/execution-discipline.pt.md
      consome: tarefas 1–11
      produz: página de conceito EN/PT
      verifica: ambos os arquivos existem e cobrem as quatro regras

- [x] 16. `mkdocs.yml`: adicionar `Execution Discipline: concepts/execution-discipline.md` ao nav de SDD Concepts.
      altera: mkdocs.yml
      consome: tarefa 15
      produz: navegação publicada
      verifica: `grep -n 'concepts/execution-discipline.md' mkdocs.yml` retorna uma linha na seção correta

- [x] 17. Verificação de distribuição: rodar `node bin/oh-my-sdd.js export cursor` e `export codex` duas vezes em diretório temporário, confirmando bloco presente, idempotência e preservação de conteúdo de terceiros.
      altera: nenhum (verificação)
      verifica: md5 idêntico entre execuções; bloco presente uma vez; conteúdo pré-existente preservado

- [x] 18. Auditoria de diff: comparar `git diff --stat` com a união dos `altera:` das tarefas 1–16; reler integralmente as cinco SKILL.md alteradas; confirmar ausência de atribuição externa nos artefatos entregues e `package.json` inalterado.
      altera: nenhum (verificação)
      verifica: relatório de arquivos vs. previstos sem divergência; `git diff --stat package.json` vazio
