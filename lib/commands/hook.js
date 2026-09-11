import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

const HOOK_MARKER = 'oh-my-sdd hook dispatch';
const STDIN_CAP = 8 * 1024 * 1024;

export default async function hook(args) {
  const [sub] = args;
  if (sub === 'dispatch') return dispatch();
  if (sub === 'install') return install();
  if (sub === 'uninstall') return uninstall();
  usage();
}

function usage() {
  console.log(chalk.bold('\n  oh-my-sdd hook\n'));
  console.log('  Uso: npx oh-my-sdd hook <install | uninstall | dispatch>');
  console.log('  install     registra SessionStart/Stop no .claude/settings.json do projeto');
  console.log('  uninstall   remove apenas as entradas do oh-my-sdd');
  console.log('  dispatch    invocado pelo host (lê evento do stdin, imprime hint ou silêncio)\n');
}

// --- dispatch -------------------------------------------------------------

function readStdinJson() {
  try {
    const raw = readFileSync(0, 'utf8').slice(0, STDIN_CAP);
    return raw.trim() ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function activeSessions(cwd) {
  const dir = join(cwd, '.oh-my-sdd', 'runtime', 'sessions');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.json')) continue;
    try {
      const s = JSON.parse(readFileSync(join(dir, name), 'utf8'));
      if (s.status === 'in-progress' || s.status === 'paused') out.push(s);
    } catch { /* corrupted session: skip silently */ }
  }
  return out;
}

function sessionHint(ev, s) {
  const done = Number.isInteger(s.taskIndex) ? s.taskIndex : 0;
  const total = Number.isInteger(s.taskCount) ? s.taskCount : 0;
  if (ev === 'SessionStart') {
    return `oh-my-sdd: feature "${s.slug}" em implement, ${done}/${total} tarefas — retomar com /oh-my-sdd-implement ${s.slug}`;
  }
  const next = total > done ? `próximo: concluir tarefa ${done + 1}` : 'próximo: gate de evidência e relatório final';
  return `oh-my-sdd ativo: "${s.slug}" (${done}/${total} tarefas, ${s.status}) — ${next}`;
}

function dispatch() {
  try {
    const cwd = process.cwd();
    const event = readStdinJson()?.hook_event_name;
    if (event !== 'SessionStart' && event !== 'Stop') return;
    const sessions = activeSessions(cwd);
    if (!sessions.length) return;
    for (const s of sessions.slice(0, 3)) console.log(sessionHint(event, s));
  } catch { /* fail-silent: hook nunca quebra a sessão do host */ }
}

// --- install / uninstall ---------------------------------------------------

const HOOK_COMMAND = 'npx -y oh-my-sdd hook dispatch';
const EVENTS = ['SessionStart', 'Stop'];

function hookEntry() {
  return { type: 'command', command: HOOK_COMMAND };
}

function readSettings(cwd) {
  const p = join(cwd, '.claude', 'settings.json');
  let settings = {};
  if (existsSync(p)) {
    try { settings = JSON.parse(readFileSync(p, 'utf8')); } catch { settings = {}; }
  }
  return { path: p, settings };
}

function writeSettings(path, settings) {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, `${JSON.stringify(settings, null, 2)}\n`);
}

function settingsHaveOurs(settings, event) {
  return (settings.hooks?.[event] || []).some((g) =>
    (g.hooks || []).some((h) => typeof h.command === 'string' && h.command.includes(HOOK_MARKER)));
}

function install() {
  const cwd = process.cwd();
  const { path, settings } = readSettings(cwd);
  settings.hooks = settings.hooks || {};
  let changed = false;
  for (const ev of EVENTS) {
    if (settingsHaveOurs(settings, ev)) {
      console.log(`  ${chalk.dim('·')} ${ev}: já registrado`);
      continue;
    }
    const group = { hooks: [hookEntry()] };
    if (settingsHaveThirdParty(settings, ev)) {
      settings.hooks[ev].push(group); // merge: preserva hooks de terceiros
    } else {
      settings.hooks[ev] = [group];
    }
    changed = true;
    console.log(`  ${chalk.green('✔')} ${ev}: registrado em .claude/settings.json`);
  }
  if (changed) writeSettings(path, settings);
  console.log(chalk.bold('\n  Hooks informativos (fail-silent, nunca bloqueiam). Uso: oh-my-sdd hook uninstall para remover.\n'));
}

function settingsHaveThirdParty(settings, event) {
  return Array.isArray(settings.hooks?.[event]);
}

function uninstall() {
  const cwd = process.cwd();
  const { path, settings } = readSettings(cwd);
  if (!settings.hooks) return;
  let changed = false;
  for (const ev of EVENTS) {
    const groups = settings.hooks[ev];
    if (!Array.isArray(groups)) continue;
    const kept = groups.filter((g) => !(g.hooks || []).some((h) =>
      typeof h.command === 'string' && h.command.includes(HOOK_MARKER)));
    if (kept.length !== groups.length) {
      changed = true;
      if (kept.length) settings.hooks[ev] = kept;
      else delete settings.hooks[ev];
    }
  }
  if (changed) writeSettings(path, settings);
  console.log(chalk.bold('  Entradas oh-my-sdd removidas; hooks de terceiros preservados.\n'));
}
