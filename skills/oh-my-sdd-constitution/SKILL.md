---
name: oh-my-sdd-constitution
description: Analisa os padrões reais do projeto atual (stack, convenções, lint/formatter, arquitetura) para gerar ou confirmar a constitution.md em .oh-my-sdd/constitution.md, perguntando ao usuário apenas o que não puder ser inferido do código. Geralmente invocada pela skill oh-my-sdd, mas pode ser chamada diretamente para (re)gerar a constitution de um projeto.
allowed-tools: Read, Write, Glob, Grep
model: claude-sonnet-5
---

# When to use this skill

Use quando um projeto ainda não tem uma `constitution.md` de SDD, ou quando o usuário pedir explicitamente para (re)gerar as regras globais do projeto:

```
/oh-my-sdd-constitution
```

Não recebe argumento — opera sobre o diretório de trabalho atual.

# How to use this skill

> [!IMPORTANT]
> - Se `.oh-my-sdd/constitution.md` já existe, **não a regenere e não faça perguntas** — apenas leia e reporte que já está vigente.
> - Priorize inferir a stack e as convenções analisando o código real do projeto. Só pergunte ao usuário o que genuinamente não pode ser inferido com segurança.
> - A constitution documenta regras **globais** do repositório — nunca descreva uma feature específica aqui.

# Tool usage flow

## Phase 1 — Verificar se já existe

1. Use `Glob` para checar `.oh-my-sdd/constitution.md` no projeto atual.
2. Se existir: leia com `Read`, reporte ao chamador "constitution já vigente" com um resumo de 1-2 linhas do que ela trava (stack + principal guardrail), e finalize aqui — não execute as fases seguintes.

## Phase 2 — Analisar os Padrões Reais do Projeto

**Goal**: inferir stack, arquitetura e convenções a partir do código, sem depender de entrevista.

Execute em paralelo:

1. **Detectar stack e dependências**: `Glob` por `package.json`, `composer.json`, `pyproject.toml`, `go.mod`, `requirements.txt`, `Gemfile`, `*.csproj` na raiz do projeto; `Read` o(s) que existir(em) para extrair linguagem, framework principal e bibliotecas-chave já em uso.
2. **Detectar convenções de qualidade**: `Glob` por configs de lint/formatter (`.eslintrc*`, `.prettierrc*`, `.editorconfig`, `ruff.toml`, `.golangci.yml`, etc.) e `Read` os que existirem.
3. **Detectar padrões de arquitetura e nomenclatura**: `Grep`/`Read` amostras da estrutura de pastas e de 2-3 arquivos de código representativos para identificar padrões já em uso (ex: camelCase vs snake_case, composição vs herança, camadas existentes).

## Phase 3 — Perguntar Apenas o que Não Foi Inferido

Com base no que a Fase 2 NÃO conseguiu determinar com segurança, pergunte ao usuário — tipicamente:
- Guardrails de segurança específicos (política de segredos/credenciais, sanitização de input) se o código não deixar isso claro.
- Política sobre dependências externas proibidas/permitidas, se relevante e não óbvia.

Não pergunte nada que já foi inferido com confiança na Fase 2.

## Phase 4 — Gerar `constitution.md`

Gere `.oh-my-sdd/constitution.md` seguindo **estritamente** a estrutura de `knowledge/6-example-constitution.md` (seções: Persona principal, Stack de tecnologia não-negociável, Padrões de código e arquitetura, Governança de segurança, Qualidade e testes) e as regras de `knowledge/5-best-practices-constitution.md`:
- Linguagem absoluta ("sempre"/"nunca"), nunca sugestões vagas.
- Defina a persona do agente já na primeira seção.
- Trave a stack detectada na Fase 2 — proíba explicitamente alternativas não usadas no projeto.
- Documente apenas regras globais do repositório, nunca descrições de features.

Escreva o arquivo e reporte ao chamador um resumo de 2-3 linhas do que foi travado.
