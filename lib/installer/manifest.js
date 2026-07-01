import { createHash } from 'crypto';
import { readFileSync, existsSync, writeFileSync, mkdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

const MANIFEST_FILENAME = '.oh-my-sdd-manifest.json';

export function hashFile(filePath) {
  if (!existsSync(filePath)) return null;
  if (statSync(filePath).isDirectory()) return null;
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

// Accepts paths relative to `target` (the installed skill dir); stores them as relative keys.
export function buildManifest(target, relPaths) {
  const manifest = {};
  for (const relPath of relPaths) {
    const hash = hashFile(join(target, relPath));
    if (hash) manifest[relPath] = hash;
  }
  return manifest;
}

export function manifestPath(target) {
  return join(target, MANIFEST_FILENAME);
}

export function saveManifest(target, manifest) {
  const path = manifestPath(target);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(manifest, null, 2), 'utf8');
}

export function loadManifest(target) {
  const path = manifestPath(target);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
}

// Returns 'intact' | 'modified' | 'missing'
export function fileStatus(target, relPath, originalHash) {
  const current = hashFile(join(target, relPath));
  if (!current) return 'missing';
  return current === originalHash ? 'intact' : 'modified';
}
