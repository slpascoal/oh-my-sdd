## Decisões

- Tudo no SKILL.md de `oh-my-sdd-constitution` (skills markdown, zero CLI).
- Nova Fase 2 "Varrer fontes existentes" substitui a análise atual: ordem fixa de varredura (CLAUDE.md → AGENTS.md → .cursor/rules/ → .windsurfrules → CONTRIBUTING.md → configs raiz → .github/workflows/), extração por seção da constitution (stack, código, segurança, qualidade).
- Apresentação antes de gravar: regras por fonte com citação, seções cobertas, lacunas; conflitos entre fontes listados e perguntados (nunca decididos silenciosamente).
- Constitution gravada com bloco "Fontes" (arquivo + seção por regra). Re-run com constitution existente = modo merge (propõe diff); sem fontes = fallback para comportamento atual.
- Verificação por inspeção + simulação; evidência em manual-checks.md.

## Tasks

- [x] 1. `skills/oh-my-sdd-constitution/SKILL.md`: Fase 2 reescrita — varredura de fontes na ordem fixa, extração de regras compatíveis com as seções da constitution; combinar com análise do código real (fontes primeiro, código complementa).
- [x] 2. `skills/oh-my-sdd-constitution/SKILL.md`: nova fase de apresentação — regras encontradas por fonte (com citação do trecho), seções cobertas e lacunas, ANTES de gerar o arquivo; conflitos entre fontes listados explicitamente e resolvidos por pergunta.
- [x] 3. `skills/oh-my-sdd-constitution/SKILL.md`: geração com bloco "Fontes" (origem de cada regra: arquivo + seção) + modo merge para re-run (propor diff, nunca regenerar) + fallback sem fontes (comportamento atual preservado).
- [x] 4. Verificar: leitura integral do SKILL.md, coerência de fluxo (com fontes / sem fontes / re-run merge), requisitos do spec Req-01..Req-06 todos cobertos.
- [x] 5. README.md + docs EN/PT: seção sobre geração de constitution a partir de fontes existentes.
