---
name: oh-my-sdd-constitution
description: Analisa os padrões reais do projeto atual (stack, convenções, lint/formatter, arquitetura) para gerar ou confirmar a constitution.md em .oh-my-sdd/constitution.md, perguntando ao usuário apenas o que não puder ser inferido do código. Geralmente invocada pela skill oh-my-sdd, mas pode ser chamada diretamente para (re)gerar a constitution de um projeto.
allowed-tools: Read, Write, Glob, Grep
---

# When to use this skill

Use quando um projeto ainda não tem uma `constitution.md` de SDD, ou quando o usuário pedir explicitamente para (re)gerar as regras globais do projeto:

```
/oh-my-sdd-constitution
```

Não recebe argumento — opera sobre o diretório de trabalho atual.

# How to use this skill

> [!IMPORTANT]
> - Se `.oh-my-sdd/constitution.md` já existe: na ativação normal do fluxo SDD, **apenas leia, reporte que está vigente e finalize** (sem perguntas). Só entre no **modo merge** da Fase 4 se o usuário pedir explicitamente regeneração/merge.
> - Priorize fundar as regras nas **fontes existentes** (Fase 2.1) e no código real. Só pergunte ao usuário o que nem fontes nem código conseguiram resolver com segurança.
> - A constitution documenta regras **globais** do repositório — nunca descreva uma feature específica aqui.

# Tool usage flow

## Phase 1 — Verificar se já existe

1. Use `Glob` para checar `.oh-my-sdd/constitution.md` no projeto atual.
2. Se existir: leia com `Read`, reporte ao chamador "constitution já vigente" com um resumo de 1-2 linhas do que ela trava (stack + principal guardrail), e finalize aqui — não execute as fases seguintes.

## Phase 2 — Varrer Fontes Existentes e Analisar o Código

**Goal**: fundar a constitution no que o projeto JÁ documenta e pratica, perguntando só lacunas reais.

### 2.1 — Varredura de fontes (nesta ordem)

Execute em paralelo, `Read`/`Glob` dos que existirem:

1. `CLAUDE.md`
2. `AGENTS.md`
3. `.cursor/rules/*.mdc`
4. `.windsurfrules` e `.windsurf/rules/`
5. `CONTRIBUTING.md`
6. Configs raiz: eslint/prettier/editorconfig/tsconfig e equivalentes da stack
7. `.github/workflows/` (o CI efetivamente impõe — ex: steps de lint/test)

Para cada fonte, extraia regras compatíveis com as seções da constitution (stack, código e arquitetura, segurança, qualidade/testes) **com citação do trecho de origem**.

### 2.2 — Análise do código real (complementa)

Execute em paralelo:

1. **Detectar stack e dependências**: `Glob` por `package.json`, `composer.json`, `pyproject.toml`, `go.mod`, `requirements.txt`, `Gemfile`, `*.csproj` na raiz do projeto; `Read` o(s) que existir(em) para extrair linguagem, framework principal e bibliotecas-chave já em uso.
2. **Detectar convenções de qualidade**: configs de lint/formatter detectados no passo 2.1.
3. **Detectar padrões de arquitetura e nomenclatura**: `Grep`/`Read` amostras da estrutura de pastas e de 2-3 arquivos representativos (ex: camelCase vs snake_case, composição vs herança, camadas existentes).

### 2.3 — Apresentar achados antes de gerar

Apresente ao usuário, antes de qualquer geração:

1. **Regras encontradas por fonte** — agrupadas por arquivo, com citação do trecho de origem.
2. **Seções cobertas** pelas fontes e **lacunas** identificadas (o que precisará de inferência do código ou pergunta).
3. **Conflitos entre fontes** — se duas fontes divergem (ex: dois arquivos com regras contraditórias), liste o conflito explicitamente e pergunte qual prevalece. **Nunca** resolva silenciosamente.

## Phase 3 — Perguntar Apenas o que Não Foi Inferido

Com base no que a Fase 2 NÃO conseguiu determinar com segurança, pergunte ao usuário — tipicamente:
- Guardrails de segurança específicos (política de segredos/credenciais, sanitização de input) se o código não deixar isso claro.
- Política sobre dependências externas proibidas/permitidas, se relevante e não óbvia.

Não pergunte nada que a Fase 2 (fontes + código) já resolveu com confiança. Em projeto rico em fontes, espere fazer **no máximo 2 perguntas**.

## Phase 4 — Gerar ou Fazer Merge de `constitution.md`

Gere `.oh-my-sdd/constitution.md` seguindo **estritamente** a estrutura de `knowledge/6-example-constitution.md` (seções: Persona principal, Stack de tecnologia não-negociável, Padrões de código e arquitetura, Governança de segurança, Qualidade e testes) e as regras de `knowledge/5-best-practices-constitution.md`:
- Linguagem absoluta ("sempre"/"nunca"), nunca sugestões vagas.
- Defina a persona do agente já na primeira seção.
- Trave a stack detectada na Fase 2 — proíba explicitamente alternativas não usadas no projeto.
- Documente apenas regras globais do repositório, nunca descrições de features.
- **Bloco "Fontes"**: feche o documento com uma seção `## Fontes` listando a origem de cada regra (arquivo + seção/trecho). Toda regra vinda de fonte é rastreável; regras inferidas do código são marcadas `(inferido do código)`.

**Modo merge (constitution já existe):** se `.oh-my-sdd/constitution.md` já existe e o usuário pediu regeneração/merge, **nunca regenere do zero** — extraia das fontes apenas regras NOVAS ou atualizadas, apresente como diff proposto (o que entra, o que muda) e aplique só com confirmação. Editas manuais do usuário permanecem intocadas.

**Fallback sem fontes:** se nenhuma fonte for encontrada, siga o comportamento de inferência do código + perguntas — sem erro, sem quebra.

Escreva o arquivo e reporte ao chamador um resumo de 2-3 linhas do que foi travado.
