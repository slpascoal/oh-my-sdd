# Spec: Bootstrapping de config por detecção de repo

## 1. Intenção e Visão Geral

Configurar .oh-my-sdd/config/ do zero é atrito na adoção. Esta feature faz o primeiro uso em um projeto alvo escanear o repo (package.json scripts, tsconfig, eslint, locales) e propor .oh-my-sdd/config/ pré-populado — usuário confirma em vez de configurar do zero.

Prioridade central: adoção sem configuração manual — detecção propõe, usuário confirma.

## 2. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** primeiro uso do fluxo SDD em projeto alvo sem .oh-my-sdd/config/, o sistema **shall** escanear: package.json (name, scripts, devDeps), tsconfig.json, configs de eslint/prettier, estrutura locales/i18n — e derivar sugestões de config.
- **[Req-02]** **When** escaneio conclui, o sistema **shall** exibir achados + proposta de config antes de gravar: sensors detectados, linguagem/docs conventions detectadas, nada gravado antes da confirmação.
- **[Req-03]** **When** o usuário confirma a proposta, o sistema **shall** gravar `.oh-my-sdd/config/sensors.json` (schema da suíte evidence-gates) e `runtime.json` (flags de comportamento: autonomous_mode etc.).
- **[Req-04]** **When** re-scan roda com config existente, o sistema **shall** propor diff (sensors novos detectados, stale entries) — nunca regenerar nem remover config autorada sem confirmação.

## 3. Critérios de Aceite

- [ ] Projeto Node com tests+tsconfig: primeira execução propõe sensors.json com tests-passing+typecheck-clean required.
- [ ] Projeto sem package.json: proposta mínima (só runtime.json default) + aviso.
- [ ] Nada gravado antes de confirmação explícita do usuário.
- [ ] Re-scan com config existente propõe diff, nunca regenera.
- [ ] README + docs EN/PT atualizados.

## 4. Non-Functional Requirements and Contracts
- Filesystem-only, sem rede.
- Nada gravado antes de confirmação (explicit opt-in).
- Re-scan = diff proposto, nunca regeneração.
- Coerência: sensors.json schema é o da suíte evidence-gates; runtime.json schema documentado em docs.
- Sem deps novas.
