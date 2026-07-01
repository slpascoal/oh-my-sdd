# Boas Práticas para Criar um `constitution.md` Eficaz

Para garantir que a IA entenda e respeite as regras do seu projeto, siga estas diretrizes:

- **Seja absoluto e direto (use "Sempre" e "Nunca")**: Evite sugestões vagas. Use verbos de obrigação para criar guardrails rígidos. Por exemplo, em vez de "tente manter o código seguro", use "Nunca exponha segredos ou chaves de API no código do cliente" ou "Sempre use tipagem estrita".
- **Defina a persona do agente (system prompt)**: Estabeleça já no início qual é o papel do agente de IA (ex.: "Você é um Engenheiro de Software Sênior rigoroso"). Isso cria um "Túnel de Realidade", forçando a IA a agir dentro desse nível de exigência e evitando que ela assuma requisitos não documentados.
- **Trave a stack de tecnologia**: Especifique claramente as linguagens, frameworks e bibliotecas permitidas. Isso evita que a IA "hallucine" pacotes inexistentes ou traga dependências indesejadas. (Se o projeto migrar de tecnologia no futuro, basta alterar este arquivo e a IA adotará o novo padrão.)
- **Estabeleça padrões de código e arquitetura**: Documente convenções de nomenclatura, estrutura de diretórios e padrões de design preferidos, como "Prefira composição em vez de herança".
- **Mantenha o foco global (não especifique features aqui)**: O `constitution.md` não é o lugar para descrever como a tela de login funciona; isso pertence ao `SPEC.md`. Este documento deve conter apenas regras que se aplicam a todo o repositório.

A `oh-my-sdd-constitution` aplica essas regras automaticamente: ela analisa primeiro a stack e as convenções reais do seu projeto, e só pergunta sobre o que genuinamente não pode ser inferido — veja o [exemplo prático](constitution-example.md) que ela segue.
