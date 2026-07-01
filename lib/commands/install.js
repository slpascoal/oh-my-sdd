import { readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Writer, getInstallTarget } from '../installer/writer.js';
import { buildManifest, saveManifest } from '../installer/manifest.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');

function getVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export default async function install() {
  const { default: chalk } = await import('chalk');
  const { default: ora } = await import('ora');

  const version = getVersion();
  const writer = new Writer();
  const target = getInstallTarget();

  console.log('');
  console.log(chalk.bold('oh-my-sdd'));
  console.log(chalk.gray('Spec-Driven Development, enforced by a global Claude Code skill.'));
  console.log('');

  if (writer.isInstalled()) {
    const { default: inquirer } = await import('inquirer');
    console.log(chalk.yellow(`  oh-my-sdd já está instalado em ${target}\n`));
    const { proceed } = await inquirer.prompt([{
      prefix: '',
      type: 'confirm',
      name: 'proceed',
      message: 'Reinstalar / atualizar para a versão atual?',
      default: false,
    }]);
    if (!proceed) {
      console.log(chalk.gray('\n  Instalação cancelada.\n'));
      return;
    }
  }

  const spinner = ora({ text: 'Instalando skill oh-my-sdd...', color: 'cyan' }).start();
  try {
    writer.install();
    const manifest = buildManifest(target, writer.installedFiles());
    saveManifest(target, manifest);
    spinner.succeed(chalk.green('Instalação concluída!'));
  } catch (err) {
    spinner.fail(chalk.red('Erro durante a instalação.'));
    throw err;
  }

  console.log('');
  console.log(chalk.bold('  Resumo:'));
  console.log(`  ${chalk.cyan('Versão:')}   ${version}`);
  console.log(`  ${chalk.cyan('Destino:')}  ${target}`);
  console.log('');
  console.log(chalk.cyan('  → Abra o Claude Code em qualquer projeto e peça para aplicar SDD numa tarefa.'));
  console.log(chalk.cyan('    A skill "oh-my-sdd" é descoberta automaticamente.'));
  console.log('');
}
