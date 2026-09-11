# Spec: Export do fluxo SDD portabilidade do fluxo SDD para outras ferramentas

# Spec: Export para outras ferramentas de IA

## 1. Intenção e Visão Geral

O oh-my-sdd é exclusivo Claude Code. Esta feature exporta o fluxo SDD como regras para outras ferramentas de IA (Cursor, Codex, Gemini CLI, Windsurf, Zed) — sem MCP e sem runtime, apenas regras markdown com o workflow destilado, para qualquer ferramenta seguir constitution/spec/plan/tasks.

Prioridade central: SDD portável como regras estáticas, sem lock-in no Claude Code.

## 2. Requisitos Funcionais (EARS/GEARS)

## 2. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** `npx oh-my-sdd export <tool>` roda, o sistema **shall** gravar regras SDD destiladas (pipeline, checkpoints, layout .oh-my-sdd/, constitution de referência) na superfície da ferramenta alvo: cursor → `.cursor/rules/own-file.mdc`; codex → seção delimitada em `AGENTS.md`; gemini → seção em `GEMINI.md`; windsurf → own-file em `.windsurf/rules/`; zed → own-file em `.zed/rules/`.
.zed/rules/`.
- **[Req-02]** **If** ferramenta alvo não suportada, o sistema **shall** listar suportadas e sair 1.
- **[Req-03]** **When** superfícies single-file (AGENTS.md/GEMINI.md), o sistema **shall** gravar seção delimitada por marcadores `<!-- oh-my-sdd:start|end -->`, merge idempotente, nunca clobber de terceiros.
- **[Req-04]** **When** superfícies multi-file (cursor/windsurf/zed), gravar arquivo próprio oh-my-sdd-named; nunca tocar arquivos de terceiros.
- **[Req-05]** Templates de regras SDD versionados em `lib/templates/sdd-rules/` — conteúdo destilado, tool-agnostic.

## 3. Critérios de Aceite

- [ ] export cursor → own-file, conteúdo SDD destilado.
- [ ] projeto com AGENTS.md existente: export codex → seção marcada, re-run idempotente, sem duplicatas.
- [ ] <tool> inválido → lista suportadas, exit 1.
- [ ] Re-run não duplica seções.
- [ ] Conteúdo exportado é tool-agnostic (nunca precondição Claude Code).
- [ ] README + docs EN/PT atualizados (comando + tabela de suporte).

## 4. Non-Functional Requirements and Contracts

- Sem deps runtime novas.
- Never clobber third-party content: own-file ou seção marcada, nunca arquivos de terceiros.
- Conteúdo destilado (<200 linhas por superfície), gerado de templates em lib/templates/sdd-rules/.
- Superfícies modernas apenas; sem superfícies legadas (ex: .cursorrules plano).
- Sem MCP nem runtime nesta versão; MCP é evolução futura.
