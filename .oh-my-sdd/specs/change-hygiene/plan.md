# Plan: Guardrails comportamentais no pipeline SDD

## 0. Contexto de pesquisa

Leitura obrigatória antes da implementação: `.oh-my-sdd/research/behavioral-guardrails-integration.md`. O documento contém a análise de viabilidade, a decomposição dos quatro guardrails, o diagnóstico de cobertura por fase, os conflitos resolvidos e o desenho original de implementação. Este plano deriva dele; quando houver dúvida de redação ou de posicionamento, o research é a fonte de contexto.

## 1. Decisões arquiteturais

### 1.1 Fonte única em `knowledge/`, sem skill nova

Os quatro guardrails entram em `knowledge/7-change-hygiene.md`, seguindo o padrão já existente de arquivos numerados (`knowledge/0` a `knowledge/6`). As skills que precisam dos guardrails os referenciam por caminho neste arquivo. Motivo: o instalador copia `knowledge/` para dentro de cada skill instalada (`Writer.install()` faz `cpSync(KNOWLEDGE_SRC, <skill>/knowledge)`), então a referência por caminho relativo funciona no pacote e na instalação, sem novo mecanismo de distribuição.

Nenhuma skill nova é criada. O orquestrador continua com seis skills e ordem imutável. O conteúdo é incorporado como seções obrigatórias nos artefatos que cada skill já gera.

O novo arquivo entra também em `knowledge/0-sdd-index.md`, que é o índice de navegação do knowledge carregado pela IA. Sem esse item, o arquivo existiria mas ficaria fora do caminho de descoberta; o índice é atualizado na mesma tarefa que cria o `knowledge/7`.

### 1.2 Distribuição do conteúdo por fase

| Fase | Artefato alterado | Guardrail | Mecanismo |
|---|---|---|---|
| knowledge | `knowledge/0-sdd-index.md` | descoberta | novo item no índice de conhecimento, linkando `7-change-hygiene.md` |
| constitution | `skills/oh-my-sdd-constitution/SKILL.md` + `knowledge/6-example-constitution.md` | higiene como regra do repo | nova seção obrigatória "Higiene de mudança"; merge continua apresentando diff |
| specify | `skills/oh-my-sdd-specify/SKILL.md` | premissas explícitas | seção "Premissas e Ambiguidades" antes de EARS; máximo 3 linhas em SMALL |
| plan | `skills/oh-my-sdd-plan/SKILL.md` | simplicidade/trade-offs | seções "Alternativas consideradas" e "Justificativa de complexidade" |
| tasks | `skills/oh-my-sdd-tasks/SKILL.md` | meta verificável + escopo | formato `altera:`/`verifica:` por tarefa + tarefa final de auditoria de diff |
| implement | `skills/oh-my-sdd-implement/SKILL.md` | execução disciplinada | ler premissas e `verifica:`; executar verificação antes de `[x]`; parar em desvio de escopo |
| distribuição | `lib/templates/sdd-rules/rules.md` | propagação | bloco "Change hygiene" em inglês, dentro dos marcadores existentes |
| docs | `README.md`, `docs/**` EN/PT | comunicação | seção curta + atualização das descrições de fase |

### 1.3 Proporcionalidade por escala

Reutiliza a classificação já existente (`scale.json`), sem segunda régua:

- **QUICK:** premissas apenas se houver ambiguidade real; mínimo que resolve; diff cirúrgico. Checkpoint único inalterado. Verificação por tarefa não é exigida além do gate de evidência existente.
- **SMALL:** premissas em até 3 linhas; `altera:`/`verifica:` completos; auditoria de diff.
- **MEDIUM/LARGE:** conjunto completo, dois checkpoints humanos mantidos.

### 1.4 Ordem de geração dos artefatos

Nenhuma mudança no orquestrador. As seções novas entram dentro das fases existentes. O `implement` lê a seção de premissas e o campo `verifica:` da tarefa atual **antes** da primeira edição de código; a verificação é executada **antes** do checkbox ser marcado, mantendo a ordem atual "implementa → marca → atualiza session" apenas com a checagem inserida entre implementar e marcar.

## 2. Contratos de dados (formato dos artefatos)

### 2.1 `knowledge/7-change-hygiene.md`

```md
# 7. Higiene de mudança para agentes de código

## A. Explicitar antes de decidir
## B. Mínimo que resolve
## C. Diff cirúrgico
## D. Meta verificável por tarefa
```

Linguagem absoluta ("sempre"/"nunca"), sem citação externa, referenciável por `knowledge/7-change-hygiene.md`.

### 2.2 Seção em `spec.md`

```md
## Premissas e Ambiguidades

- Premissa: <o que foi assumido e por quê>
- Interpretações concorrentes: <lista, se houver>
- Perguntas em aberto: <decisões pendentes do usuário>
```

Resposta "nenhuma ambiguidade identificada" é válida e não pode ser omitida.

### 2.3 Seções em `plan.md`

```md
## Alternativas consideradas

- <alternativa> — descartada porque <motivo>

## Justificativa de complexidade

- <abstração/camada/dependência> — resolve <problema real hoje>; consumidores atuais: <N>
```

### 2.4 Seção em `constitution.md`

```md
## 4. Higiene de mudança

- **Sempre** <regra global verificável>.
- **Nunca** <prática proibida>.
```

Regras específicas do repositório, nunca descrição de feature. Numeração ajustada ao documento existente.

### 2.5 Formato de `tasks.md`

```md
## Tasks

- [ ] 1. <tarefa atômica>
      altera: <arquivo(s)/módulo(s)>
      verifica: <comando, teste ou inspeção>
...
- [ ] N. Auditoria de diff
      altera: nenhum
      verifica: comparar `git diff --stat` com os `altera:` das tarefas; reportar arquivos fora do previsto
```

Uma verificação por tarefa. Tarefa sem rastreio a requisito/critério é removida ou justificada. O campo `verifica:` aceita comando executável ou inspeção explícita (arquivo + o que conferir).

### 2.6 Bloco no template exportado

Bloco "Change hygiene" em inglês, no mesmo tom do template atual, inserido entre `<!-- oh-my-sdd:start -->` e `<!-- oh-my-sdd:end -->`. O `export` já substitui o miolo por regex de marcadores; nenhuma mudança em `lib/commands/export.js` é necessária.

## 3. Bibliotecas e dependências

Nenhuma. Implementação é markdown + template. `package.json` intocado; sem dependências novas; sem chamadas de rede.

## 4. Arquivos afetados

| Arquivo | Mudança | Requisitos |
|---|---|---|
| `knowledge/7-change-hygiene.md` | novo, 4 seções | Req-01 |
| `knowledge/0-sdd-index.md` | novo item no índice apontando para `7-change-hygiene.md` | Req-01 |
| `knowledge/6-example-constitution.md` | seção "Higiene de mudança" no exemplo | Req-02 |
| `skills/oh-my-sdd-constitution/SKILL.md` | exigir a seção na Fase 4 | Req-02 |
| `skills/oh-my-sdd-specify/SKILL.md` | seção de premissas na Fase 3; modo SMALL | Req-03 |
| `skills/oh-my-sdd-plan/SKILL.md` | alternativas + complexidade na Fase 2 | Req-04 |
| `skills/oh-my-sdd-tasks/SKILL.md` | formato e auditoria de diff na Fase 2 | Req-05 |
| `skills/oh-my-sdd-implement/SKILL.md` | leitura, verificação antes de `[x]`, desvio de escopo, QUICK | Req-06, Req-07, Req-09 |
| `lib/templates/sdd-rules/rules.md` | bloco "Change hygiene" | Req-08 |
| `README.md` | seção "Change hygiene" | Req-10 |
| `docs/architecture/skills.md` + `.pt.md` | descrição das fases | Req-10 |
| `docs/concepts/spec-best-practices.md` + `.pt.md` | premissas explícitas | Req-10 |
| `docs/concepts/constitution-best-practices.md` + `.pt.md` | seção recomendada | Req-02, Req-10 |

O orquestrador `skills/oh-my-sdd/SKILL.md` **não** é alterado.

## 5. Alternativas consideradas

- **Skill nova "sempre ativa"** — descartada: cria disputa de precedência com as seis skills existentes, carrega contexto em toda sessão e não tem ponto de aplicação definido no pipeline.
- **Colocar tudo na constitution** — descartada: constitution é específica do repositório e pode ser regenerada; regras universais de higiene precisam de fonte estável e independente.
- **Duplicar o texto em cada superfície de ferramenta** — descartada: o `export` já centraliza em `lib/templates/sdd-rules/rules.md` com marcadores idempotentes.
- **Sensor executável de escopo de diff nesta entrega** — descartada: exige parsing de `tasks.md`, base de diff e tratamento de arquivos gerados; é feature própria. Fica para fase futura.

## 6. Justificativa de complexidade

- **`knowledge/7` como arquivo separado** — evita que regeneração da constitution apague regras universais; um único ponto de referência para todas as skills. Consumidores atuais: `implement` (e, por referência, `tasks`).
- **Seções obrigatórias em artefatos existentes** — zero novos conceitos: reaproveitam spec/plan/tasks/constitution. Consumidores: os checkpoints humanos que já existem.
- **Campos `altera:`/`verifica:`** — substituem texto livre por contrato verificável, sem novo parser; a auditoria é inspeção humana/agente sobre `git diff`, não automação. Consumidor: `implement`.
- **Nenhuma abstração nova de código** — nenhuma classe, módulo JS ou comando CLI é criado.

## 7. Riscos e mitigação

| Risco | Mitigação no plano |
|---|---|
| Cerimônia extra em tarefa trivial | Subconjunto QUICK explícito; nenhum checkpoint novo |
| Spec mais lento de validar | Premissas limitadas a poucos itens; "nenhuma ambiguidade" aceita |
| Regras ignoradas pelo modelo | `verifica:` por tarefa + auditoria de diff tornam aderência observável no relatório |
| Divergência EN/PT | Req-10 exige paridade; tarefas separadas por idioma |
| Cópia indevida de texto externo | Redação própria e contextualizada; citação só no documento de estudo |
