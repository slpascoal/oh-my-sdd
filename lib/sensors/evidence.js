import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const RUNTIME_ROOT = '.oh-my-sdd/runtime/sensors';

export function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

export function fingerprint(cwd = process.cwd()) {
  const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' });
  if (git.status === 0) {
    const parts = [git.stdout.trim()];
    const dirty = spawnSync('git', ['status', '--porcelain'], { cwd, encoding: 'utf8' });
    for (const line of dirty.stdout.split('\n').filter(Boolean)) {
      const file = line.slice(3).trim().replace(/^"|"$/g, '');
      try {
        parts.push(`${file}:${sha256(readFileSync(join(cwd, file)))}`);
      } catch { /* deleted/unreadable: path alone still shifts the hash */ }
    }
    return sha256(parts.join('\n'));
  }
  return mtimeFingerprint(cwd);
}

function mtimeFingerprint(cwd) {
  const out = [];
  const walk = (dir, depth) => {
    if (depth > 4 || out.length >= 500) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (out.length >= 500) return;
      if (['node_modules', '.git', '.oh-my-sdd'].includes(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full, depth + 1);
      else if (/\.(js|ts|json|md)$/.test(entry.name)) {
        try { out.push(`${full}:${statSync(full).mtimeMs}`); } catch { /* unreadable, skip */ }
      }
    }
  };
  walk(cwd, 0);
  return sha256(out.sort().join('\n'));
}

export function evidencePath(slug, sensor) {
  return join(RUNTIME_ROOT, slug, `${sensor}.json`);
}

export function readEvidence(slug, sensor, base = process.cwd()) {
  const p = join(base, evidencePath(slug, sensor));
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

export function writeEvidence(slug, evidence, base = process.cwd()) {
  const p = join(base, evidencePath(slug, evidence.sensor));
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, JSON.stringify(evidence, null, 2));
  return p;
}

export function isValid(evidence, currentFp) {
  return Boolean(evidence) && evidence.fingerprint === currentFp;
}
