#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const [, , command, ...args] = process.argv;

const commands = {
  install: () => import('../lib/commands/install.js'),
  status: () => import('../lib/commands/status.js'),
  uninstall: () => import('../lib/commands/uninstall.js'),
};

if (!command || command === '--help' || command === '-h') {
  console.log(`
  ${chalk.bold('oh-my-sdd')} v${pkg.version}
  Spec-Driven Development, enforced by a global Claude Code skill.

  Uso: npx oh-my-sdd <comando>

  Comandos:
    install      Instala a skill oh-my-sdd globalmente em ~/.claude/skills/
    status       Mostra o estado atual da instalação
    uninstall    Remove a skill oh-my-sdd de ~/.claude/skills/

  Documentação: https://github.com/slpascoal/oh-my-sdd
  `);
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  console.log(pkg.version);
  process.exit(0);
}

if (!commands[command]) {
  console.error(`\n  Comando desconhecido: "${command}"`);
  console.error('  Execute "npx oh-my-sdd --help" para ver os comandos disponíveis.\n');
  process.exit(1);
}

const mod = await commands[command]();
await mod.default(args);
