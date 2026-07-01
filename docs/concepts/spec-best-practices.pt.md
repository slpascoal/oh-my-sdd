# Como Criar Specs `.md` 100% Eficazes

Usar arquivos Markdown (`.md`) se tornou o padrão ("Lingua Franca") para SDD.

Markdown consome menos tokens do que formatos estruturados como JSON ou XML, e sua estrutura de cabeçalhos (`#`, `##`) cria uma hierarquia semântica que os modelos de IA entendem perfeitamente.

Para criar especificações altamente eficazes, siga estas boas práticas:

## A. Estruture seus artefatos hierarquicamente

No SDD moderno, não existe apenas um arquivo solto, mas uma hierarquia de artefatos que guia a IA do abstrato ao operacional:

- `constitution.md` (Governança): Contém as leis imutáveis do projeto (ex.: "Sempre use tipagem estrita", "Nunca exponha chaves de API").
- `SPEC.md` (A Intenção): Define o "O quê" e o "Por quê". Encapsula regras de negócio e critérios de aceite, permanecendo agnóstico quanto a tecnologias específicas.
- `PLAN.md` (A Estratégia): Traduz a spec abstrata para o "Como" (decisões arquiteturais, esquemas de banco de dados, escolha de bibliotecas).
- `TASKS.md` (A Execução): A quebra do plano em tarefas atômicas e sequenciais que a IA pode executar sem perder contexto.

Essa é exatamente a hierarquia que o `oh-my-sdd` automatiza: `oh-my-sdd-constitution` → `oh-my-sdd-specify` → `oh-my-sdd-plan` → `oh-my-sdd-tasks` → `oh-my-sdd-implement`.

## B. Use padrões sintáticos como EARS / GEARS

Para que a linguagem natural seja interpretada sem falhas pelos agentes, use padronizações sintáticas como EARS (Easy Approach to Requirements Syntax) ou GEARS. Elas introduzem palavras-chave de gatilho que facilitam a compreensão lógica pela IA:

- **Event-Driven**: When [gatilho], the system shall [ação].
- **State-Driven**: While [estado], the system shall [ação].
- **Unwanted Behavior**: If [erro de rede], the system shall [retornar uma mensagem clara].

A `oh-my-sdd-specify` escreve todo requisito funcional nessa sintaxe — veja o [exemplo prático](spec-example.md).

## C. Equilibre o nível de detalhe (evite os extremos)

- **Não sub-especifique**: Diretrizes vagas farão a IA "hallucinar" ao tentar preencher as lacunas com dados genéricos de treinamento.
- **Não super-especifique (Over-engineering)**: Escrever pseudocódigo tira da IA a liberdade de encontrar a melhor solução algorítmica. O custo de refinar a especificação deve sempre ser menor que o custo de corrigir uma implementação errada. Mantenha o Nível 1 (Intenção e Contratos) muito estrito, mas permita flexibilidade no Nível 2 (Implementação Interna).

## D. Divida o trabalho em entregas pequenas

A IA tem desempenho muito melhor em tarefas menores. Uma boa spec orientada a SDD deve facilitar a quebra do escopo para que passos individuais possam ser validados facilmente.

É por isso que a `oh-my-sdd-tasks` quebra o `plan.md` em tarefas pequenas, atômicas e sequenciais, em vez de um único passo grande de implementação.
