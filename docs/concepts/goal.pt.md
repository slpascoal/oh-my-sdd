# Qual é o Objetivo do SDD?

O principal objetivo do SDD é **elevar o nível de abstração no desenvolvimento**, deslocando o foco do desenvolvedor de "escrever código" para se tornar um "arquiteto de intenção".

Ao adotar essa abordagem, os objetivos são:

- **Fornecer contexto rico à IA**: Uma IA sem contexto age como um estagiário no primeiro dia de trabalho. As specs fornecem o histórico e as regras do projeto, reduzindo a chance de a IA inventar soluções inadequadas (hallucinations).
- **Evitar dívida técnica e Context Drift**: Impede que a IA quebre o sistema ao tentar corrigir bugs sem entender a arquitetura global, e combate o acúmulo silencioso de problemas em bases de código geradas por IA.
- **Eliminar ambiguidade**: Modelos de IA tentam preencher lacunas em instruções vagas (ex.: "melhore a experiência do usuário") sem avisar. O SDD exige o fornecimento de limites operacionais claros e precisos.
- **Habilitar loops de validação**: Agentes de IA podem comparar o código que geram diretamente com os critérios de aceite listados na especificação (Verifier Agent), aprovando a implementação até antes da revisão humana.

Esse último ponto é exatamente o que a `oh-my-sdd-implement` faz ao final da sua execução: ela compara o código que acabou de escrever com o checklist de critérios de aceite em `spec.md` e reporta quais foram atendidos.
