# Spec: Constitution a partir de fontes existentes

## 1. Intenção e Visão Geral

A skill `oh-my-sdd-constitution` pergunta ao usuário só o que não infere do código — mas projetos maduros já têm regras escritas em fontes existentes: `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `CONTRIBUTING.md`, configs de eslint/prettier/tsconfig, workflows de CI. Esta feature faz a skill varrer essas fontes ANTES de perguntar qualquer coisa, propor uma constitution fundada nelas e perguntar apenas lacunas reais.

Prioridade central: constitution reflete o que o projeto já pratica e documenta, não opinião do modelo.

## 2. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** a skill constitution roda em projeto sem constitution, o sistema **shall** varrer as fontes na ordem: `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.windsurfrules`, `CONTRIBUTING.md`, configs raiz (eslint/prettier/editorconfig/tsconfig), `.github/workflows/` — e extrair regras compatíveis com as seções da constitution (stack, código, segurança, qualidade).
- **[Req-02]** **When** as fontes são extraídas, o sistema **shall** apresentar ao usuário: regras encontradas por fonte (com citação do trecho de origem), seções cobertas e lacunas identificadas — antes de gerar o arquivo.
- **[Req-03]** **If** uma regra extraída conflita com outra regra extraída (ex: dois arquivos divergem), o sistema **shall** listar o conflito explicitamente e perguntar ao usuário qual prevalece — nunca decidir silenciosamente.
- **[Req-04]** **When** o usuário valida, o sistema **shall** gravar `.oh-my-sdd/constitution.md` com um bloco "Fontes" listando origem de cada regra (arquivo + seção).
- **[Req-05]** **While** uma constitution já existe, o sistema **shall** operar em modo merge: propor regras novas vindas das fontes como diff, nunca regenerar o arquivo inteiro.
- **[Req-06]** **If** nenhuma fonte é encontrada, o sistema **shall** cair no comportamento atual (inferir do código + perguntar) sem quebrar.

## 3. Critérios de Aceite

- [ ] Projeto com CLAUDE.md + eslint gera constitution com regras rastreadas à fonte e ≤2 perguntas ao usuário.
- [ ] Conflito entre fontes é listado e resolvido por pergunta, não silenciosamente.
- [ ] Re-run em projeto com constitution existente propõe diff, nunca regenera.
- [ ] Sem fontes: comportamento atual preservado.
- [ ] Bloco "Fontes" presente no constitution gerado.
- [ ] README + docs EN/PT atualizados.

## 4. Non-Functional Requirements and Contracts

- **Skills only:** mudança no SKILL.md de constitution; sem código CLI novo obrigatório.
- **Sem rede:** varredura é filesystem-only.
- **Não-destrutivo:** nunca sobrescrever CLAUDE.md/AGENTS.md/fontes; constitution é o único arquivo gravado (fora runtime).
- **Rastreabilidade:** toda regra na constitution final cita fonte (arquivo + trecho).
