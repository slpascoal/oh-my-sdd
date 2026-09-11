# Spec: Gates de evidência com sensors

## 1. Intenção e Visão Geral

A fase `oh-my-sdd-implement` hoje reporta critérios de aceite como atendidos por auto-avaliação do modelo — a garantia de qualidade depende da confiança no modelo, não de prova. Esta feature introduz **sensors**: verificações executáveis (comandos reais com exit code) que provam, em vez de presumir, a integridade do código pós-implementação. Toda afirmação "critério atendido" passa a exigir evidência executável registrada.

Prioridade central: implement nunca reporta um critério de aceite como atendido sem comando executável que o prove, e nunca fecha a feature com sensor obrigatório falhando.

## 2. Requisitos Funcionais (EARS/GEARS)

### 2.1 Sensors padrão e configuração

- **[Req-01]** **When** o projeto alvo não possui `.oh-my-sdd/config/sensors.json`, o sistema **shall** gerar o arquivo via detecção de repo (tsconfig.json → typecheck-clean; scripts.test → tests-passing; config de eslint → lint) com sensores detectados em `required: true` e os demais comentados como opcionais.
- **[Req-02]** **While** `.oh-my-sdd/config/sensors.json` existe, o sistema **shall** tratá-lo como fonte única de verdade dos sensors — nunca inferir sensors que não estejam declarados nele.
- [Req-03] **When** um sensor declarado em sensors.json não tem `command` definido, o sistema **shall** usar o comando padrão do sensor builtin correspondente (tests-passing → `npm test`; typecheck-clean → `npx tsc --noEmit`; lint → `npx eslint .` se eslint no devDependencies, senão sensor desabilitado com aviso).
- [Req-03b] **If** um sensor builtin é declarado mas o projeto não tem o artefato que o sustenta (sem tests script, sem tsconfig, sem eslint), o sistema **shall** marcar o sensor como `skipped` com motivo registrado, nunca como falha.
- **[Req-04]** **When** um sensor roda, o sistema **shall** executar seu comando de forma não-interativa (spawn direto, sem shell interativo), com timeout (default 300s) e registrar evidence: comando, exit code, duração, saída truncada (máx. 4KB / 50 linhas) em `.oh-my-sdd/runtime/sensors/<feature-slug>/<sensor>.json`.

### 2.2 Mapeamento critério → evidência

- **[Req-05]** **When** o `spec.md` da feature tem seção "Critérios de Aceite", o sistema **shall** exigir, para cada critério reportado como atendido no relatório final do implement, uma evidência: sensor que provou (nome + resultado JSON) ou nota explícita de verificação manual registrada em `runtime/sensors/<slug>/manual-checks.md`.
- **[Req-06]** **If** um critério de aceite não tem sensor mapeável nem verificação manual registrada, o sistema **shall** reportá-lo como "pendente de verificação" — nunca como atendido.
- **[Req-06b]** **When** o usuário declara durante o checkpoint do specify que um critério é "verificável por comando X", o sistema **shall** persistir esse mapeamento em `.oh-my-sdd/config/sensors.json` sob a feature (seção `criteria`), herdando dos sensors globais.

### 2.3 Gate bloqueante no implement

- **[Req-07]** **When** a última tarefa de `tasks.md` é marcada como concluída, o sistema **shall** executar todos os sensors `required: true` e, **If** qualquer um falha, o sistema **shall** bloquear o relatório final: apresentar saída do sensor, sugerir correção, e só re-emitir relatório após re-execução com passagem.
- **[Req-08]** **If** um sensor obrigatório não pode ser executado (comando inexistente, timeout), o sistema **shall** tratar como falha bloqueante com motivo claro — nunca pular silenciosamente.
- **[Req-08b]** **While** existir evidência registrada válida (não expirada por mudança de código após a execução), o sistema **shall** aceitar re-execução apenas dos sensors afetados (execução incremental); base da regra: mudança em arquivo fonte após sensor passou invalida a evidência daquele sensor.

## 3. Critérios de Aceite

- [ ] `sensors.json` é gerado por detecção de repo em projeto de exemplo (Node com tests + tsconfig) com os 3 sensors corretos.
- [ ] Implement roda sensors obrigatórios antes do relatório final e bloqueia quando um falha (testado com comando propositalmente falhando).
- [ ] Critério de aceite sem evidência aparece no relatório como "pendente de verificação", nunca como atendido.
- [ ] Evidências em `runtime/sensors/` contêm comando, exit code, duração, saída truncada, timestamp.
- [ ] Sensor com comando inexistente produz falha bloqueante com motivo, sem pular silenciosamente.
- [ ] Evidência expira quando arquivo fonte muda após execução (verificável por hash).

## 3.1 Checklist de Documentação

- [ ] README.md atualizado (seção sobre sensors + config).
- [ ] docs/ EN + PT atualizados (página nova ou seção em página existente).
- [ ] mkdocs.yml atualizado se nova página no nav.

## 4. Non-Functional Requirements and Contracts

- **Dependências:** nenhuma dependência runtime nova (constitution §2). Parsing de exit code/duração via `child_process` builtin.
- **Runtime state:** evidências em `.oh-my-sdd/runtime/sensors/` — **sempre** gitignored, nunca versionado.
- **Transparência:** comando de sensor **sempre** exibido na saída antes de rodar; execução não-interativa; timeout default 300s configurável.
- **Bounded output:** evidência trunca em 4KB/50 linhas por sensor.
- **Schema `sensors.json`:**
  ```json
  {
    "sensors": {
      "tests-passing": { "command": "npm test", "required": true, "timeout": 300 },
      "typecheck-clean": { "command": "npx tsc --noEmit", "required": true, "timeout": 120 },
      "lint": { "command": "npx eslint .", "required": false, "timeout": 60 }
    },
    "criteria": {
      "<feature-slug>": {
        "<critério exato do checklist>": { "sensor": "tests-passing" }
      }
    }
  }
  ```
- **Sem chamadas de rede.** Comandos de sensor rodam no cwd do projeto alvo.
