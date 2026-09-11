import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Detects test/typecheck/lint tooling for the target project (any stack)
// and resolves the REAL commands to run. The generated sensors.json is
// concrete and editable; hardcoded defaults are a last-resort fallback only.

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function has(path, name) {
  return existsSync(join(path, name));
}

function pyprojectHas(path, section) {
  const file = join(path, 'pyproject.toml');
  if (!existsSync(file)) return false;
  try {
    return readFileSync(file, 'utf8').includes(`[${section}]`);
  } catch {
    return false;
  }
}

// --- tests ---------------------------------------------------------------

export function detectTests(cwd) {
  const pkg = readJson(join(cwd, 'package.json'));
  if (pkg?.scripts?.test) {
    return { command: 'npm test', detail: `scripts.test: ${pkg.scripts.test}` };
  }
  if (has(cwd, 'pytest.ini') || pyprojectHas(cwd, 'tool.pytest.ini_options')) return { command: 'pytest' };
  if (has(cwd, 'go.mod')) return { command: 'go test ./...' };
  if (has(cwd, 'Cargo.toml')) return { command: 'cargo test' };
  if (has(cwd, 'pom.xml')) return { command: has(cwd, 'mvnw') ? './mvnw test' : 'mvn test' };
  if (has(cwd, 'build.gradle') || has(cwd, 'build.gradle.kts')) {
    return { command: has(cwd, 'gradlew') ? './gradlew test' : 'gradle test' };
  }
  return null;
}

// --- typecheck ------------------------------------------------------------

export function detectTypecheck(cwd) {
  if (has(cwd, 'tsconfig.json') || has(cwd, 'jsconfig.json')) return { command: 'npx tsc --noEmit' };
  if (has(cwd, 'pyrightconfig.json')) return { command: 'pyright' };
  if (has(cwd, 'mypy.ini') || has(cwd, '.mypy.ini') || pyprojectHas(cwd, 'tool.mypy')) return { command: 'mypy .' };
  if (has(cwd, 'Cargo.toml')) return { command: 'cargo check' };
  return null;
}

// --- lint -----------------------------------------------------------------

export function detectLint(cwd) {
  const pkg = readJson(join(cwd, 'package.json'));
  if (has(cwd, 'eslint.config.js') || has(cwd, 'eslint.config.mjs') ||
      ['.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml']
        .some((f) => has(cwd, f))) {
    return { command: 'npx eslint .' };
  }
  if (has(cwd, 'biome.json')) return { command: 'npx @biomejs/biome check .' };
  if (has(cwd, 'ruff.toml') || has(cwd, '.ruff.toml') || pyprojectHas(cwd, 'tool.ruff')) return { command: 'ruff check .' };
  if (has(cwd, '.golangci.yml') || has(cwd, '.golangci.yaml')) return { command: 'golangci-lint run' };
  if (has(cwd, '.flake8') || has(cwd, 'setup.cfg')) return { command: 'flake8' };
  if (has(cwd, 'Cargo.toml')) return { command: 'cargo clippy' };
  return null;
}

const DETECTORS = {
  'tests-passing': detectTests,
  'typecheck-clean': detectTypecheck,
  'lint': detectLint,
};

// Last-resort fallback when a declared sensor has no command and detection failed.
export function defaultCommand(sensor) {
  return { 'tests-passing': 'npm test', 'typecheck-clean': 'npx tsc --noEmit', 'lint': 'npx eslint .' }[sensor] || null;
}

// Builds the sensors.json proposal for the project at cwd.
// Detected sensors -> required: true with the resolved command.
// Undetected builtins -> required: false, command: null (runner skips them with a reason).
export function detectSensors(cwd = process.cwd()) {
  const sensors = {};
  const findings = [];
  for (const [name, detect] of Object.entries(DETECTORS)) {
    const hit = detect(cwd);
    if (hit) {
      sensors[name] = { command: hit.command, required: true, timeout: 300 };
      findings.push(`${name}: ${hit.command} (${hit.detail || 'detectado'})`);
    } else {
      sensors[name] = { command: null, required: false, timeout: 300 };
      findings.push(`${name}: não detectado (opcional, será skipped)`);
    }
  }
  return { sensors, findings };
}
