import {
  existsSync, mkdirSync, cpSync, rmSync,
  readdirSync, statSync,
} from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const SKILL_SRC = join(REPO_ROOT, 'skills', 'oh-my-sdd');
const KNOWLEDGE_SRC = join(REPO_ROOT, 'knowledge');

export function getInstallTarget() {
  return join(os.homedir(), '.claude', 'skills', 'oh-my-sdd');
}

// Lists every regular file under `dir`, relative to `dir` (posix-style separators).
function listFilesRecursive(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFilesRecursive(full).map((f) => join(entry.name, f)));
    } else {
      out.push(entry.name);
    }
  }
  return out.map((p) => p.split('\\').join('/'));
}

export class Writer {
  constructor(target = getInstallTarget()) {
    this.target = target;
  }

  // Copies skills/oh-my-sdd/ (SKILL.md + support files) and knowledge/*.md into target.
  install() {
    mkdirSync(this.target, { recursive: true });
    cpSync(SKILL_SRC, this.target, { recursive: true });

    const knowledgeDest = join(this.target, 'knowledge');
    mkdirSync(knowledgeDest, { recursive: true });
    cpSync(KNOWLEDGE_SRC, knowledgeDest, { recursive: true });
  }

  // Every installed file relative to target, for manifest purposes.
  installedFiles() {
    if (!existsSync(this.target)) return [];
    return listFilesRecursive(this.target).filter(
      (f) => f !== '.oh-my-sdd-manifest.json'
    );
  }

  remove() {
    if (existsSync(this.target)) {
      rmSync(this.target, { recursive: true, force: true });
    }
  }

  isInstalled() {
    return existsSync(this.target) && statSync(this.target).isDirectory();
  }
}
