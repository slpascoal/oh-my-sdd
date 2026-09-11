import { existsSync, readFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { detectSensors } from '../sensors/detect.js';
import { runAll } from '../sensors/runner.js';
import { fingerprint, readEvidence, isValid } from '../sensors/evidence.js';

const CONFIG_PATH = join('.oh-my-sdd', 'config', 'sensors.json');

export default async function sensor(args) {
  const [sub, slugArg, ...rest] = args;
  const cwd = process.cwd();
  if (sub === 'init') return init(cwd, args.includes('--yes'));
  if (sub === 'run') return run(slugArg, cwd);
  if (sub === 'status') return status(slugArg, cwd);
  usage();
}

function usage() {
  console.log(chalk.bold('\n  oh-my-sdd sensor\n'));
  console.log('  Uso: npx oh-my-sdd sensor <init | run <slug> | status <slug>> [--yes]');
  console.log('  init    detecta a stack e propõe .oh-my-sdd/config/sensors.json');
  console.log('  run     roda os sensors da feature e grava evidências em runtime/');
  console.log('  status  mostra evidências e validade por fingerprint\n');
}

function ensureGitignore(cwd) {
  const p = join(cwd, '.gitignore');
  const current = existsSync(p) ? readFileSync(p, 'utf8') : '';
  if (current.split('\n').some((l) => l.trim() === '.oh-my-sdd/runtime/')) return;
  appendFileSync(p, `${current.endsWith('\n') || !current ? '' : '\n'}.oh-my-sdd/runtime/\n`);
}

async function init(cwd, yes) {
  const { mkdirSync, writeFileSync, existsSync: ex } = await import('fs');
  const proposal = detectSensors(cwd);
  console.log(chalk.bold('\n  Detecção do projeto:\n'));
  for (const finding of proposal.findings) console.log(`  - ${finding}`);

  const configDir = join(cwd, '.oh-my-sdd', 'config');
  const sensorsPath = join(cwd, CONFIG_PATH);
  const hasStack = proposal.sensors['tests-passing']?.command ||
    proposal.sensors['typecheck-clean']?.command || proposal.sensors.lint?.command;
  if (!hasStack) {
    console.log(chalk.yellow('\n  Aviso: nenhuma stack detectada (sem package.json/tsconfig/etc.).'));
    console.log(chalk.yellow('  Proposta mínima: sensors builtin como opcionais + runtime.json default.'));
  }

  // Re-scan: merge aditivo — nunca regenera nem remove config autorada.
  if (ex(sensorsPath)) {
    const current = JSON.parse(readFileSync(sensorsPath, 'utf8'));
    const added = [];
    for (const [name, cfg] of Object.entries(proposal.sensors)) {
      if (cfg.command && !current.sensors[name]?.command) {
        current.sensors[name] = cfg;
        added.push(name);
      } else if (current.sensors[name]?.command && !cfg.command) {
        console.log(chalk.yellow(`  Stale sugerido: "${name}" declarado mas seu backing artifact não foi mais detectado (nada removido).`));
      }
    }
    current.criteria = current.criteria || {};
    mkdirSync(configDir, { recursive: true });
    writeFileSync(sensorsPath, JSON.stringify(current, null, 2));
    ensureGitignore(cwd);
    writeRuntimeJson(configDir, existsSync, mkdirSync, writeFileSync, cwd);
    console.log(added.length
      ? chalk.green(`\n  Merge aditivo concluído: ${added.join(', ')} adicionado(s). Config existente preservado (nada removido).\n`)
      : chalk.dim('\n  Nenhum sensor novo a adicionar; config existente intacto.\n'));
    return;
  }

  // Fresh: proposta exibida acima; confirmação antes de gravar.
  if (!yes) {
    if (process.stdin.isTTY) {
      const { default: inquirer } = await import('inquirer');
      const { proceed } = await inquirer.prompt([{
        prefix: '', type: 'confirm', name: 'proceed', default: true,
        message: 'Confirma gravar .oh-my-sdd/config/sensors.json + runtime.json?',
      }]);
      if (!proceed) { console.log(chalk.gray('\n  Cancelado — nada foi gravado.\n')); return; }
    } else {
      console.log(chalk.cyan('\n  Proposta pronta. Rode com --yes para gravar (nada gravado ainda).'));
      return;
    }
  }
  mkdirSync(configDir, { recursive: true });
  writeFileSync(sensorsPath, JSON.stringify({ sensors: proposal.sensors, criteria: {} }, null, 2));
  ensureGitignore(cwd);
  writeRuntimeJson(configDir, existsSync, mkdirSync, writeFileSync, cwd);
  console.log(chalk.green('\n  sensors.json + runtime.json gravados. .gitignore garante .oh-my-sdd/runtime/ fora do git.\n'));
}

function writeRuntimeJson(configDir, existsSyncFn, mkdirSyncFn, writeFileSyncFn, cwd) {
  const p = join(configDir, 'runtime.json');
  if (existsSyncFn(p)) return; // config autorada nunca é sobrescrita
  writeFileSyncFn(p, `${JSON.stringify({ autonomous_mode: false }, null, 2)}\n`);
}

function loadConfig(cwd) {
  const p = join(cwd, CONFIG_PATH);
  if (!existsSync(p)) {
    console.error(chalk.red('\n  sensors.json não encontrado. Rode primeiro: npx oh-my-sdd sensor init --yes\n'));
    process.exitCode = 1;
    return null;
  }
  return JSON.parse(readFileSync(p, 'utf8'));
}

function run(slug, cwd) {
  const config = loadConfig(cwd);
  if (!config || !slug) {
    if (!slug) console.error(chalk.red('  Uso: sensor run <feature-slug>'));
    return;
  }
  const summary = runAll(slug, config, cwd);
  for (const r of summary.results) {
    const icon = r.status === 'passed' ? chalk.green('✔') : r.status === 'skipped' ? chalk.yellow('○') : chalk.red('✖');
    console.log(`  ${icon} ${r.sensor}: ${r.status} (${r.durationMs}ms) — ${r.command || r.reason}`);
  }
  console.log(summary.allRequiredPassed
    ? chalk.green('\n  Todos os sensors obrigatórios passaram.')
    : chalk.red('\n  Gate bloqueante: sensor obrigatório falhou — corrija e re-execute.\n'));
  if (!summary.allRequiredPassed) process.exitCode = 1;
}

function status(slug, cwd) {
  const config = loadConfig(cwd);
  if (!config || !slug) {
    if (!slug) console.error(chalk.red('  Uso: sensor status <feature-slug>'));
    return;
  }
  const currentFp = fingerprint(cwd);
  for (const name of Object.keys(config.sensors)) {
    const ev = readEvidence(slug, name, cwd);
    if (!ev) {
      console.log(`  ${chalk.dim('○')} ${name}: sem evidência`);
      continue;
    }
    const valid = isValid(ev, currentFp) ? chalk.green('válida') : chalk.yellow('expirada (fingerprint mudou)');
    console.log(`  ${chalk.dim('·')} ${name}: ${ev.status}, exit ${ev.exitCode}, ${ev.durationMs}ms, evidência ${valid}`);
  }
  console.log(chalk.dim(`\n  Evidências em .oh-my-sdd/runtime/sensors/${slug}/\n`));
}
