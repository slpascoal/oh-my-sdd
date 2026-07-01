import { readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Writer, getInstallTarget } from '../installer/writer.js';
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
  const target = getInstallTarget();
  const packageVersion = getVersion();

  console.log('');
  if (!writer.isInstalled()) {
    console.log(chalk.yellow('  oh-my-sdd não está instalado.'));
    console.log(chalk.gray(`  Esperado em: ${target}`));
    console.log(chalk.cyan('  → Execute "npx oh-my-sdd install" para instalar.'));
    console.log('');
    return;
  }

  console.log(chalk.green('  oh-my-sdd está instalado.'));
  console.log(`  ${chalk.cyan('Destino:')}         ${target}`);
  console.log(`  ${chalk.cyan('Versão do pacote:')} ${packageVersion}`);

  const manifest = loadManifest(target);
  const relPaths = Object.keys(manifest);
  if (relPaths.length > 0) {
    const modified = relPaths.filter(
      (rel) => fileStatus(target, rel, manifest[rel]) !== 'intact'
    );
    if (modified.length > 0) {
      console.log('');
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
