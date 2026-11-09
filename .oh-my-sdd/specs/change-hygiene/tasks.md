## Tasks

> **Contexto de pesquisa (leitura obrigatória antes da tarefa 1):** `.oh-my-sdd/research/behavioral-guardrails-integration.md`. Usar como base de redação, posicionamento e justificativa; em caso de dúvida, ele prevalece sobre improviso.

- [x] 1. `knowledge/7-change-hygiene.md`: criar o arquivo com as quatro seções (A. Explicitar antes de decidir, B. Mínimo que resolve, C. Diff cirúrgico, D. Meta verificável por tarefa) em linguagem absoluta, redação própria, sem citação externa.
      altera: knowledge/7-change-hygiene.md
      verifica: `grep -c '^## [A-D]\.' knowledge/7-change-hygiene.md` retorna 4; leitura integral confirma "sempre/nunca", ausência de nomes externos e alinhamento com a seção 5.1 do research.

- [x] 2. `knowledge/0-sdd-index.md`: adicionar o item `7. Higiene de mudança para agentes de código` apontando para `7-change-hygiene.md`, mantendo a numeração e o formato dos itens existentes.
      altera: knowledge/0-sdd-index.md
      verifica: `grep -n '7-change-hygiene.md' knowledge/0-sdd-index.md` retorna exatamente uma linha, no mesmo formato markdown dos demais itens.

- [x] 3. `knowledge/6-example-constitution.md`: adicionar a seção de exemplo "Higiene de mudança" com 3–5 regras absolutas, coerente com a estrutura existente do documento.
      altera: knowledge/6-example-constitution.md
      verifica: `grep -n 'Higiene de mudança' knowledge/6-example-constitution.md` retorna a seção; leitura confirma regras no formato "Sempre/Nunca".

- [x] 4. `skills/oh-my-sdd-constitution/SKILL.md`: exigir a seção "Higiene de mudança" na Phase 4 e no modo merge (diff proposto, edições manuais intocadas).
      altera: skills/oh-my-sdd-constitution/SKILL.md
      verifica: leitura integral da Phase 4 confirma a exigência e a preservação do modo merge.

- [x] 5. `skills/oh-my-sdd-specify/SKILL.md`: exigir a seção "Premissas e Ambiguidades" antes dos requisitos EARS na Phase 3; limitar a três linhas em `scale=SMALL`; proibir escolha silenciosa entre interpretações.
      altera: skills/oh-my-sdd-specify/SKILL.md
      verifica: leitura integral confirma seção obrigatória, limite SMALL e regra de não escolher silenciosamente.

- [x] 6. `skills/oh-my-sdd-plan/SKILL.md`: exigir "Alternativas consideradas" (ao menos uma descartada com motivo) e "Justificativa de complexidade" (problema real hoje + consumidores atuais) na Phase 2.
      altera: skills/oh-my-sdd-plan/SKILL.md
      verifica: leitura integral das instruções de geração de `plan.md` confirma as duas seções.

- [x] 7. `skills/oh-my-sdd-tasks/SKILL.md`: definir o formato `altera:`/`verifica:` por tarefa, a regra de rastreio a requisito/critério e a tarefa final obrigatória de auditoria de diff.
      altera: skills/oh-my-sdd-tasks/SKILL.md
      verifica: leitura integral da Phase 2 confirma formato, rastreio e auditoria final.

- [x] 8. `skills/oh-my-sdd-implement/SKILL.md`: ler premissas do spec e `verifica:` da tarefa antes da primeira edição; executar a verificação antes de marcar `[x]`; manter tarefa desmarcada se a verificação não rodar; definir desvio de escopo; aplicar subconjunto QUICK.
      altera: skills/oh-my-sdd-implement/SKILL.md
      verifica: leitura integral das Phases 1–3 confirma os cinco comportamentos e que o gate de evidência permanece inalterado.

- [x] 9. `lib/templates/sdd-rules/rules.md`: adicionar o bloco "Change hygiene" em inglês, entre os marcadores existentes, sem alterar o restante.
      altera: lib/templates/sdd-rules/rules.md
      verifica: `grep -n 'Change hygiene' lib/templates/sdd-rules/rules.md` retorna o bloco; marcadores `oh-my-sdd:start/end` intactos.

- [x] 10. `README.md`: adicionar seção "Change hygiene" com os quatro guardrails e a fase de atuação de cada um.
      altera: README.md
      verifica: leitura da seção confirma os quatro nomes e as fases.

- [x] 11. `docs/architecture/skills.md` e `docs/architecture/skills.pt.md`: atualizar a descrição das fases specify/plan/tasks/implement com as novas seções obrigatórias.
      altera: docs/architecture/skills.md, docs/architecture/skills.pt.md
      verifica: `grep` das quatro seções em ambos os arquivos retorna ocorrência em cada idioma.

- [x] 12. `docs/concepts/spec-best-practices.md` e `.pt.md`: acrescentar o parágrafo sobre premissas explícitas.
      altera: docs/concepts/spec-best-practices.md, docs/concepts/spec-best-practices.pt.md
      verifica: `grep` de "premissas"/"assumptions" retorna ocorrência nos dois arquivos.

- [x] 13. `docs/concepts/constitution-best-practices.md` e `.pt.md`: acrescentar "Higiene de mudança" como seção recomendada.
      altera: docs/concepts/constitution-best-practices.md, docs/concepts/constitution-best-practices.pt.md
      verifica: `grep` de "Higiene de mudança"/"Change hygiene" retorna ocorrência nos dois arquivos.

- [x] 14. Verificação de distribuição: rodar `node bin/oh-my-sdd.js export cursor` duas vezes em diretório temporário e confirmar gravação e idempotência.
      altera: nenhum (verificação)
      verifica: executar o comando duas vezes e comparar o arquivo gerado; segunda execução não duplica o bloco.

- [x] 15. Auditoria de diff: comparar `git diff --stat` com a união dos campos `altera:` das tarefas 1–13; re-ler integralmente os quatro SKILL.md alterados; confirmar ausência de citação externa nos artefatos entregues e `package.json` inalterado.
      altera: nenhum (verificação)
      verifica: relatório de arquivos alterados vs. previstos, sem divergência; `git diff --stat package.json` vazio.
