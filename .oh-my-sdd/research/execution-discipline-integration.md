# Integração de disciplina de execução ao ciclo SDD

**Status:** estudo de viabilidade (não implementado)
**Escopo:** avaliar como incorporar as funcionalidades do framework analisado ao pipeline `constitution → specify → plan → tasks → implement` do oh-my-sdd.
**Referência bibliográfica:** https://github.com/obra/superpowers (licença MIT). Deste material foram extraídos **conceitos, técnicas e mecânicas de processo**, não texto, estrutura de arquivos ou implementação. Toda a redação e o desenho de integração abaixo são originais e específicos para o oh-my-sdd. O projeto de origem não tem relação com o oh-my-sdd nem endossa este trabalho.

---

## 1. Inventário funcional do material

O material é um **método completo de desenvolvimento** empacotado como plugin multi-harness. Não é um guia: é um sistema operacional de processo, com bootstrap automático, skills compostas, scripts de estado e testes de comportamento.

### 1.1 Superfícies

| Superfície | Função |
|---|---|
| Manifestos de plugin para 10+ harnesses | Distribuição do mesmo conteúdo em Claude Code, Codex, Cursor, Gemini, Copilot, Kimi, OpenCode, Devin, Pi, Muse, Antigravity, Hermes |
| `hooks/hooks.json` + `hooks/session-start` | Injeta o skill de bootstrap no início de toda sessão (`startup|clear|compact`) |
| `skills/` (15 skills) | O método propriamente dito, em unidades compostas |
| `scripts/` (dentro de skills) | Estado durável: brief por tarefa, pacote de review, ledger, workspace |
| `docs/superpowers/specs/` | Design docs do próprio framework, incluindo experimentos de custo do SDD interno |
| `tests/` + eval externo | Testes de infraestrutura e avaliações de comportamento de agente |

### 1.2 Skills, função por função

**1. `using-superpowers` — bootstrap e roteamento**
Injetado por hook no início da sessão. Institui a regra "se há 1% de chance de um skill se aplicar, invoque antes de qualquer resposta", com tabela de racionalizações proibidas. Define prioridade: skills de processo antes de skills de implementação. É o mecanismo que torna o resto automático.

**2. `brainstorming` — elicitação de requisitos**
Antes de qualquer trabalho criativo. Lê o contexto existente antes de perguntar. Faz uma pergunta aberta por vez, só quando a resposta muda o que será construído. Produz um design doc curto ou completo e exige aprovação humana antes do plano. Trata "não sei o que quero" como o estado normal, não como exceção.

**3. `writing-plans` — plano executável por agente**
Escreve para um engenheiro que não viu o código nem o spec. Estrutura obrigatória: header com Goal, Architecture, Tech Stack, Spec path, **Global Constraints** (valores exatos copiados do spec) e **Review Focus** (classes de input que o spec implica mas nenhum teste cobre). Cada tarefa tem **Files** (create/modify/test), **Interfaces** (consome/produz com assinaturas exatas) e passos RED→GREEN→verify→commit. Faz self-review de cobertura, granularidade, consistência de tipos e proporção.

**4. `executing-plans` — execução inline**
Implementa o plano na própria sessão. Introduz três mecânicas centrais: **ledger** em arquivo (memória que sobrevive à compactação), **rulings** (decisões registradas em vez de paradas), e **completion contract** (teste executado e output lido antes de marcar tarefa). Review final de branch com contexto fresco.

**5. `subagent-driven-development` — execução por subagentes**
Um implementador novo por tarefa, um revisor por tarefa (spec + qualidade), fix loop com cap de 5 rodadas, review final de branch. Gold standard de isolamento de contexto. Seleção explícita de modelo por papel, com a regra "turnos vencem preço por token".

**6. `dispatching-parallel-agents`**
Um agente por domínio independente, dispatchados na mesma resposta. Para falhas de teste não relacionadas ou subsistemas independentes.

**7. `requesting-code-review` / `receiving-code-review`**
Review por subagente com contexto curado (nunca o histórico da sessão). Recepção exige verificação técnica, pushback fundamentado e proibição de concordância performática.

**8. `verification-before-completion`**
Lei de ferro: nenhuma afirmação de conclusão sem evidência fresca. Gate de cinco passos (identificar comando, executar, ler output, verificar, só então afirmar). Tabela de falhas comuns e de racionalizações.

**9. `test-driven-development`**
Lei de ferro: nenhum código de produção sem teste que falhou primeiro. RED verificado, GREEN mínimo, REFACTOR, suíte inteira antes de concluir. Define que teste que passa de primeira é achado sobre o teste, não sucesso.

**10. `systematic-debugging`**
Quatro fases obrigatórias: causa raiz, análise de padrão, hipótese única testada, implementação com teste. Regra de escalada: após 3 correções falhas, questionar a arquitetura em vez de tentar a quarta.

**11. `using-git-worktrees` e `finishing-a-development-branch`**
Isolamento de workspace e encerramento de branch com menu explícito de integração (merge, PR, manter), verificação pós-merge e limpeza conservadora.

**12. `writing-skills`**
Meta-skill: TDD aplicado a documentação de processo. Cenários de pressão com subagentes, baseline sem skill, skill, re-teste, fechamento de brechas. Trata skills como código que molda comportamento.

**13. `diagnosing-superpowers`**
Auto-diagnóstico de sessões: aderência ao plano, evidência de qualidade, trabalho repetido, conflitos de pedido, custo e tempo.

### 1.3 Mecânicas transversais que sustentam o método

- **Ledger de progresso** por plano, gitignored, com identidade, linhas `Task N: complete (commits, testes)` e `Ruling:`.
- **Workspace por plano** com briefs, reports e pacotes de review; nada vaza entre planos.
- **Brief por tarefa**: o subagente nunca lê o plano inteiro, só o recorte da tarefa.
- **Rulings, não paradas**: conflito/ambiguidade é decidido e registrado, exceto quatro casos (destrutivo, segurança, efeito externo, plano irrecuperável).
- **Model routing por papel**: barato para transcrição mecânica, médio para implementação, topo para julgamento e review final.
- **Review scoped por tarefa, review amplo no fim** — resultado de experimentos de custo documentados no próprio repositório.
- **Positive instruction**: regras escritas como ação permitida, não só como proibição.

---

## 2. Diagnóstico de cobertura no oh-my-sdd

O oh-my-sdd cobre bem o **quê** (spec) e o **como** (plan/tasks), e desde a feature de change hygiene cobre parte do **durante** (premissas, mínimo, cirurgia, verificação por tarefa). As lacunas restantes são de **execução e prova**:

| Funcionalidade do material | Cobertura atual | Lacuna real |
|---|---|---|
| Elicitação estruturada | ~50% — specify pergunta no checkpoint, mas não conduz conversa | Falta um modo de descoberta para tarefas vagas |
| Plan header com Global Constraints e Review Focus | ~35% — plan descreve decisões, sem valores exatos nem focus de review | Falta contrato de valores e foco de risco |
| Files/Interfaces por tarefa | ~20% — tasks tem `altera:`/`verifica:`, sem interfaces entre tarefas | Falta assinatura exata de contratos |
| TDD red-green | ~10% — implement verifica, mas não exige teste que falhou primeiro | Falta ciclo RED explícito |
| Verification before completion | ~60% — gate de sensors + verificação por tarefa | Falta regra global de "sem evidência fresca, sem claim" |
| Systematic debugging | 0% | Nenhuma fase de diagnóstico; implement corrige direto |
| Review por contexto fresco | ~20% — existe code-review externo no ecossistema, não no fluxo | Falta gate de review opcional por escala |
| Ledger / retomada | ~70% — sessions em runtime + checkboxes | Falta registro de decisões (rulings) e de evidência por tarefa |
| Decisão autônoma (rulings) | 0% — filosofia atual é "na dúvida, pare e pergunte" | Conflito direto com a constitution; ver §5 |
| Worktrees / branch finish | 0% | Fora do escopo do SDD; pertence ao harness |
| Multi-harness / hooks de bootstrap | ~40% — export de regras para 5 ferramentas | Não requer bootstrap injetado; escala adaptativa já resolve |

---

## 3. Viabilidade por fase

| Fase | Funcionalidade viável | Mecanismo de encaixe | Risco |
|---|---|---|---|
| **constitution** | Regra de evidência antes de claim; política de TDD por tipo de mudança | Nova seção opcional "Execução" no exemplo + skill exige regras de verificação | Baixo |
| **specify** | Elicitação estruturada; design doc curto aprovado | Modo "descoberta" quando a tarefa é vaga; premissas já existem | Médio (cerimônia) |
| **plan** | Global Constraints, Review Focus, Interfaces por tarefa | Novas seções obrigatórias no `plan.md` | Baixo |
| **tasks** | Passos RED→GREEN→verify por tarefa; right-sizing | Estender o formato atual com sub-passos opcionais | Médio (tasks longas) |
| **implement** | TDD, completion contract, debugging sistemático, ledger de rulings, review final | Regras nas Phases 1–3 + gate opcional por escala | Médio |
| **pós-implement** | Review por contexto fresco | Fase 3.5 opcional, sem checkpoint humano | Médio (custo) |

### 3.1 O que deve ser adotado

1. **Verification before completion** como regra transversal — o gate de evidência já existe; falta a proibição explícita de claim sem execução fresca e a exigência de ler o output.
2. **TDD red-green** no `implement`, com exceções explícitas (protótipo, código gerado, configuração) aprovadas pelo usuário.
3. **Systematic debugging** como ramo obrigatório do `implement` quando uma verificação falha: causa raiz antes da correção; após 3 tentativas, parar e questionar arquitetura.
4. **Plan header** com Global Constraints (valores exatos) e Review Focus (riscos que os testes não cobrem).
5. **Tasks com interfaces** entre tarefas (consome/produz), além de `altera:`/`verifica:`.
6. **Ledger de rulings** no runtime, para decisões internas ao plano, com formato `Ruling: decisão — motivo — custo se errado`.
7. **Review de contexto fresco opcional** para MEDIUM/LARGE, sem criar checkpoint humano.

### 3.2 O que deve ser adaptado, não copiado

- **Brainstorming** vira um modo da `specify` (descoberta), não uma skill separada: o pipeline já tem checkpoint ali.
- **Design doc** vira o próprio `spec.md`; não criar artefato paralelo.
- **Subagent orchestration** não deve ser núcleo do oh-my-sdd: o pacote é agnóstico de executor e não deve assumir ferramenta de subagente. Vira recomendação opcional no `implement` para MEDIUM/LARGE.
- **Worktrees / branch finish** pertencem ao harness e a skills externas; fora do escopo.
- **Bootstrap injetado por hook** não é necessário: o orquestrador já é o ponto de entrada.

### 3.3 O que deve ser rejeitado

- **Injeção always-on de skill** — custo de contexto em toda sessão e conflito com a escala adaptativa.
- **"Rulings, não paradas" como padrão** — conflita com a constitution ("na dúvida, pergunte") e com os checkpoints humanos. Ver §5.
- **Cap de 5 rodadas de fix loop** — o oh-my-sdd não tem loop de review automático; importar o mecanismo sem o loop cria complexidade morta.
- **Duplicação multi-harness** — o `export` por template único já resolve.
- **Dependência de scripts de estado externos** — o runtime já tem sessions; criar um segundo ledger concorrente seria fonte de divergência.

---

## 4. Desenho de implementação proposto

Mesmo princípio da feature anterior: **nenhuma skill nova, nenhuma fase nova, nenhum checkpoint novo**. Conteúdo entra em arquivos de conhecimento compartilhado e em seções dos artefatos existentes.

### 4.1 Novos arquivos de conhecimento

**`knowledge/8-verification-discipline.md`**
- Sem evidência fresca, sem claim de conclusão.
- Gate: identificar comando, executar completo, ler output e exit code, comparar com o esperado, só então afirmar.
- Proibido: "deve funcionar", "provavelmente", "confio no agente".
- Aplicação: antes de marcar tarefa, antes de commit, antes de relatório final.

**`knowledge/9-test-first-execution.md`**
- Nenhum código de produção sem teste que falhou primeiro.
- RED verificado, GREEN mínimo, REFACTOR com suíte verde.
- Teste que passa de primeira é achado sobre o teste.
- Exceções: protótipo descartável, código gerado, configuração — com aprovação explícita.
- Suíte inteira antes de concluir, não só o arquivo da tarefa.

**`knowledge/10-systematic-debugging.md`**
- Quatro fases: causa raiz, padrão, hipótese única, implementação com teste.
- Instrumentar fronteiras em sistemas multi-componente antes de propor correção.
- Após 3 correções falhas: parar, questionar arquitetura, levar ao usuário.
- Sintoma nunca é causa.

**`knowledge/11-execution-records.md`**
- Ledger de decisões no runtime: `Ruling: decisão — motivo — custo se errado`.
- Distinção entre decisão interna ao plano (pode registrar e seguir) e decisão de escopo/segurança/irreversível (para e pergunta).
- Retomada: ledger + `tasks.md` + git log; nunca memória da sessão.

### 4.2 `skills/oh-my-sdd-plan/SKILL.md`

Adicionar ao `plan.md`:
- **Global Constraints** — valores exatos copiados do spec (versões, formatos, limites, nomes).
- **Review Focus** — cinco classes de input/falha que o spec implica e nenhum teste cobre, uma por linha.
- **Interfaces por tarefa** — o que a tarefa consome e produz, com nomes e assinaturas exatas.

Self-review obrigatório antes de liberar: cobertura do spec, consistência de tipos entre tarefas, proporção plano/spec.

### 4.3 `skills/oh-my-sdd-tasks/SKILL.md`

Estender o formato atual:

```md
- [ ] 3. <tarefa>
      altera: <arquivos>
      consome: <assinaturas de tarefas anteriores>
      produz: <assinaturas que tarefas seguintes usam>
      verifica: <comando>
      passos:
        1. escrever teste que falha (RED)
        2. rodar e confirmar falha esperada
        3. implementar mínimo (GREEN)
        4. rodar e confirmar verde
```

`passos:` é obrigatório para tarefas de comportamento; opcional para configuração/documentação. Right-sizing: tarefa é a menor unidade com ciclo de teste próprio.

### 4.4 `skills/oh-my-sdd-implement/SKILL.md`

- **TDD como padrão** para tarefas de comportamento: carregar `knowledge/9-test-first-execution.md`; sem teste que falhou primeiro, a tarefa não começa.
- **Completion contract**: antes do `[x]`, executar `verifica:`, ler output e exit code; sem isso, tarefa desmarcada.
- **Debug sistemático**: verificação falhou → `knowledge/10-systematic-debugging.md`; após 3 tentativas, parar, reportar e aguardar.
- **Ledger de rulings**: gravar em `runtime/sessions/<slug>.json` ou arquivo irmão as decisões internas, com custo se errado. Decisões de escopo continuam parando o fluxo.
- **Review final opcional**: em MEDIUM/LARGE, oferecer revisão de contexto fresco (com `code-review` do harness ou skill de review instalada), sem checkpoint novo; findings Critical/Important entram num único passe de correção com teste.

### 4.5 `skills/oh-my-sdd-specify/SKILL.md`

- **Modo descoberta**: se a descrição da tarefa for vaga (sem resultado observável, sem usuário, sem critério), conduzir até 3 perguntas abertas, uma por vez, antes de gerar o spec.
- O spec continua sendo o design doc; nada de artefato paralelo.

### 4.6 `skills/oh-my-sdd-constitution/SKILL.md` + `knowledge/6-example-constitution.md`

- Seção opcional **"Execução e evidência"** com regras do repositório: comando de teste obrigatório, política de TDD, exceções permitidas.
- Mantém precedência: constitution > conhecimento genérico.

### 4.7 Template de export e docs

- Bloco curto "Execution discipline" no `lib/templates/sdd-rules/rules.md`: evidência fresca, TDD, causa raiz antes de correção, decisão registrada vs. parada.
- README + docs EN/PT: atualizar a página de conceitos (mesma estrutura da change hygiene) e o nav do MkDocs.

---

## 5. Conflitos e riscos

| Conflito | Risco | Resolução proposta |
|---|---|---|
| "Rulings, não paradas" vs. constitution "na dúvida, pergunte" | Agente decide sozinho algo que o usuário queria revisar | Só decisões **internas ao plano** viram ruling. Escopo, segurança, irreversível e conflito com spec continuam parando — regra já existente |
| TDD obrigatório vs. tarefas de documentação/configuração | Cerimônia impossível ou teatro de teste | `passos:` opcional por tipo de tarefa; exceções explícitas e aprovadas |
| Review final vs. checkpoints humanos | Mais uma etapa percebida como bloqueio | Review é opcional, sem checkpoint, e só em MEDIUM/LARGE |
| Global Constraints vs. spec já validado | Duplicação de valores | Valores copiados literalmente do spec; self-review detecta divergência |
| Ledger extra vs. sessions existentes | Duas fontes de verdade | Estender o session/artefato existente; `tasks.md` continua fonte formal |
| Contexto: 4 knowledge novos | Custo de leitura por skill | Skills carregam só o arquivo necessário à fase; knowledge é referência sob demanda |
| Sobreposição com change hygiene | Regras duplicadas | Change hygiene = higiene do diff; execução = prova e diagnóstico. Cross-linkar, não repetir |

---

## 6. Ordem de entrega sugerida

### Fase 1 — Evidência e teste (maior ganho)
1. `knowledge/8-verification-discipline.md`
2. `knowledge/9-test-first-execution.md`
3. `skills/oh-my-sdd-implement/SKILL.md` (TDD + completion contract)
4. Constitution + exemplo (seção "Execução e evidência")

### Fase 2 — Diagnóstico e decisão
5. `knowledge/10-systematic-debugging.md`
6. `knowledge/11-execution-records.md`
7. `skills/oh-my-sdd-implement/SKILL.md` (debug branch + ledger de rulings)

### Fase 3 — Contratos do plano e das tarefas
8. `skills/oh-my-sdd-plan/SKILL.md` (Global Constraints, Review Focus, Interfaces)
9. `skills/oh-my-sdd-tasks/SKILL.md` (passos RED→GREEN, interfaces)
10. `skills/oh-my-sdd-specify/SKILL.md` (modo descoberta)

### Fase 4 — Distribuição e docs
11. `lib/templates/sdd-rules/rules.md`
12. README + docs EN/PT + nav MkDocs

### Fase 5 — Opcional
13. Review de contexto fresco opcional por escala (sem checkpoint).

**Ordem justificada:** prova e teste concentram a lacuna real (o "durante" ainda sem garantia de que o código funciona); contratos de plan/tasks melhoram a entrada, mas sem a fase 1 o ganho é menor; docs fecham a entrega.

---

## 7. Critérios de aceite da integração

- [ ] Nenhuma skill nova e nenhuma fase nova no orquestrador; ordem e checkpoints inalterados.
- [ ] `knowledge/8`, `9`, `10`, `11` existem e estão indexados em `knowledge/0-sdd-index.md`.
- [ ] `implement` exige teste que falhou primeiro para tarefas de comportamento, com exceções explícitas.
- [ ] `implement` executa e lê a verificação antes de marcar `[x]`; output e exit code citados.
- [ ] Falha de verificação aciona as quatro fases de debugging; após 3 tentativas, para e reporta.
- [ ] `plan.md` contém Global Constraints, Review Focus e Interfaces.
- [ ] `tasks.md` contém `consome:`/`produz:` e `passos:` quando a tarefa muda comportamento.
- [ ] Rulings são registrados com os três campos, e escopo/segurança continuam parando.
- [ ] Constitution pode incluir seção "Execução e evidência" sem contradizer guardrails existentes.
- [ ] Export propaga o bloco "Execution discipline" com idempotência.
- [ ] Docs EN/PT + nav atualizados.
- [ ] Nenhuma dependência nova, nenhuma chamada de rede, nenhum script externo obrigatório.
