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
  const proposal = detectSensors(cwd);
  console.log(chalk.bold('\n  Detecção do projeto:\n'));
  for (const finding of proposal.findings) console.log(`  - ${finding}`);
  const exists = existsSync(join(cwd, CONFIG_PATH));
  if (exists && !yes) {
    console.log(chalk.yellow('\n  sensors.json já existe — re-run propõe diff; edite o arquivo para ajustar comandos.'));
    return;
  }
  if (!yes) {
    console.log(chalk.cyan('\n  Confirma gravar .oh-my-sdd/config/sensors.json? (re-run com --yes para gravar sem perguntar)'));
    return;
  }
  const { mkdirSync, writeFileSync } = await import('fs');
  mkdirSync(join(cwd, '.oh-my-sdd', 'config'), { recursive: true });
  writeFileSync(join(cwd, CONFIG_PATH), JSON.stringify({ sensors: proposal.sensors, criteria: {} }, null, 2));
  ensureGitignore(cwd);
  console.log(chalk.green(`\n  sensors.json gravado. .gitignore garante .oh-my-sdd/runtime/ fora do git.\n`));
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
