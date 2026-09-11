# Plan: Roteamento por escala no orquestrador

## 1. Decisões Arquiteturais

- **100% skills, zero CLI:** classificação e registro são regras nos SKILL.md; nenhum código novo em lib/. Constitution §2 respeitada.
- **Nova Fase no orquestrador (`oh-my-sdd/SKILL.md`):** "Fase 2.5 — Classificar Escala" entre a detecção de continuação e a ativação da constitution. Critérios explícitos em tabela dentro do SKILL.md; resultado em uma linha ("escala SMALL — motivo: ...") + registro em `.oh-my-sdd/runtime/scale.json`.
- **QUICK:** orquestrador grava mini-spec (intenção ≤5 linhas + ≤5 critérios) em `runtime/scale.json` (campo `mini_spec`), faz checkpoint único, e ativa `oh-my-sdd-implement` em **modo QUICK** (recebe mini-spec inline, sem pasta `specs/<slug>/`, sensors gate apenas se sensors.json existir).
- **SMALL:** constitution (confirmação) + `oh-my-sdd-specify` em **modo condensado** (Intenção + EARS + Critérios, sem seção NFR) + `oh-my-sdd-tasks` com **seção "Decisões"** (plan embutido — não gera plan.md) + 2 checkpoints obrigatórios.
- **MEDIUM/LARGE:** pipeline atual intacto.
- **Escape (Req-03):** implement detecta escala excedida → para, orquestrador reclassifica para cima e retoma da fase apropriada (spec condensado vira completo, etc.).
- **Override (Req-06):** usuário pode forçar escala ("roda fluxo completo"); registrado em scale.json. Modelo reclassifica só para cima; nunca rebaixa sem override.
- **Modo QUICK exige sensors.json:** se não existir, implement QUICK segue sem gate (comportamento pré-sensor).

## 2. Esquema de Dados

`.oh-my-sdd/runtime/scale.json` (gitignored):
```json
{
  "task": "texto da tarefa",
  "scale": "QUICK | SMALL | MEDIUM | LARGE",
  "reason": "motivo em uma linha",
  "override": false,
  "mini_spec": { "title": "...", "intent": "...", "criteria": ["..."] },
  "recordedAt": "ISO-8601"
}
```
`mini_spec` presente apenas quando scale=QUICK.

## 3. Bibliotecas e Dependências

- Nenhuma. Escrita de JSON via regra da skill (Write tool) — sem CLI novo.

## 4. Contratos entre Skills

- Orquestrador passa `scale=QUICK|SMALL|MEDIUM|LARGE` + contexto (mini-spec ou slug) na ativação das sub-skills.
- `oh-my-sdd-specify` aceita modo condensado (flag `scale=SMALL`).
- `oh-my-sdd-tasks` aceita `scale=SMALL` (gera tasks.md com seção Decisões, lê spec.md sem exigir plan.md).
- `oh-my-sdd-implement` aceita modo QUICK (mini-spec inline) e mantém detecção de escape (Req-03) reportando ao orquestrador.

## 5. Estratégia de Verificação

- CA-1 (QUICK): tarefa trivial classifica QUICK, mini-spec + checkpoint único, sem pasta specs/.
- CA-2 (MEDIUM): pipeline completo inalterado.
- CA-3 (escape): QUICK que cresce → reclassificação visível.
- CA-4 (override): override respeitado e registrado.
- CA-5 (saída): classificação + motivo em uma linha.
- CA-6 (docs): README + docs EN/PT com os 4 níveis.
- Verificação por leitura integral dos SKILL.md alterados + simulação dos fluxos (fixtures não aplicáveis — mudança é de comportamento de skill).

## 6. Documentação

- README.md: seção "Adaptive scale" com os 4 níveis.
- docs/ EN + PT: seção em página de conceitos ou getting-started; sem página nova (sem mudança de nav).
