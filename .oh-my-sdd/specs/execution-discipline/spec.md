# Spec: Disciplina de execução no pipeline SDD

## 1. Intenção e Visão Geral

O oh-my-sdd garante que existe spec e plano antes do código, e que existe evidência executável depois. Falta garantir o **como durante**: que nenhum código nasce sem teste que falhou primeiro, que falha de verificação aciona diagnóstico de causa raiz, que o plano carrega os valores exatos e os riscos que os testes não cobrem, e que decisões tomadas no meio do caminho ficam registradas em vez de perdidas na memória da sessão.

Esta feature incorpora disciplina de execução ao pipeline existente — evidência antes de claim, TDD red-green, debugging sistemático, contratos de plano/tarefa e ledger de decisões — sem criar skill nova, fase nova ou checkpoint novo. O rigor continua proporcional à escala.

Prioridade central: transformar "o código parece pronto" em "a verificação rodou e o output foi lido", preservando o princípio da constitution de parar e perguntar diante de dúvida real.

## 2. Premissas e Ambiguidades

- **Premissa:** knowledge novo entra como arquivos numerados (`knowledge/8` a `knowledge/11`), seguindo o padrão existente e o índice `knowledge/0-sdd-index.md`.
- **Premissa:** review final opcional usa o mecanismo de review já disponível no ambiente (skill `code-review` ou comando equivalente), sem implementar orquestração de subagentes no pacote.
- **Interpretação concorrente — autonomia de decisões:** o material de referência trata "rulings" como regra geral (decidir e registrar). A constitution exige "na dúvida, pergunte". **Decisão proposta:** ruling só para decisão interna ao plano; escopo, segurança, operação irreversível e conflito com spec continuam parando.
- **Interpretação concorrente — TDD:** tornar TDD obrigatório para toda tarefa cria teatro de teste em configuração/documentação. **Decisão proposta:** obrigatório para tarefas que mudam comportamento; opcional para configuração, documentação e protótipo descartável, com exceção explícita.
- **Pergunta em aberto:** nenhuma.

## 3. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** uma skill precisa da regra de prova de conclusão, o sistema **shall** dispor de `knowledge/8-verification-discipline.md`, definindo o gate "sem evidência fresca, sem claim": identificar o comando, executar completo, ler output e exit code, comparar com o esperado, só então afirmar.
- **[Req-02]** **When** uma skill precisa da regra de teste primeiro, o sistema **shall** dispor de `knowledge/9-test-first-execution.md`, definindo RED verificado, GREEN mínimo, REFACTOR com suíte verde, exceções explícitas e a exigência de rodar a suíte inteira antes de concluir.
- **[Req-03]** **When** uma verificação falha durante a implementação, o sistema **shall** dispor de `knowledge/10-systematic-debugging.md`, com quatro fases (causa raiz, padrão, hipótese única, implementação com teste) e a regra de parar e questionar a arquitetura após três tentativas falhas.
- **[Req-04]** **When** uma decisão for tomada durante a execução, o sistema **shall** dispor de `knowledge/11-execution-records.md`, definindo o registro `Ruling: decisão — motivo — custo se errado`, o escopo restrito a decisões internas ao plano e a retomada baseada em ledger, `tasks.md` e git log.
- **[Req-05]** **When** um novo arquivo de conhecimento é criado, o sistema **shall** adicioná-lo ao índice `knowledge/0-sdd-index.md`.
- **[Req-06]** **When** `oh-my-sdd-constitution` gera uma constitution, o sistema **shall** oferecer uma seção "Execução e evidência" com regras do repositório (comando de teste obrigatório, política de TDD, exceções); **while** em modo merge, o sistema **shall** propor as regras como diff e preservar edições manuais.
- **[Req-07]** **When** a descrição de uma tarefa não tiver resultado observável, usuário ou critério verificável, `oh-my-sdd-specify` **shall** operar em modo descoberta, fazendo no máximo três perguntas abertas, uma por vez, antes de gerar o spec.
- **[Req-08]** **When** `oh-my-sdd-plan` gera um `plan.md`, o sistema **shall** incluir **Global Constraints** (valores exatos copiados do spec), **Review Focus** (riscos que o spec implica e nenhum teste cobre) e **Interfaces** por tarefa (consome/produz com nomes e assinaturas exatas), e **shall** executar self-review de cobertura, consistência de tipos e proporção antes de liberar.
- **[Req-09]** **When** `oh-my-sdd-tasks` gera um `tasks.md`, o sistema **shall** acrescentar `consome:` e `produz:` às tarefas que cruzam interfaces, e `passos:` com o ciclo RED→confirmar falha→GREEN→confirmar verde para tarefas que mudam comportamento; **if** a tarefa for de configuração, documentação ou geração, o sistema **shall** permitir `passos:` reduzido com justificativa.
- **[Req-10]** **When** `oh-my-sdd-implement` executa uma tarefa de comportamento, o sistema **shall** exigir teste que falhou primeiro, executar a verificação declarada e ler seu output e exit code antes de marcar `[x]`; **if** a verificação falhar, o sistema **shall** aplicar as quatro fases de debugging; **if** três correções falharem, o sistema **shall** parar, reportar a hipótese arquitetural e aguardar o usuário.
- **[Req-11]** **When** uma decisão interna ao plano surgir, o sistema **shall** registrá-la como ruling com os três campos e continuar; **if** a decisão envolver escopo, segurança, operação irreversível ou conflito com o spec, o sistema **shall** parar e perguntar.
- **[Req-12]** **When** a feature for MEDIUM ou LARGE, o sistema **may** oferecer revisão de contexto fresco ao final; **if** o usuário aceitar, o sistema **shall** corrigir findings Critical/Important em um único passe, cada correção verificada por teste que falhou primeiro, sem criar checkpoint humano novo.
- **[Req-13]** **When** o usuário invoca `oh-my-sdd export <ferramenta>`, o sistema **shall** propagar um bloco "Execution discipline" com as regras destiladas, preservando conteúdo de terceiros e a idempotência por marcadores.
- **[Req-14]** **When** README ou documentação EN/PT for atualizada, o sistema **shall** descrever a disciplina de execução e em qual fase cada regra atua, mantendo paridade entre idiomas e entrada no `nav` quando houver página nova.
- **[Req-15]** **If** uma regra de execução conflitar com `constitution.md`, o sistema **shall** aplicar a constitution e reportar o conflito, nunca flexibilizar stack, segurança ou padrões do projeto.

## 4. Critérios de Aceite

- [ ] `knowledge/8-verification-discipline.md` existe com o gate de evidência e está no índice.
- [ ] `knowledge/9-test-first-execution.md` existe com o ciclo RED→GREEN→REFACTOR e exceções.
- [ ] `knowledge/10-systematic-debugging.md` existe com as quatro fases e a regra das três tentativas.
- [ ] `knowledge/11-execution-records.md` existe com formato de ruling e limite de escopo.
- [ ] `knowledge/0-sdd-index.md` lista os quatro arquivos novos.
- [ ] Constitution e exemplo incluem seção "Execução e evidência"; merge preserva edições manuais.
- [ ] `oh-my-sdd-specify` define modo descoberta com no máximo três perguntas abertas.
- [ ] `oh-my-sdd-plan` exige Global Constraints, Review Focus, Interfaces e self-review.
- [ ] `oh-my-sdd-tasks` define `consome:`/`produz:` e `passos:` RED→GREEN com exceção justificada.
- [ ] `oh-my-sdd-implement` exige teste que falhou primeiro, leitura de output/exit code e debugging após falha.
- [ ] Três tentativas falhas param o fluxo com hipótese arquitetural reportada.
- [ ] Rulings são registrados com três campos; escopo/segurança/irreversível continuam parando.
- [ ] Review opcional só aparece em MEDIUM/LARGE e não cria checkpoint.
- [ ] Export propaga "Execution discipline" de forma idempotente.
- [ ] README e docs EN/PT atualizados, com nav coerente.
- [ ] Nenhuma skill nova, fase nova, checkpoint novo, dependência nova ou chamada de rede.

## 5. Requisitos Não-Funcionais e Contratos

- **Stack e dependências:** mudança é markdown de skills/knowledge/template e docs. `package.json` permanece com `chalk`, `inquirer`, `ora`.
- **Compatibilidade:** ordem `constitution → specify → plan → tasks → implement` imutável; checkpoints humanos existentes preservados.
- **Escala:** QUICK aplica só completion contract e correção com causa raiz; SMALL aplica TDD e contratos essenciais; MEDIUM/LARGE aplicam o conjunto completo e podem usar review opcional.
- **Fonte de verdade:** `tasks.md` e o código são formais; ledger/runtime é cache de retomada. Divergência resolve a favor de `tasks.md` + git log.
- **Segurança de escopo:** rulings nunca autorizam escrita fora do repositório, mudança de dependência, operação destrutiva ou efeito externo.
- **Idempotência:** export mantém marcadores e merge preservados.
- **i18n:** toda mudança de fluxo exige EN e PT.
- **Atribuição:** o research cita o material de referência como bibliografia; skills, knowledge, template e docs entregues usam redação própria.
- **Fora de escopo:** orquestração de subagentes, worktrees, finishing de branch, hooks de bootstrap e scripts externos de estado.
