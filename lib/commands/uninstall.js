import { Writer, getInstallTarget } from '../installer/writer.js';

export default async function uninstall() {
  const { default: chalk } = await import('chalk');
  const { default: inquirer } = await import('inquirer');

  const writer = new Writer();
  const target = getInstallTarget();

  if (!writer.isInstalled()) {
    console.log(chalk.gray(`\n  oh-my-sdd não está instalado (esperado em ${target}).\n`));
    return;
  }

  const { proceed } = await inquirer.prompt([{
    prefix: '',
    type: 'confirm',
    name: 'proceed',
    message: `Remover ${target}?`,
    default: false,
  }]);

  if (!proceed) {
    console.log(chalk.gray('\n  Desinstalação cancelada.\n'));
    return;
  }

  writer.remove();
  console.log(chalk.green(`\n  oh-my-sdd removido de ${target}\n`));
}
