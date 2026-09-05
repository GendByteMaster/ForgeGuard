import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = join(root, 'bin/forgeguard.js');
const read = (path) => readFileSync(path, 'utf8');
const references = ['instruction-resolution', 'delegation-intelligence', 'verification-policy', 'subagent-policy'];
const openAiModelGuidance = 'https://developers.openai.com/api/docs/guides/latest-model';

for (const client of ['all', 'codex', 'claude', 'cursor']) {
  test(`${client}: install, status, reinstall, and uninstall preserve user content`, (t) => {
    const cwd = mkdtempSync(join(tmpdir(), 'forgeguard-lifecycle-'));
    t.after(() => rmSync(cwd, { recursive: true, force: true }));
    const run = (...args) => execFileSync(process.execPath, [cli, ...args, '--client', client], { cwd, encoding: 'utf8' });
    const agents = join(cwd, 'AGENTS.md');
    const config = join(cwd, '.codex/config.toml');
    const originalConfig = 'model = "user-primary"\n';
    writeFileSync(agents, '# User instructions\n');
    mkdirSync(dirname(config), { recursive: true });
    writeFileSync(config, originalConfig);
    run('install', '--dry-run');
    assert.equal(read(agents), '# User instructions\n');
    assert.equal(read(config), originalConfig);
    const targets = client === 'all' ? ['.agents', '.claude'] : [client === 'claude' ? '.claude' : '.agents'];
    for (const target of targets) assert.equal(existsSync(join(cwd, target, 'skills/engineering-guardrails')), false);
    run('install');
    assert.equal(read(config), originalConfig, 'normal installation must not alter runtime');
    const version = JSON.parse(read(join(root, 'package.json'))).version;
    assert.match(run('status'), new RegExp(`v${version.replaceAll('.', '\\.')}`));
    for (const target of targets) {
      const skill = join(cwd, target, 'skills/engineering-guardrails');
      assert.match(read(join(skill, 'SKILL.md')), new RegExp(`version: "${version.replaceAll('.', '\\.')}"`));
      for (const ref of references) assert.equal(read(join(skill, `references/${ref}.md`)), read(join(root, `engineering-guardrails/references/${ref}.md`)));
    }
    if (client === 'all' || client === 'codex') {
      const managed = read(agents);
      for (const rule of [/current task\/scope/, /does not require delegation/, /actively evaluate/, /objective, scope, expected output, evidence required, and constraints/, /workers must not spawn/, /final verification/, /hard requirements from recommendations/]) assert.match(managed, rule);
      run('install', '--subagents', '--force');
      assert.match(read(config), /default_subagent_model = "gpt-5\.6-luna"/);
      assert.match(read(config), /default_subagent_reasoning_effort = "xhigh"/);
      const configured = read(config);
      run('install', '--subagents', '--force');
      assert.equal(read(agents), managed);
      assert.equal(read(config), configured);
    } else {
      run('install', '--force');
      assert.equal(read(agents), '# User instructions\n');
    }
    run('uninstall');
    assert.equal(read(agents), '# User instructions\n');
    assert.equal(read(config).trim(), originalConfig.trim());
    for (const target of targets) assert.equal(existsSync(join(cwd, target, 'skills/engineering-guardrails')), false);
    assert.match(run('status'), /missing/);
  });
}

test('policy contract preserves authorization, portability, depth, evidence, and verification invariants', () => {
  const policy = (name) => read(join(root, `engineering-guardrails/references/${name}.md`));
  assert.match(policy('subagent-policy'), /do not ask again before every spawn/i);
  assert.match(policy('subagent-policy'), /Renew approval only when proposed delegation exceeds the authorized scope/);
  assert.match(policy('subagent-policy'), /Authorization != mandatory delegation/);
  assert.match(policy('subagent-policy'), /Continue working without a subagent whenever possible/);

  const delegation = policy('delegation-intelligence');
  for (const rule of [/actively evaluate/, /Suppress delegation for small changes, strictly sequential/, /Default delegation depth = 1/, /not automatically accepted truth/, /Objective:/, /Scope:/, /Expected output:/, /Evidence required:/, /Constraints:/]) assert.match(delegation, rule);
  assert.match(delegation, /ForgeGuard policy choices rather than requirements stated by OpenAI/);
  assert.match(delegation, new RegExp(openAiModelGuidance.replaceAll('/', '\\/')));

  const instructionResolution = policy('instruction-resolution');
  assert.match(instructionResolution, /Always follow the host platform's instruction hierarchy and scoping rules/);
  assert.match(instructionResolution, /does not define a universal precedence order/);
  assert.match(instructionResolution, /explicit user instructions take precedence over ForgeGuard recommendations and skill guidelines/);
  assert.match(instructionResolution, /cite the exact file\/source/);
  assert.match(instructionResolution, new RegExp(openAiModelGuidance.replaceAll('/', '\\/')));

  const verification = policy('verification-policy');
  assert.match(verification, /Small\/reversible/);
  assert.match(verification, /Targeted regression/);
  assert.match(verification, /Broader contract and integration/);
  assert.match(verification, /only when new changes, failures, new evidence, or unresolved concerns/);
  assert.match(verification, new RegExp(openAiModelGuidance.replaceAll('/', '\\/')));
});

test('skill references resolve and CLI version matches the package', () => {
  const path = join(root, 'engineering-guardrails/SKILL.md');
  for (const match of read(path).matchAll(/\]\((references\/[^)]+)\)/g)) assert.ok(existsSync(join(dirname(path), match[1])), match[1]);
  assert.equal(execFileSync(process.execPath, [cli, '--version'], { encoding: 'utf8' }).trim(), JSON.parse(read(join(root, 'package.json'))).version);
});
