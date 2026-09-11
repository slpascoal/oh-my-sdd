import { spawnSync } from 'child_process';
import { join } from 'path';
import { fingerprint, writeEvidence } from './evidence.js';
import { defaultCommand, detectSensors } from './detect.js';

const OUTPUT_CAP_BYTES = 4 * 1024;

export function truncate(output, maxBytes = OUTPUT_CAP_BYTES, maxLines = 50) {
  const lines = String(output).split('\n');
  const capped = lines.slice(-maxLines).join('\n');
  return capped.length > maxBytes ? capped.slice(-maxBytes) : capped;
}

export function resolveCommand(name, cfg, cwd, detected) {
  if (cfg?.command) return { command: cfg.command, source: 'config' };
  if (detected?.command) return { command: detected.command, source: 'detection' };
  const fb = defaultCommand(name);
  return fb ? { command: fb, source: 'fallback' } : null;
}

// Skip pre-check per builtin sensor: declared but nothing backing it in the
// repo -> skipped with a reason, never a silent pass and never a hard failure.
function skipReason(name, cwd, detected) {
  if (!['tests-passing', 'typecheck-clean', 'lint'].includes(name)) return null;
  if (detected?.command) return null;
  const reasons = {
    'tests-passing': 'nenhum runner de teste detectado no projeto',
    'typecheck-clean': 'nenhum artefato de typecheck detectado no projeto',
    'lint': 'nenhum linter detectado no projeto',
  };
  return reasons[name];
}

export function runSensor(name, cfg, cwd, slug) {
  const detected = detectSensors(cwd).sensors[name];
  const skip = skipReason(name, cwd, detected);
  const startedAt = Date.now();
  if (skip) {
    const evidence = {
      sensor: name, command: null, status: 'skipped', exitCode: null,
      durationMs: 0, output: '', timestamp: new Date().toISOString(),
      fingerprint: fingerprint(cwd), reason: skip,
    };
    writeEvidence(slug, evidence, cwd);
    return evidence;
  }
  const resolved = resolveCommand(name, cfg, cwd, detected);
  if (!resolved) {
    const evidence = {
      sensor: name, command: null, status: 'failed', exitCode: null,
      durationMs: 0, output: '', timestamp: new Date().toISOString(),
      fingerprint: fingerprint(cwd), reason: 'sem comando configurado nem detectável',
    };
    writeEvidence(slug, evidence, cwd);
    return evidence;
  }
  return runCommand(name, resolved.command, cwd, slug, startedAt, cfg?.timeout);
}

function runCommand(name, command, cwd, slug, startedAt, timeoutSec) {
  const timeoutMs = (Number(timeoutSec) > 0 ? Number(timeoutSec) : 300) * 1000;
  const res = spawnSync(command, {
    cwd, encoding: 'utf8', timeout: timeoutMs, shell: true, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const status = res.error?.code === 'ENOENT' ? 'failed'
    : res.error?.killed || res.signal ? 'timeout' : res.status === 0 ? 'passed' : 'failed';
  const evidence = {
    sensor: name, command, status,
    exitCode: res.status, durationMs: Date.now() - startedAt,
    output: truncate(`${res.stdout || ''}${res.stderr || ''}`),
    timestamp: new Date().toISOString(),
    fingerprint: fingerprint(cwd),
    reason: status === 'failed' ? `exit ${res.status}` : undefined,
  };
  writeEvidence(slug, evidence, cwd);
  return evidence;
}

export function runAll(slug, config, cwd = process.cwd()) {
  const entries = Object.entries(config?.sensors || {});
  if (!entries.length) return { results: [], allRequiredPassed: false, reason: 'nenhum sensor declarado' };
  const results = entries.map(([name, cfg]) => runSensor(name, cfg, cwd, slug));
  const allRequiredPassed = results.every((r) => !r || (config.sensors[r.sensor]?.required ? r.status === 'passed' : true));
  return { results, allRequiredPassed };
}
