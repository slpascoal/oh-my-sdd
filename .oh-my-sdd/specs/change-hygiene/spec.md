# Spec: Guardrails comportamentais no pipeline SDD

## 1. Intenção e Visão Geral

O oh-my-sdd hoje é forte no **antes** (spec/plan) e no **depois** (sensors e gate de evidência), mas não disciplina o **durante** — o momento em que o agente edita código. Isso permite quatro falhas recorrentes: interpretação silenciosa de requisito ambíguo, código especulativo acima do necessário, diff amplo com reformatação/refatoração não pedida e tarefa concluída sem prova de que funciona.

Esta feature incorpora quatro guardrails comportamentais ao pipeline existente — **premissas explícitas**, **mínimo que resolve**, **diff cirúrgico** e **verificação por tarefa** — usando os artefatos e checkpoints que já existem. O objetivo é tornar a higiene de mudança observável nos próprios artefatos, não adicionar cerimônia: nenhuma skill nova, nenhuma fase nova, nenhum checkpoint novo. A classificação por escala continua governando quanto rigor cada tarefa recebe.

Prioridade central: fechar a lacuna do "durante" sem inflar o fluxo e sem duplicar o que constitution, spec e gate de evidência já cobrem.

## 2. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** o pacote é instalado ou consultado por uma skill, o sistema **shall** dispor de uma fonte única de conhecimento sobre higiene de mudança (`knowledge/7-change-hygiene.md`) com quatro seções — explicitar antes de decidir, mínimo que resolve, diff cirúrgico e meta verificável por tarefa — redigida em linguagem absoluta e referenciável por caminho estável.
- **[Req-02]** **When** `oh-my-sdd-constitution` gera uma constitution nova, o sistema **shall** incluir uma seção "Higiene de mudança" com regras absolutas e específicas do repositório; **while** opera em modo merge, o sistema **shall** apresentar as regras novas como diff proposto e nunca sobrescrever edições manuais do usuário.
- **[Req-03]** **When** `oh-my-sdd-specify` gera um `spec.md`, o sistema **shall** incluir a seção "Premissas e Ambiguidades" antes dos requisitos EARS, registrando premissas, interpretações concorrentes e perguntas em aberto; **if** existir mais de uma interpretação razoável, o sistema **shall** listá-las ao usuário em vez de escolher uma silenciosamente; **while** em modo condensado (`scale=SMALL`), a seção **shall** ocupar no máximo três linhas.
- **[Req-04]** **When** `oh-my-sdd-plan` gera um `plan.md`, o sistema **shall** incluir as seções "Alternativas consideradas" (ao menos uma alternativa descartada com motivo) e "Justificativa de complexidade" (para cada abstração, camada ou dependência nova: problema real de hoje e número de consumidores atuais).
- **[Req-05]** **When** `oh-my-sdd-tasks` gera um `tasks.md`, o sistema **shall** registrar, para cada tarefa, os campos `altera:` (arquivos/módulos previstos) e `verifica:` (comando, teste ou inspeção concreta); **shall** incluir uma tarefa final obrigatória de auditoria de diff; **if** uma tarefa não rastrear a nenhum requisito ou critério do spec, o sistema **shall** removê-la ou justificá-la.
- **[Req-06]** **When** `oh-my-sdd-implement` executa uma tarefa, o sistema **shall** ler a seção "Premissas e Ambiguidades" do spec e o campo `verifica:` da tarefa antes da primeira edição; **shall** executar a verificação declarada antes de marcar o checkbox como concluído; **if** a verificação não for executada, o sistema **shall** manter a tarefa desmarcada e reportá-la como pendente.
- **[Req-07]** **If** a implementação exigir alterar arquivo fora do campo `altera:` das tarefas, o sistema **shall** parar, explicar o desvio ao usuário e aguardar orientação, sem decidir ou reverter silenciosamente.
- **[Req-08]** **When** o usuário invoca `oh-my-sdd export <ferramenta>`, o sistema **shall** propagar um bloco "Change hygiene" para a superfície alvo, preservando conteúdo de terceiros e a idempotência por marcadores já existente.
- **[Req-09]** **When** o fluxo roda em escala QUICK, o sistema **shall** aplicar apenas premissas (se houver ambiguidade real), mínimo que resolve e diff cirúrgico, mantendo o checkpoint único existente e sem exigir verificação por tarefa além do gate de evidência.
- **[Req-10]** **When** README ou documentação EN/PT for atualizada, o sistema **shall** descrever os quatro guardrails e em qual fase cada um atua, mantendo paridade entre os dois idiomas.
- **[Req-11]** **When** qualquer artefato entregue descrever os guardrails, o sistema **shall** usar redação própria e contextualizada no oh-my-sdd; citação bibliográfica do material de referência **may** aparecer no documento de estudo, mas nenhuma entrega depende dela para funcionar.
- **[Req-12]** **If** um guardrail entrar em conflito com `constitution.md`, o sistema **shall** aplicar a constitution como restrição vinculante e reportar o conflito, nunca flexibilizar stack, segurança ou padrões do projeto.

## 3. Critérios de Aceite

- [ ] `knowledge/7-change-hygiene.md` existe com as quatro seções e é referenciado por `skills/oh-my-sdd-implement/SKILL.md`.
- [ ] `skills/oh-my-sdd-constitution/SKILL.md` e `knowledge/6-example-constitution.md` exigem a seção "Higiene de mudança"; modo merge continua preservando edições manuais.
- [ ] `skills/oh-my-sdd-specify/SKILL.md` exige "Premissas e Ambiguidades" antes dos requisitos EARS, com limite de três linhas em `scale=SMALL`.
- [ ] `skills/oh-my-sdd-plan/SKILL.md` exige "Alternativas consideradas" e "Justificativa de complexidade".
- [ ] `skills/oh-my-sdd-tasks/SKILL.md` define o formato `altera:/verifica:` e a tarefa final de auditoria de diff.
- [ ] `skills/oh-my-sdd-implement/SKILL.md` exige verificação executada antes de marcar `[x]` e define o comportamento de desvio de escopo.
- [ ] Modo QUICK mantém checkpoint único e não ganha cerimônia extra; modo MEDIUM/LARGE mantém os dois checkpoints humanos existentes.
- [ ] O orquestrador (`skills/oh-my-sdd/SKILL.md`) mantém a ordem `constitution → specify → plan → tasks → implement` e nenhuma skill nova é criada.
- [ ] `lib/templates/sdd-rules/rules.md` contém o bloco "Change hygiene"; `npx oh-my-sdd export cursor` (e demais superfícies) grava a atualização preservando conteúdo de terceiros e sem duplicar o bloco em execuções repetidas.
- [ ] README e docs EN/PT descrevem os quatro guardrails e a fase de atuação de cada um.
- [ ] Nenhuma dependência de runtime nova e nenhuma chamada de rede introduzida.
- [ ] Toda skill alterada foi relida integralmente e o pipeline MEDIUM/LARGE permanece funcional fora das seções adicionadas.

## 4. Requisitos Não-Funcionais e Contratos

- **Stack e dependências:** implementação é markdown de skills, knowledge e template, mais docs. **Nunca** adicionar dependência de runtime; `package.json` permanece com `chalk`, `inquirer` e `ora`.
- **Compatibilidade:** nenhuma skill nova, nenhuma fase nova, nenhum checkpoint novo; a ordem do orquestrador é imutável.
- **Escala:** o rigor é proporcional — QUICK recebe o subconjunto mínimo; MEDIUM/LARGE recebem o conjunto completo. Nenhum modo perde checkpoint humano existente.
- **Idempotência:** `export` continua usando marcadores `oh-my-sdd:start/end` e merge que preserva conteúdo de terceiros; executar duas vezes não duplica o bloco.
- **Rastreabilidade:** cada guardrail entra em um artefato nomeado e é verificável por leitura do próprio artefato; aderência à execução é reportada pelo `implement`, não auto-afirmada.
- **i18n:** toda mudança de fluxo exige atualização EN e PT dos docs.
- **Atribuição:** o documento de estudo pode citar o material de referência como bibliografia; skills, knowledge, template e docs entregues contêm apenas redação própria.
- **Fora de escopo:** sensor executável de escopo de diff (`diff-scope`) — fica como fase futura opcional, sem bloquear esta entrega.
