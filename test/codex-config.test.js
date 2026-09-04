import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  applyCodexSubagentConfig,
  getCodexSubagentConfigStatus,
  removeCodexSubagentConfig
} from '../bin/codex-config.js';

function tempConfig(initial = null) {
  const dir = mkdtempSync(join(tmpdir(), 'forgeguard-codex-'));
  const path = join(dir, '.codex', 'config.toml');
  if (initial !== null) {
    const configDir = join(dir, '.codex');
    return { dir, path, seed: () => import('node:fs').then(({ mkdirSync }) => {
      mkdirSync(configDir, { recursive: true });
      writeFileSync(path, initial, 'utf8');
    }) };
  }
  return { dir, path, seed: async () => {} };
}

test('creates a managed Luna xhigh [agents] section without touching unrelated config', async () => {
  const { path, seed } = tempConfig('model = "gpt-5.6-sol"\n\n[tools]\nweb_search = true\n');
  await seed();

  const status = applyCodexSubagentConfig(path);
  const text = readFileSync(path, 'utf8');

  assert.equal(status.managed, true);
  assert.equal(status.enabled, true);
  assert.equal(status.model, 'gpt-5.6-luna');
  assert.equal(status.reasoning, 'xhigh');
  assert.match(text, /model = "gpt-5\.6-sol"/);
  assert.match(text, /\[tools\]/);
  assert.match(text, /\[agents\]/);
  assert.match(text, /default_subagent_model = "gpt-5\.6-luna"/);
  assert.match(text, /default_subagent_reasoning_effort = "xhigh"/);
});

test('reuses an existing enabled=true agents section and preserves custom agent subtables', async () => {
  const initial = '[agents]\nenabled = true\nmax_concurrent_threads_per_session = 4\n\n[agents.reviewer]\ndescription = "Review changes"\n';
  const { path, seed } = tempConfig(initial);
  await seed();

  applyCodexSubagentConfig(path);
  const text = readFileSync(path, 'utf8');

  assert.equal((text.match(/^enabled = true$/gm) ?? []).length, 1);
  assert.match(text, /max_concurrent_threads_per_session = 4/);
  assert.match(text, /\[agents\.reviewer\]/);
  assert.match(text, /description = "Review changes"/);
});

test('refuses to overwrite unmanaged subagent defaults', async () => {
  const { path, seed } = tempConfig('[agents]\ndefault_subagent_model = "custom-model"\n');
  await seed();

  assert.throws(
    () => applyCodexSubagentConfig(path),
    /will not overwrite it automatically/
  );
  assert.equal(readFileSync(path, 'utf8'), '[agents]\ndefault_subagent_model = "custom-model"\n');
});

test('updates an existing ForgeGuard block idempotently', async () => {
  const { path, seed } = tempConfig();
  await seed();

  applyCodexSubagentConfig(path);
  const first = readFileSync(path, 'utf8');
  applyCodexSubagentConfig(path);
  const second = readFileSync(path, 'utf8');

  assert.equal(second, first);
  assert.equal((second.match(/forgeguard:subagents-managed-start/g) ?? []).length, 1);
  assert.equal((second.match(/forgeguard:subagents-managed-end/g) ?? []).length, 1);
});

test('removes only ForgeGuard-managed values and preserves user-owned agents settings', async () => {
  const initial = '[agents]\nenabled = true\nmax_concurrent_threads_per_session = 6\n';
  const { path, seed } = tempConfig(initial);
  await seed();

  applyCodexSubagentConfig(path);
  assert.equal(removeCodexSubagentConfig(path), true);

  const text = readFileSync(path, 'utf8');
  assert.match(text, /\[agents\]/);
  assert.match(text, /enabled = true/);
  assert.match(text, /max_concurrent_threads_per_session = 6/);
  assert.doesNotMatch(text, /default_subagent_model/);
  assert.doesNotMatch(text, /forgeguard:subagents-managed/);
});

test('removes a config file that contained only the ForgeGuard-created agents section', async () => {
  const { path, seed } = tempConfig();
  await seed();

  applyCodexSubagentConfig(path);
  assert.equal(existsSync(path), true);
  assert.equal(removeCodexSubagentConfig(path), true);
  assert.equal(existsSync(path), false);
});

test('status reports unmanaged when ForgeGuard has no runtime block', async () => {
  const { path, seed } = tempConfig('[agents]\nenabled = true\n');
  await seed();

  const status = getCodexSubagentConfigStatus(path);
  assert.equal(status.managed, false);
  assert.equal(status.model, null);
  assert.equal(status.reasoning, null);
});

test('inserts the parent [agents] section before an existing agents subtable', async () => {
  const { path, seed } = tempConfig('[agents.reviewer]\ndescription = "Review changes"\n');
  await seed();

  applyCodexSubagentConfig(path);
  const text = readFileSync(path, 'utf8');

  assert.ok(text.indexOf('[agents]') < text.indexOf('[agents.reviewer]'));
  assert.match(text, /default_subagent_model = "gpt-5\.6-luna"/);
  assert.match(text, /\[agents\.reviewer\]/);
});

test('refuses to silently enable subagents when unmanaged enabled=false exists', async () => {
  const initial = '[agents]\nenabled = false\n';
  const { path, seed } = tempConfig(initial);
  await seed();

  assert.throws(
    () => applyCodexSubagentConfig(path),
    /enabled setting conflicts/
  );
  assert.equal(readFileSync(path, 'utf8'), initial);
});
