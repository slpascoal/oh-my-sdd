import { readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Writer, getSkillsRoot } from '../installer/writer.js';
import { loadManifest, fileStatus } from '../installer/manifest.js';

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

export default async function status() {
  const { default: chalk } = await import('chalk');

  const writer = new Writer();
  const skillsRoot = getSkillsRoot();
  const packageVersion = getVersion();

  console.log('');
  if (!writer.isInstalled()) {
    console.log(chalk.yellow('  oh-my-sdd não está instalado.'));
    console.log(chalk.gray(`  Esperado em: ${skillsRoot}`));
    console.log(chalk.cyan('  → Execute "npx oh-my-sdd install" para instalar.'));
    console.log('');
    return;
  }

  console.log(chalk.green('  oh-my-sdd está instalado.'));
  console.log(`  ${chalk.cyan('Destino:')}         ${skillsRoot}`);
  console.log(`  ${chalk.cyan('Versão do pacote:')} ${packageVersion}`);

  console.log('');
  console.log(chalk.bold('  Skills:'));
  const skillsStatus = writer.installedSkillsStatus();
  for (const [name, present] of Object.entries(skillsStatus)) {
    const mark = present ? chalk.green('✓') : chalk.red('✗ ausente');
    console.log(`    ${mark} ${name}`);
  }

  const manifest = loadManifest(skillsRoot);
  const relPaths = Object.keys(manifest);
  if (relPaths.length > 0) {
    const modified = relPaths.filter(
      (rel) => fileStatus(skillsRoot, rel, manifest[rel]) !== 'intact'
    );
    console.log('');
    if (modified.length > 0) {
      console.log(chalk.yellow(`  ${modified.length} arquivo(s) modificado(s) desde a instalação:`));
      for (const rel of modified) {
        console.log(chalk.gray(`    - ${rel}`));
      }
    } else {
      console.log(chalk.gray('  Todos os arquivos instalados estão intactos.'));
    }
  }
  console.log('');
}
