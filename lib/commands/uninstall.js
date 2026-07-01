import { Writer, getSkillsRoot } from '../installer/writer.js';
import { manifestPath } from '../installer/manifest.js';
import { existsSync, rmSync } from 'fs';

export default async function uninstall() {
  const { default: chalk } = await import('chalk');
  const { default: inquirer } = await import('inquirer');

  const writer = new Writer();
  const skillsRoot = getSkillsRoot();

  if (!writer.isInstalled()) {
    console.log(chalk.gray(`\n  oh-my-sdd não está instalado (esperado em ${skillsRoot}).\n`));
    return;
  }

  const { proceed } = await inquirer.prompt([{
    prefix: '',
    type: 'confirm',
    name: 'proceed',
    message: `Remover as skills oh-my-sdd (${writer.skillNames.join(', ')}) de ${skillsRoot}?`,
    default: false,
  }]);

  if (!proceed) {
    console.log(chalk.gray('\n  Desinstalação cancelada.\n'));
    return;
  }

  writer.remove();
  const manifest = manifestPath(skillsRoot);
  if (existsSync(manifest)) {
    rmSync(manifest, { force: true });
  }
  console.log(chalk.green(`\n  oh-my-sdd removido de ${skillsRoot}\n`));
}
