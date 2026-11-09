# Integração de guardrails comportamentais ao ciclo SDD

**Status:** estudo de viabilidade (não implementado)
**Escopo:** avaliar como incorporar quatro princípios de higiene de código para agentes LLM ao pipeline `constitution → specify → plan → tasks → implement` do oh-my-sdd.
**Referência bibliográfica:** o estudo parte da análise integral de https://github.com/multica-ai/andrej-karpathy-skills. Desse material foram extraídos **conceitos e conhecimentos** (as quatro regras comportamentais), **não** texto, estrutura de arquivos ou implementação. Toda a redação deste documento e todo o desenho de integração são originais e específicos para o contexto do oh-my-sdd. O repositório de origem não tem relação com o oh-my-sdd e não endossa este trabalho; a licença do material original é MIT.

---

## 1. Inventário funcional do material analisado

O material de referência é pequeno (≈960 linhas no total) e tem uma tese central: **o problema não é capacidade do modelo, é comportamento**. A distribuição é:

| Superfície | Função no material | O que faz na prática |
|---|---|---|
| Arquivo de instruções raiz (`CLAUDE.md`) | Carga comportamental por projeto | Injeta quatro princípios no contexto de toda sessão, sem skill, sem comando, sem instalação |
| Skill (`SKILL.md`) | Mesma carga, porém sob demanda | Carrega os princípios quando o agente decide que está escrevendo/revisando/refatorando código |
| Regra de editor (`.cursor/rules/*.mdc`) | Paridade entre ferramentas | `alwaysApply: true` replica o comportamento em outro editor |
| Manifestos de plugin (`.claude-plugin/*.json`) | Distribuição | Empacota a skill para instalação via marketplace |
| `README.md` | Justificativa e instalação | Explica o diagnóstico, as quatro soluções, instalação e "como saber se está funcionando" |
| `EXAMPLES.md` | Treino por contraste | Para cada princípio, mostra um par "errado vs. certo" em código real |
| `CURSOR.md` | Instruções de portabilidade | Explica como manter as três cópias do texto em sincronia |

Observações que importam para o oh-my-sdd:

1. **Não há código executável.** Todo o enforcement é textual (instrução em prompt). Não existe sensor, hook, validação ou teste que prove aderência.
2. **O mesmo conteúdo é duplicado em 3 formatos** e o próprio material admite que precisa manter as cópias em sincronia manualmente. É um custo de manutenção conhecido.
3. **É agnóstico de stack e de processo.** Os princípios não conhecem spec, plan, tasks nem critérios de aceite. Eles operam no nível da *edição de código*.
4. **A força vem da especificidade.** Cada princípio tem um teste objetivo embutido ("toda linha alterada deve rastrear ao pedido", "200 linhas que caberiam em 50 devem ser reescritas"). É isso que o diferencia de conselho genérico.

---

## 2. Decomposição dos quatro princípios

### 2.1 Pensar antes de codar

**Mecânica:** antes de editar, o agente deve (a) declarar premissas, (b) listar interpretações concorrentes quando existirem, (c) propor a alternativa mais simples e discordar quando necessário, (d) parar e nomear a confusão quando algo não estiver claro.

**O que combate:** o agente escolhe uma interpretação silenciosamente e executa até o fim. O erro só aparece depois de muito código escrito.

**Gatilho de aplicação:** tarefa com ambiguidade de escopo, formato, destino ou semântica.

**Teste de aderência:** as premissas aparecem antes da primeira edição? Houve pelo menos uma pergunta ou uma alternativa declarada quando havia ambiguidade?

### 2.2 Simplicidade primeiro

**Mecânica:** produzir o mínimo que resolve o problema. Sem features não pedidas, sem abstração para uso único, sem flexibilidade/configurabilidade especulativa, sem tratamento de erro para cenário impossível. Se o código tem 200 linhas e caberia em 50, reescrever.

**O que combate:** inflação de abstrações, padrões de projeto aplicados antes da necessidade, interfaces com um único implementador.

**Teste de aderência:** um engenheiro sênior chamaria isso de complicado? Cada abstração tem pelo menos dois consumidores reais hoje?

### 2.3 Mudanças cirúrgicas

**Mecânica:** tocar apenas o necessário. Não "melhorar" código adjacente, comentários ou formatação; não refatorar o que não está quebrado; seguir o estilo existente mesmo que se prefira outro. Limpar apenas os órfãos criados pela própria mudança; código morto pré-existente é mencionado, nunca apagado.

**O que combate:** diffs poluídos, reescrita de estilo, regressões silenciosas em código que o agente não entendeu.

**Teste de aderência:** toda linha alterada rastreia diretamente ao pedido/tarefa? O diff contém arquivos que a tarefa não menciona?

### 2.4 Execução orientada a meta

**Mecânica:** converter imperativo em meta verificável antes de executar. Cada etapa do plano declara explicitamente **como será verificada**. O agente itera até a verificação passar, em vez de pedir confirmação a cada passo.

**O que combate:** "vou revisar e melhorar o código" sem critério de sucesso; implementação sem forma de provar que funcionou.

**Teste de aderência:** cada tarefa tem um comando/checagem que a valida? A implementação começou por um teste que reproduz o problema, quando aplicável?

---

## 3. Diagnóstico: o que o oh-my-sdd já cobre

O pipeline atual já resolve parte do problema — e é importante não duplicar o que já existe, sob pena de inflar a cerimônia que a classificação por escala tenta reduzir.

| Princípio | constitution | specify | plan | tasks | implement | Cobertura atual |
|---|---|---|---|---|---|---|
| Pensar antes de codar | parcial (persona/guardrails) | parcial (EARS reduz ambiguidade) | não | não | parcial ("pare e avise" ao desviar) | **~35%** — falta declarar premissas e alternativas no momento da edição |
| Simplicidade primeiro | não | parcial (Nível 1 estrito / Nível 2 flexível) | não | não | não | **~10%** — não há regra contra código especulativo |
| Mudanças cirúrgicas | não | não | não | não | não | **0%** — nada impede diff amplo |
| Execução orientada a meta | não | forte (critérios de aceite) | parcial | parcial (tarefas atômicas) | forte (sensors + gate de evidência) | **~70%** — falta verificação *por tarefa* e reprodução antes de corrigir |

**Conclusão do diagnóstico:** o oh-my-sdd é forte no *antes* (spec/plan) e no *depois* (gate de evidência), mas é fraco no *durante* (a edição propriamente dita). Os três primeiros princípios atacam exatamente essa lacuna. O quarto já está quase todo resolvido e só precisa de um elo: verificação no nível da tarefa, não apenas no nível da feature.

---

## 4. Viabilidade

### 4.1 O que encaixa naturalmente

- **Premissas e ambiguidades** pertencem ao `spec.md` e, residualmente, ao checkpoint de validação. Já existe um checkpoint humano ali; basta exigir que as premissas estejam listadas antes dos requisitos EARS.
- **Alternativas e justificativa de complexidade** pertencem ao `plan.md`, que hoje só descreve "o como" e nunca "por que não o mais simples".
- **Cirurgia e simplicidade** pertencem ao `implement`, que hoje tem proibições de escopo (não inventar requisitos) mas nenhuma regra de higiene de diff.
- **Metas verificáveis** já têm infraestrutura pronta (`sensors.json`, gate de evidência). O ajuste é de granularidade: cada tarefa declara sua própria verificação.

### 4.2 O que NÃO deve ser importado como está

- **Distribuição como skill separada e sempre carregada.** O oh-my-sdd tem seis skills e um orquestrador com ordem estrita. Adicionar uma sétima skill "sempre ativa" cria ambiguidade de precedência e custo de contexto em toda sessão. Melhor: um arquivo de conhecimento compartilhado (`knowledge/`) referenciado pelas skills que já existem.
- **Duplicação do texto em três superfícies.** O `export` do oh-my-sdd já resolve isso por template único (`lib/templates/sdd-rules/rules.md`) e marcadores idempotentes. Basta enriquecer o template, não criar cópias.
- **Aplicação uniforme em toda tarefa.** O material de referência admite o trade-off "cautela sobre velocidade" e pede julgamento em tarefas triviais. O oh-my-sdd já tem classificação por escala; usar essa mesma escala é o encaixe correto, em vez de criar uma segunda régua.

### 4.3 Conflitos e como resolver

| Conflito potencial | Risco | Resolução proposta |
|---|---|---|
| "Cirúrgico" vs. spec/plan que mandam tocar N arquivos | Agente para no meio achando que está ampliando escopo | A tarefa é a fonte do escopo, não a intuição. Se a implementação exigir arquivo fora do previsto, **já existe** a regra de parar e avisar — reutilizar, não duplicar |
| "Simples" vs. constitution que trava stack/padrões | Agente simplifica demais e viola guardrail | Constitution vence sempre. Simplicidade opera **dentro** dos guardrails, nunca contra eles |
| "Premissas explícitas" vs. checkpoint único do QUICK | Cerimônia extra em tarefa trivial | Em QUICK, premissas só são exigidas se houver ambiguidade real; caso contrário, uma linha de assunção no mini-spec basta |
| "Verificação por tarefa" vs. tarefas que não têm teste | Gate impossível de cumprir | Tarefas sem teste declaram verificação por inspeção (arquivo/linha verificados) — sempre verificável de *alguma* forma |
| Enforcement textual sem prova | Regras viram decoração | Fase 2 opcional: sensor executável de escopo de diff (seção 6) |

---

## 5. Desenho de implementação

Princípio de design: **nenhuma skill nova, nenhuma fase nova no pipeline**. O conteúdo entra como (a) um arquivo de conhecimento compartilhado, (b) seções obrigatórias nos artefatos existentes, (c) regras no `implement`, (d) atualização do template exportado. Isso preserva a ordem estrita do orquestrador e não aumenta o número de checkpoints humanos.

### 5.1 Novo arquivo: `knowledge/7-change-hygiene.md`

Fonte única de verdade, referenciada pelas demais skills. Conteúdo proposto (redigido do zero, em PT):

```md
# 7. Higiene de mudança para agentes de código

Quatro regras comportamentais que reduzem desperdício e regressão
durante a implementação. Valem a partir da primeira edição de código.

## A. Explicitar antes de decidir
- Declare premissas que o spec não fixou.
- Se houver mais de uma leitura razoável do requisito, liste-as.
- Se existir caminho mais simples, diga — mesmo que o spec sugira outro.
- Se algo estiver genuinamente indefinido, pare e pergunte. Nunca preencha lacuna em silêncio.

## B. Mínimo que resolve
- Não implemente o que a tarefa não pediu.
- Não crie abstração com um único consumidor.
- Não adicione configuração, extensibilidade ou fallback especulativos.
- Não trate cenário que o domínio torna impossível.
- Se o volume de código passar do que a tarefa justifica, reduza antes de concluir.

## C. Diff cirúrgico
- Toda linha alterada deve rastrear a uma tarefa de `tasks.md`.
- Não reformate, renomeie, reordene nem "melhore" código adjacente intocado.
- Siga o estilo existente do arquivo, mesmo que discorde dele.
- Remova apenas órfãos criados pela própria mudança.
- Código morto pré-existente: mencione no relatório, não apague.

## D. Meta verificável por tarefa
- Cada tarefa declara como será verificada antes de ser executada.
- Bug: primeiro um teste/checagem que reproduz; depois a correção.
- Refatoração: testes verdes antes e depois.
- Sem verificação declarada, a tarefa não está concluída.
```

**Por que arquivo novo e não seção da constitution:** a constitution já está saturada de regras de stack e arquitetura e é específica do projeto. Higiene de mudança é universal e muda de forma diferente. Mantê-los separados evita que regenerações da constitution apaguem essas regras e permite referenciá-las por caminho estável.

### 5.2 `skills/oh-my-sdd-constitution/SKILL.md` e `knowledge/6-example-constitution.md`

- Adicionar uma seção obrigatória **"Higiene de mudança"** na constitution gerada, com 3–5 regras absolutas e específicas do projeto, por exemplo:
  - "Nunca reformate arquivo que a tarefa não pede para alterar."
  - "Nunca introduza abstração com um único consumidor."
  - "Toda tarefa só é concluída com verificação declarada."
- A constitution continua sendo do repositório; o arquivo de conhecimento é o detalhamento genérico. A constitution cita e especializa.
- No modo merge, essas regras entram como diff proposto, nunca por regeneração silenciosa.

### 5.3 `skills/oh-my-sdd-specify/SKILL.md`

Inserir, **antes** dos requisitos EARS, uma seção obrigatória:

```md
## Premissas e Ambiguidades

- Premissa 1: <o que foi assumido e por quê>
- Interpretações concorrentes: <lista, se houver>
- Perguntas em aberto: <o que o usuário precisa decidir>
```

Regras:
- Se houver interpretação concorrente, **nunca** escolher uma sozinho — listar e levar ao checkpoint.
- A seção pode ser curta ("nenhuma ambiguidade identificada"), mas não pode ser omitida.
- No modo condensado (`scale=SMALL`), a seção entra com no máximo 3 linhas.
- No checkpoint, a pergunta passa a ser: "As premissas estão corretas e a interpretação escolhida é a certa?"

### 5.4 `skills/oh-my-sdd-plan/SKILL.md`

Adicionar duas seções ao `plan.md`:

1. **"Alternativas consideradas"** — pelo menos uma alternativa descartada e o motivo. Força o raciocínio de trade-off em vez de aceitar a primeira arquitetura.
2. **"Justificativa de complexidade"** — para cada abstração, camada ou dependência nova: qual problema real ela resolve **hoje** e quantos consumidores tem. Abstração com um consumidor precisa de justificativa explícita ou é removida do plano.

Regra de conflito já existente é mantida: se o spec exigir algo que a constitution proíbe, parar e reportar — nunca decidir sozinho.

### 5.5 `skills/oh-my-sdd-tasks/SKILL.md`

Mudança de formato das tarefas. De:

```md
- [ ] 3. <tarefa atômica>
```

Para:

```md
- [ ] 3. <tarefa atômica>
      altera: <arquivos/módulos previstos>
      verifica: <comando, teste ou inspeção concreta>
```

Regras adicionais:
- Toda tarefa deve ser pequena o bastante para ter **uma** verificação.
- Adicionar tarefa final obrigatória: **"Auditoria de diff"** — comparar `git diff --stat` com os arquivos listados nas tarefas; qualquer arquivo fora do previsto é reportado ao usuário, nunca revertido silenciosamente.
- Tarefa que não rastreia a nenhum requisito/critério do spec é removida ou justificada.
- O campo `verifica:` é o elo que faltava entre o princípio D e o gate de evidência existente.

### 5.6 `skills/oh-my-sdd-implement/SKILL.md`

Inserir regras na Fase 2 (implementação), sem criar fase nova:

1. **Antes da primeira edição:** ler a seção "Premissas e Ambiguidades" do spec e o campo `verifica:` da tarefa atual. Se a tarefa for ambígua na prática, parar e perguntar.
2. **Durante a tarefa:** aplicar higiene de mudança (`knowledge/7-change-hygiene.md`) — simplicidade, cirurgia, limpeza só de órfãos próprios.
3. **Ao concluir a tarefa:** executar a verificação declarada **antes** de marcar `[x]`. Tarefa sem verificação executada permanece desmarcada e é reportada como pendente.
4. **Desvio de escopo:** regra existente é mantida e reforçada — arquivo fora do previsto nas tarefas = parar e avisar.
5. **No modo QUICK:** aplicar apenas A (premissas, se houver ambiguidade), B (mínimo) e C (cirurgia). Verificação por tarefa é substituída pelo gate de evidência já existente.

O gate da Fase 3 permanece inalterado: sensor `required: true` que falha bloqueia o relatório. A diferença é que agora o relatório também mostra, por tarefa, qual verificação foi executada.

### 5.7 `lib/templates/sdd-rules/rules.md` (export multi-ferramenta)

Adicionar um bloco curto, no mesmo tom das regras existentes:

```md
## Change hygiene (applies during implementation)

- **Surface before deciding:** state assumptions and competing interpretations; stop and ask when genuinely unclear. Never fill gaps silently.
- **Minimum that solves:** no unrequested features, no single-use abstractions, no speculative configuration or impossible-scenario handling.
- **Surgical diff:** every changed line must trace to a task; do not reformat or refactor adjacent untouched code; remove only orphans your change created.
- **Verifiable per task:** each task declares how it is verified before execution; a task without verification is not done.
```

Como o `export` já é idempotente por marcadores, todas as superfícies (Cursor, Windsurf, Zed, AGENTS.md, GEMINI.md) recebem a atualização sem trabalho extra e sem duplicação manual.

### 5.8 `README.md` e `docs/` (EN/PT)

- README: seção curta "Change hygiene" sob o fluxo, com os quatro nomes e uma linha cada.
- `docs/architecture/skills.md` e `.pt.md`: atualizar a descrição das fases `specify`, `plan`, `tasks`, `implement` para mencionar as novas seções.
- `docs/concepts/spec-best-practices.md` e `.pt.md`: acrescentar o parágrafo sobre premissas explícitas.
- `docs/concepts/constitution-best-practices.md` e `.pt.md`: acrescentar "Higiene de mudança" como seção recomendada.
- Sem página nova, sem mudança de `nav` no `mkdocs.yml`.

---

## 6. Enforcement executável (opcional, fase posterior)

O material de referência é 100% textual. O oh-my-sdd tem uma vantagem estrutural: já possui sensors executáveis. Para transformar "diff cirúrgico" em prova, e não em promessa:

**Sensor `diff-scope`** em `lib/sensors/detect.js` / `lib/commands/sensor.js`:

- Entrada: lista de arquivos declarada nas tarefas de `tasks.md` (novo campo `altera:`).
- Execução: `git diff --name-only` contra a base da feature (ou `git status --porcelain`).
- Resultado: falha se houver arquivo alterado fora da união declarada.
- Configuração: `required: false` por padrão (diff legítimo pode surgir); o usuário promove a `required: true` quando quiser rigidez.
- Sem git disponível: sensor é `skipped` com motivo, nunca quebra o gate.

**Critério para adiar:** esse sensor exige parsing de `tasks.md`, resolução de base de diff e tratamento de arquivos gerados. É uma feature própria, não um ajuste de texto. Recomenda-se entregá-la só depois que as regras textuais estiverem em uso e houver evidência de que o problema de diff amplo persiste.

---

## 7. Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Aumento de cerimônia contrariar a classificação por escala | Média | Alto | Aplicação proporcional: QUICK recebe só A/B/C; MEDIUM/LARGE recebem tudo. Nenhum checkpoint novo |
| Regras textuais ignoradas pelo modelo | Média | Alto | Formato de tarefa com `verifica:` e auditoria de diff tornam a aderência observável no relatório |
| Sobrescrita de regras do usuário na constitution | Baixa | Alto | Merge com diff proposto; regras manuais intocadas (comportamento já existente) |
| Spec fica mais longo e mais lento de validar | Média | Médio | Seção de premissas limitada a 3–5 itens; "nenhuma ambiguidade" é resposta válida |
| Duplicação entre `knowledge/7` e template exportado | Alta | Baixo | Template é resumo, conhecimento é detalhe; ambos derivam da mesma redação base; revisão conjunta na mesma tarefa |
| Conflito com constitution (stack travada) | Baixa | Médio | Precedência explícita: constitution > simplicidade > preferência do agente |

---

## 8. Ordem de entrega sugerida

### Fase 1 — Núcleo textual (menor risco, maior ganho)

1. Criar `knowledge/7-change-hygiene.md`.
2. Atualizar `skills/oh-my-sdd-implement/SKILL.md` (premissas, simplicidade, cirurgia, verificação por tarefa).
3. Atualizar `skills/oh-my-sdd-tasks/SKILL.md` (formato `altera/verifica` + tarefa de auditoria de diff).
4. Atualizar `knowledge/6-example-constitution.md` e `skills/oh-my-sdd-constitution/SKILL.md` (seção "Higiene de mudança").

### Fase 2 — Artefatos anteriores

5. Atualizar `skills/oh-my-sdd-specify/SKILL.md` (Premissas e Ambiguidades).
6. Atualizar `skills/oh-my-sdd-plan/SKILL.md` (Alternativas + Justificativa de complexidade).

### Fase 3 — Distribuição e documentação

7. Atualizar `lib/templates/sdd-rules/rules.md`.
8. Atualizar `README.md` e docs EN/PT.
9. Verificar `export` em todas as superfícies (idempotência e preservação de conteúdo de terceiros).

### Fase 4 — Opcional executável

10. Sensor `diff-scope` (somente se as fases 1–3 mostrarem necessidade real).

**Por que essa ordem:** implement e tasks concentram o problema diagnosticado (o "durante"), então entregam valor imediato. Specify e plan melhoram a entrada, mas sem o "durante" resolvido o ganho é menor. O template exportado depende do texto final, por isso vem depois.

---

## 9. Critérios de aceite da integração

- [ ] Nenhuma skill nova e nenhuma fase nova no orquestrador; ordem `constitution → specify → plan → tasks → implement` inalterada.
- [ ] `knowledge/7-change-hygiene.md` existe e é referenciado por `implement` (e, quando aplicável, `tasks`).
- [ ] `spec.md` gerado contém a seção "Premissas e Ambiguidades" — inclusive quando a resposta é "nenhuma".
- [ ] `plan.md` gerado contém "Alternativas consideradas" e "Justificativa de complexidade".
- [ ] `tasks.md` gerado usa o formato `altera:/verifica:` e inclui a tarefa final de auditoria de diff.
- [ ] `implement` não marca tarefa como concluída sem executar a verificação declarada.
- [ ] Modo QUICK continua com checkpoint único e sem cerimônia extra quando não há ambiguidade.
- [ ] Constitution gerada contém a seção "Higiene de mudança"; modo merge propõe diff e não sobrescreve regras manuais.
- [ ] `npx oh-my-sdd export <tool>` propaga o novo bloco para todas as superfícies, preservando conteúdo de terceiros.
- [ ] README e docs EN/PT descrevem os quatro princípios e onde cada um atua no pipeline.
- [ ] Atribuição e referência bibliográfica restritas a este documento de estudo; os artefatos entregues (skills, knowledge, template exportado, docs) descrevem as regras em redação própria e contextualizada no oh-my-sdd, sem depender de citação externa para funcionar.
- [ ] Pipeline MEDIUM/LARGE permanece funcionalmente idêntico fora das seções adicionadas; nenhum checkpoint humano removido.

---

## 10. Referências

- Materiais de origem dos conceitos: https://github.com/multica-ai/andrej-karpathy-skills (licença MIT).
- Uso neste projeto: os quatro princípios foram **reaplicados como conceitos** ao ciclo SDD do oh-my-sdd. Nenhuma linha de texto, arquivo ou estrutura do material original foi copiada; as seções acima são redação e desenho próprios.
- Documentos internos consultados: `knowledge/2-goal-of-sdd.md`, `knowledge/3-best-practices-spec.md`, `knowledge/4-practical-example.md`, `knowledge/5-best-practices-constitution.md`, `knowledge/6-example-constitution.md`, `lib/templates/sdd-rules/rules.md`.
