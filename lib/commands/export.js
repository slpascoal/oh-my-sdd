import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(__dirname, '..', 'templates', 'sdd-rules', 'rules.md');

const SURFACES = {
  cursor:   { kind: 'file',  path: join('.cursor', 'rules', 'oh-my-sdd.mdc') },
  windsurf: { kind: 'file',  path: join('.windsurf', 'rules', 'oh-my-sdd.md') },
  zed:      { kind: 'file',  path: join('.zed', 'rules', 'oh-my-sdd.md') },
  codex:    { kind: 'section', path: 'AGENTS.md' },
  gemini:   { kind: 'section', path: 'GEMINI.md' },
};

const START = '<!-- oh-my-sdd:start -->';
const END = '<!-- oh-my-sdd:end -->';

export default async function exportRules(args = []) {
  const tool = args.find((a) => !a.startsWith('--'));
  const supported = Object.keys(SURFACES).join(', ');
  if (!tool || !SURFACES[tool]) {
    console.error(chalk.red(`\n  Ferramenta ${tool ? `"${tool}"` : 'não informada'} não suportada. Suportadas: ${supported}\n`));
    process.exitCode = 1;
    return;
  }
  const content = readFileSync(TEMPLATE, 'utf8');
  const cwd = process.cwd();
  const surface = SURFACES[tool];
  const target = join(cwd, surface.path);

  if (surface.kind === 'file') {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    console.log(chalk.green(`\n  ✔ Regras SDD gravadas em ${surface.path} (own-file, sobrescrita segura — arquivo é nosso)\n`));
    return;
  }

  // section kind: merge por marcadores, preservando conteúdo de terceiros
  let current = existsSync(target) ? readFileSync(target, 'utf8') : '';
  const re = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  const inner = content
    .replace('<!-- oh-my-sdd:start -->\n', '')
    .replace(/\n<!-- oh-my-sdd:end -->\s*$/, '');
  const section = `${START}\n${inner}\n${END}`;
  const updated = re.test(current) ? current.replace(re, section) : `${current ? current.replace(/\s*$/, '\n\n') : ''}${section}\n`;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, updated);
  console.log(chalk.green(`\n  ✔ Seção SDD atualizada em ${surface.path} (merge por marcadores, conteúdo de terceiros preservado)\n`));
}
