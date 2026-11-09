# Plan: Disciplina de execução no pipeline SDD

## 0. Contexto de pesquisa

Leitura obrigatória antes da implementação: `.oh-my-sdd/research/execution-discipline-integration.md`. Contém a decomposição do material de referência, o diagnóstico de cobertura por fase, os conflitos resolvidos e o desenho original. Em dúvida de redação ou posicionamento, o research prevalece.

## 1. Restrições globais

- Markdown apenas: `skills/**`, `knowledge/**`, `lib/templates/**`, `docs/**`.
- `package.json` inalterado; dependências runtime continuam `chalk`, `inquirer`, `ora`.
- Ordem `constitution → specify → plan → tasks → implement` imutável; checkpoints humanos preservados.
- Nenhuma skill nova, fase nova ou checkpoint novo.
- Toda mudança de fluxo exige página EN e PT + entrada no `nav` quando nova.
- Conflito com `constitution.md`: constitution vence.
- Attribution apenas no research; artefatos entregues com redação própria.

## 2. Decisões arquiteturais

### 2.1 Conhecimento numerado, carregado por fase

Quatro arquivos novos em `knowledge/`, indexados em `knowledge/0-sdd-index.md`:

| Arquivo | Consumidor principal | Papel |
|---|---|---|
| `8-verification-discipline.md` | `implement`, `constitution` | gate "sem evidência fresca, sem claim" |
| `9-test-first-execution.md` | `implement` | RED→GREEN→REFACTOR, exceções, suíte inteira |
| `10-systematic-debugging.md` | `implement` | quatro fases; parada após três tentativas |
| `11-execution-records.md` | `implement` | ruling com três campos e limite de escopo |

Cada skill carrega apenas o arquivo da fase; nada de carregar os quatro em toda execução.

### 2.2 Nenhum segundo mecanismo de estado

O ledger de rulings usa o session existente em `.oh-my-sdd/runtime/sessions/<slug>.json` como base, adicionando um arquivo irmão `<slug>.rulings.md` no mesmo diretório de runtime. `tasks.md` e git log permanecem fonte de verdade formal. Não criar workspace ou script de estado paralelo.

### 2.3 Rigor proporcional pela escala existente

| Escala | Aplicação |
|---|---|
| QUICK | completion contract (evidência) + causa raiz em correção; sem TDD formal |
| SMALL | + TDD para tarefas de comportamento + `passos:` |
| MEDIUM/LARGE | conjunto completo + review opcional de contexto fresco |

### 2.4 Extensão dos artefatos, não novo artefato

- `plan.md` ganha Global Constraints, Review Focus e Interfaces por tarefa.
- `tasks.md` ganha `consome:`, `produz:` e `passos:`.
- `spec.md` ganha apenas o modo descoberta (conversa antes de gerar), não nova seção.
- `constitution.md` ganha seção "Execução e evidência" no exemplo e instrução na skill.

## 3. Contratos de dados

### 3.1 `plan.md`

```md
## Global Constraints
- <valor exato copiado do spec: versão, formato, limite, nome>

## Review Focus
- <classe de input/falha que o spec implica e nenhum teste cobre>

### Task N: <nome>
**Files:** create/modify/test
**Interfaces:**
- Consumes: <assinaturas de tarefas anteriores>
- Produces: <assinaturas que tarefas seguintes usam>
```

Self-review final: cobertura do spec, consistência de tipos entre tarefas, proporção plano/spec.

### 3.2 `tasks.md`

```md
- [ ] N. <tarefa>
      altera: <arquivos>
      consome: <assinaturas>
      produz: <assinaturas>
      verifica: <comando>
      passos:
        1. escrever teste que falha (RED)
        2. rodar e confirmar a falha esperada
        3. implementar o mínimo (GREEN)
        4. rodar e confirmar verde
```

`passos:` reduzido permitido para config/docs/geração, com justificativa na própria tarefa.

### 3.3 Ruling

```md
Ruling: <decisão> — <motivo> — <custo se errado>
```

Gravado em `.oh-my-sdd/runtime/sessions/<slug>.rulings.md`. Só decisão interna ao plano. Escopo, segurança, irreversível, conflito com spec → parar.

### 3.4 Citation/output evidence

Relatório de tarefa cita comando e resultado:

```md
Verificação: `<comando>` → exit 0; saída: `<linha relevante>`
```

### 3.5 Bloco exportado

```md
## Execution discipline

- **Evidence before claims**: cite the command and its output; no claim without a fresh run.
- **Test first:** fail, then implement, then pass; run the whole suite before finishing.
- **Root cause first:** reproduce, instrument, isolate; after three failed fixes, stop and question the architecture.
- **Record, don't improvise:** plan-internal decisions are logged as `Ruling: decision — reason — cost if wrong`; scope, security, and irreversible actions stop and ask.
```

## 4. Arquivos afetados

| Arquivo | Mudança | Requisitos |
|---|---|---|
| `knowledge/8-verification-discipline.md` | novo | Req-01 |
| `knowledge/9-test-first-execution.md` | novo | Req-02 |
| `knowledge/10-systematic-debugging.md` | novo | Req-03 |
| `knowledge/11-execution-records.md` | novo | Req-04 |
| `knowledge/0-sdd-index.md` | 4 entradas | Req-05 |
| `knowledge/6-example-constitution.md` | seção "Execution and evidence" | Req-06 |
| `skills/oh-my-sdd-constitution/SKILL.md` | exigir seção; merge | Req-06 |
| `skills/oh-my-sdd-specify/SKILL.md` | modo descoberta | Req-07 |
| `skills/oh-my-sdd-plan/SKILL.md` | construtos e self-review | Req-08 |
| `skills/oh-my-sdd-tasks/SKILL.md` | interfaces e passos | Req-09 |
| `skills/oh-my-sdd-implement/SKILL.md` | TDD, completion contract, debugging, rulings, review | Req-10, Req-11, Req-12 |
| `lib/templates/sdd-rules/rules.md` | bloco "Execution discipline" | Req-13 |
| `README.md` | seção | Req-14 |
| `docs/architecture/skills.md` + `.pt.md` | fases atualizadas | Req-14 |
| `docs/concepts/execution-discipline.md` + `.pt.md` | páginas novas | Req-14 |
| `mkdocs.yml` | nav | Req-14 |

O orquestrador `skills/oh-my-sdd/SKILL.md` **não** é alterado.

## 5. Alternativas consideradas

- **Skill "execution" sempre ativa** — descartada: custo de contexto em toda sessão, disputa de precedência e conflito com a escala adaptativa.
- **Hook de bootstrap injetando as regras** — descartada: o orquestrador já é o ponto de entrada; hook duplicaria conteúdo em todas as sessões, inclusive fora do SDD.
- **Orquestração de subagentes no pacote** — descartada: o oh-my-sdd é agnóstico de executor; review vira oferta opcional usando mecanismo do ambiente.
- **Arquivo único de conhecimento** — descartada: força carregar debugging/TDD/evidência juntos; separar permite carga por fase.
- **Ledger próprio com workspace e scripts** — descartada: segundo mecanismo de estado concorre com sessions e `tasks.md`.

## 6. Justificativa de complexidade

- **Quatro knowledge separados** — cada fase carrega só o necessário; evita bloat de contexto. Consumidores atuais: `implement` (todos) e `constitution` (evidência).
- **`<slug>.rulings.md` no runtime** — reaproveita diretório e ciclo de vida existentes; um arquivo, sem parser nem comando novo. Consumidor: `implement`.
- **Campos `consome:`/`produz:` e `passos:`** — texto estruturado em markdown, sem validação automática; o custo é de redação, não de código. Consumidor: `implement` e revisor humano.
- **Review opcional** — nenhuma orquestração nova; usa o que o ambiente já oferece. Consumidor: usuário em MEDIUM/LARGE.
- **Nenhuma abstração de código** — nenhuma classe, módulo JS, comando CLI ou script novo.

## 7. Review Focus

- Regra de ruling usada para justificar decisão de escopo (deve parar, não registrar).
- TDD aplicado a tarefa de configuração gerando teste artificial (exceção deve ser explícita).
- Plan/tasks crescendo a ponto de virarem transcrição do código (proporção).
- Knowledge novo contradizendo change hygiene (evidência vs. verificação por tarefa).
- Review opcional interpretado como checkpoint humano.

## 8. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Contexto inflado por knowledge | Carga por fase; índice apenas referencia |
| Cerimônia extra em SMALL | Regras completas só em MEDIUM/LARGE; QUICK mínimo |
| Rulings virarem autonomia indevida | Limite explícito no knowledge e no implement; teste de aceite |
| Divergência EN/PT | Tarefas separadas por idioma; grep de paridade |
| Duplicação com change hygiene | Cross-link; change hygiene trata diff, execução trata prova/diagnóstico |
