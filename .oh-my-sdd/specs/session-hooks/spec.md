# Spec: Hooks de sessão (retomada e lembrete)

## 1. Intenção e Visão Geral

A retomada de implement hoje depende do usuário lembrar do comando. Esta feature adiciona dois lifecycle hooks do Claude Code — SessionStart e Stop — que tornam a retomada automática e o fluxo SDD visível: bootstrap no início da sessão e lembrete à saída de cada resposta quando houver workflow ativo.

Prioridade central: usuário nunca perde o fio de um SDD em andamento entre sessões.

## 2. Requisitos Funcionais (EARS/GEARS)

- **[Req-01]** **When** uma sessão Claude Code abre em projeto com session ativo (session.json não arquivado), o hook SessionStart **shall** injetar contexto de retomada: "feature X em implement, N/M tarefas, retomar com /oh-my-sdd-implement <slug>".
- **[Req-02]** **When** a sessão encerra uma resposta e existe workflow ativo (specs/<slug>/ com tasks pendentes + session ativo), o hook Stop **shall** inject lembrete curto do próximo passo.
- **[Req-03]** **If** não há workflow ativo, ambos os hooks **shall** sair em silêncio total — nunca ruído em sessão sem SDD ativo.
- **[Req-04]** **When** o install roda com `--with-hooks`, o sistema **shall** escrever config de hooks em `.claude/settings.json` (SessionStart + Stop apontando para `node bin/oh-my-sdd.js hook dispatch --source claude-code`), com merge por evento preservando hooks de terceiros.
- **[Req-05]** **When** uninstall roda, o sistema **shall** remover apenas as entradas próprias, preservando hooks de terceiros.
- **[Req-06]** **When** o hook dispatch roda, o sistema **shall** ler stdin JSON do host, decidir por evento, imprimir JSON-safe hint (≤10 linhas) e **sempre** sair 0 — falha = silêncio, nunca bloquear sessão.
- **[Req-06b]** **If** o host não fornece stdin JSON parseável, o hook **shall** sair 0 em silêncio. 

## 3. Critérios de Aceite

- [ ] Sessão aberta com implement em andamento mostra hint de retomada.
- [ ] Stop com workflow ativo injeta lembrete; sem workflow: silêncio.
- [ ] install --with-hooks faz merge sem destruir settings existentes.
- [ ] uninstall remove só entradas próprias.
- [ ] Hook sempre exit 0, saída ≤10 linhas, nunca bloqueia.
- [ ] README + docs EN/PT atualizados.

## 4. Non-Functional Requirements and Contracts

- **Fail-silent:** toda exceção → exit 0, sem stack trace na sessão do usuário.
- **Não bloqueante:** hooks informativos (additionalContext), nunca PreToolUse blocking.
- **stdin cap 8 MiB**; escrita apenas em runtime/, nunca em specs/.
- **Sem deps novas** (child_process builtin para dispatch).
- **Coerência:** consome session.json da feature runtime-state.
