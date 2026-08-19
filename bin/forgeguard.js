#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync
} from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_NAME = 'engineering-guardrails';
const VERSION = '1.4.0';
const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(PACKAGE_ROOT, SKILL_NAME);

const AGENTS_START = '<!-- forgeguard:managed-start -->';
const AGENTS_END = '<!-- forgeguard:managed-end -->';
const AGENTS_BLOCK = `${AGENTS_START}
## ForgeGuard

- Before substantial ambiguous work, use ForgeGuard Goal Intelligence to define measurable success when needed.
- Before repository implementation, bug fixes, refactors, migrations, security-sensitive changes, production changes, or commit preparation, load and apply the \`${SKILL_NAME}\` skill.
- Follow ForgeGuard's Risk Gate and explicit subagent approval gate.
- Keep repository-local instructions authoritative within their scope.
- If the skill cannot be loaded, report that explicitly and continue with the repository's existing instructions; do not invent missing ForgeGuard policy.
${AGENTS_END}`;

function usage() {
  console.log(`ForgeGuard v${VERSION}\n\nUsage:\n  forgeguard install [options]\n  forgeguard status [options]\n  forgeguard uninstall [options]\n\nOptions:\n  --client <all|codex|claude|cursor>  Target client (default: all)\n  --global                             Install in user-level skill directories\n  --force                              Replace an existing ForgeGuard installation\n  --no-agents                          Do not manage Codex AGENTS.md integration\n  --dry-run                            Print actions without changing files\n  -h, --help                           Show help\n  -v, --version                        Show version\n\nExamples:\n  forgeguard install\n  forgeguard install --client codex\n  forgeguard install --client claude --global\n  forgeguard install --global\n  forgeguard status --client all\n`);
}

function fail(message) {
  console.error(`ForgeGuard: ${message}`);
  process.exitCode = 1;
}

function parseArgs(argv) {
  const out = {
    command: 'install',
    client: 'all',
    global: false,
    force: false,
    dryRun: false,
    noAgents: false
  };
  const args = [...argv];
  if (args[0] && !args[0].startsWith('-')) out.command = args.shift();

  while (args.length) {
    const arg = args.shift();
    if (arg === '--client') out.client = args.shift();
    else if (arg?.startsWith('--client=')) out.client = arg.slice('--client='.length);
    else if (arg === '--global') out.global = true;
    else if (arg === '--force') out.force = true;
    else if (arg === '--no-agents') out.noAgents = true;
    else if (arg === '--dry-run') out.dryRun = true;
    else if (arg === '-h' || arg === '--help') out.help = true;
    else if (arg === '-v' || arg === '--version') out.version = true;
    else throw new Error(`unknown option: ${arg}`);
  }

  if (!['all', 'codex', 'claude', 'cursor'].includes(out.client)) {
    throw new Error(`unsupported client: ${out.client}`);
  }
  if (!['install', 'status', 'uninstall', 'help'].includes(out.command)) {
    throw new Error(`unknown command: ${out.command}`);
  }
  return out;
}

function selectedClients(client) {
  return client === 'all' ? ['codex', 'claude', 'cursor'] : [client];
}

function targetPaths(client, globalScope) {
  const cwd = process.cwd();
  const home = homedir();
  const map = {
    codex: globalScope
      ? join(home, '.agents', 'skills', SKILL_NAME)
      : join(cwd, '.agents', 'skills', SKILL_NAME),
    claude: globalScope
      ? join(home, '.claude', 'skills', SKILL_NAME)
      : join(cwd, '.claude', 'skills', SKILL_NAME),
    cursor: globalScope
      ? join(home, '.cursor', 'skills', SKILL_NAME)
      : join(cwd, '.agents', 'skills', SKILL_NAME)
  };

  const grouped = new Map();
  for (const name of selectedClients(client)) {
    const path = map[name];
    const current = grouped.get(path) ?? [];
    current.push(name);
    grouped.set(path, current);
  }

  return [...grouped.entries()].map(([path, clients]) => ({ path, clients }));
}

function installedVersion(path) {
  const skillFile = join(path, 'SKILL.md');
  if (!existsSync(skillFile)) return null;
  const text = readFileSync(skillFile, 'utf8');
  return text.match(/\bversion:\s*["']?([^"'\s]+)["']?/)?.[1] ?? 'unknown';
}

function isNonEmptyFile(path) {
  return existsSync(path) && readFileSync(path, 'utf8').trim().length > 0;
}

function codexHome() {
  return process.env.CODEX_HOME ? resolve(process.env.CODEX_HOME) : join(homedir(), '.codex');
}

function agentsPaths(globalScope) {
  const base = globalScope ? codexHome() : process.cwd();
  return {
    override: join(base, 'AGENTS.override.md'),
    regular: join(base, 'AGENTS.md')
  };
}

function findManagedBlock(text) {
  const start = text.indexOf(AGENTS_START);
  const endStart = text.indexOf(AGENTS_END);

  if (start === -1 && endStart === -1) return null;
  if (start === -1 || endStart === -1 || endStart < start) {
    throw new Error('found a malformed ForgeGuard managed block in AGENTS instructions');
  }

  return { start, end: endStart + AGENTS_END.length };
}

function renderWithoutManagedBlock(text) {
  const block = findManagedBlock(text);
  if (!block) return text;

  const before = text.slice(0, block.start).trimEnd();
  const after = text.slice(block.end).trimStart();
  return [before, after].filter(Boolean).join('\n\n');
}

function removeManagedBlock(path, dryRun) {
  if (!existsSync(path)) return false;

  const original = readFileSync(path, 'utf8');
  const block = findManagedBlock(original);
  if (!block) return false;

  const next = renderWithoutManagedBlock(original);
  console.log(`${dryRun ? 'would unlink' : 'unlink '} agents: ${path}`);
  if (dryRun) return true;

  if (!next.trim()) unlinkSync(path);
  else writeFileSync(path, `${next.trimEnd()}\n`, 'utf8');
  return true;
}

function ensureManagedBlock(path, dryRun) {
  const original = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const withoutBlock = renderWithoutManagedBlock(original);
  const next = withoutBlock.trim()
    ? `${withoutBlock.trimEnd()}\n\n${AGENTS_BLOCK}\n`
    : `${AGENTS_BLOCK}\n`;

  if (original === next) {
    console.log(`linked  agents: ${path}`);
    return;
  }

  console.log(`${dryRun ? 'would link' : 'link   '} agents: ${path}`);
  if (dryRun) return;

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, next, 'utf8');
}

function shouldManageAgents(options) {
  return !options.noAgents && selectedClients(options.client).includes('codex');
}

function installAgentsIntegration(options) {
  if (!shouldManageAgents(options)) return;

  const paths = agentsPaths(options.global);
  const target = isNonEmptyFile(paths.override) ? paths.override : paths.regular;
  const other = target === paths.override ? paths.regular : paths.override;

  removeManagedBlock(other, options.dryRun);
  ensureManagedBlock(target, options.dryRun);
}

function statusAgentsIntegration(options) {
  if (!shouldManageAgents(options)) return;

  const paths = agentsPaths(options.global);
  const linked = [paths.override, paths.regular].filter((path) => {
    if (!existsSync(path)) return false;
    return findManagedBlock(readFileSync(path, 'utf8')) !== null;
  });

  if (!linked.length) {
    console.log(`missing   agents: ${options.global ? codexHome() : process.cwd()}`);
    return;
  }

  for (const path of linked) console.log(`linked    agents: ${path}`);
}

function uninstallAgentsIntegration(options) {
  if (!shouldManageAgents(options)) return;

  const paths = agentsPaths(options.global);
  const removedOverride = removeManagedBlock(paths.override, options.dryRun);
  const removedRegular = removeManagedBlock(paths.regular, options.dryRun);

  if (!removedOverride && !removedRegular) {
    console.log('skip     agents: no ForgeGuard managed block found');
  }
}

function install(options) {
  if (!existsSync(join(SOURCE, 'SKILL.md'))) {
    throw new Error(`bundled skill is missing at ${SOURCE}`);
  }

  for (const target of targetPaths(options.client, options.global)) {
    const label = target.clients.join('+');
    if (existsSync(target.path) && !options.force) {
      console.log(`skip    ${label}: ${target.path} (already exists; use --force)`);
      continue;
    }

    console.log(`${options.dryRun ? 'would install' : 'install'} ${label}: ${target.path}`);
    if (options.dryRun) continue;

    if (existsSync(target.path)) rmSync(target.path, { recursive: true, force: true });
    mkdirSync(dirname(target.path), { recursive: true });
    cpSync(SOURCE, target.path, { recursive: true });
  }

  installAgentsIntegration(options);

  if (shouldManageAgents(options) && !options.dryRun) {
    console.log('note     codex: start a new session to reload AGENTS instructions');
  }
}

function status(options) {
  for (const target of targetPaths(options.client, options.global)) {
    const version = installedVersion(target.path);
    const label = target.clients.join('+');
    console.log(
      `${version ? 'installed' : 'missing  '} ${label}: ${target.path}${version ? ` (v${version})` : ''}`
    );
  }

  statusAgentsIntegration(options);
}

function uninstall(options) {
  for (const target of targetPaths(options.client, options.global)) {
    const label = target.clients.join('+');
    if (!existsSync(target.path)) {
      console.log(`skip    ${label}: ${target.path} (not installed)`);
      continue;
    }

    console.log(`${options.dryRun ? 'would remove' : 'remove '} ${label}: ${target.path}`);
    if (!options.dryRun) rmSync(target.path, { recursive: true, force: true });
  }

  uninstallAgentsIntegration(options);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help || options.command === 'help') usage();
  else if (options.version) console.log(VERSION);
  else if (options.command === 'install') install(options);
  else if (options.command === 'status') status(options);
  else if (options.command === 'uninstall') uninstall(options);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
  usage();
}
