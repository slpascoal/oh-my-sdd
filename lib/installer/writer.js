import {
  existsSync, mkdirSync, cpSync, rmSync,
  readdirSync, statSync,
} from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const SKILLS_SRC_ROOT = join(REPO_ROOT, 'skills');
const KNOWLEDGE_SRC = join(REPO_ROOT, 'knowledge');

export function getSkillsRoot() {
  return join(os.homedir(), '.claude', 'skills');
}

// Every skill folder shipped in this package (oh-my-sdd, oh-my-sdd-constitution, ...).
export function getSkillNames() {
  return readdirSync(SKILLS_SRC_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
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
  constructor(skillsRoot = getSkillsRoot()) {
    this.skillsRoot = skillsRoot;
    this.skillNames = getSkillNames();
  }

  // Copies skills/<name>/ (SKILL.md + support files) and knowledge/*.md into
  // <skillsRoot>/<name>/, for every skill shipped in this package.
  install() {
    for (const name of this.skillNames) {
      const dest = join(this.skillsRoot, name);
      mkdirSync(dest, { recursive: true });
      cpSync(join(SKILLS_SRC_ROOT, name), dest, { recursive: true });

      const knowledgeDest = join(dest, 'knowledge');
      mkdirSync(knowledgeDest, { recursive: true });
      cpSync(KNOWLEDGE_SRC, knowledgeDest, { recursive: true });
    }
  }

  // Every installed file across all skills, relative to skillsRoot, for manifest purposes.
  installedFiles() {
    const files = [];
    for (const name of this.skillNames) {
      const dest = join(this.skillsRoot, name);
      if (!existsSync(dest)) continue;
      files.push(...listFilesRecursive(dest).map((f) => `${name}/${f}`));
    }
    return files;
  }

  remove() {
    for (const name of this.skillNames) {
      const dest = join(this.skillsRoot, name);
      if (existsSync(dest)) {
        rmSync(dest, { recursive: true, force: true });
      }
    }
  }

  // Presence of the orchestrator skill is used as a proxy for "the set is installed".
  isInstalled() {
    const orchestrator = join(this.skillsRoot, 'oh-my-sdd');
    return existsSync(orchestrator) && statSync(orchestrator).isDirectory();
  }

  // { name: boolean } for each skill shipped in this package.
  installedSkillsStatus() {
    const status = {};
    for (const name of this.skillNames) {
      status[name] = existsSync(join(this.skillsRoot, name));
    }
    return status;
  }
}
