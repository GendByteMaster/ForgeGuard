#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_NAME = 'engineering-guardrails';
const VERSION = '1.1.0';
const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(PACKAGE_ROOT, SKILL_NAME);

function usage() {
  console.log(`ForgeGuard v${VERSION}\n\nUsage:\n  forgeguard install [options]\n  forgeguard status [options]\n  forgeguard uninstall [options]\n\nOptions:\n  --client <all|codex|claude|cursor>  Target client (default: all)\n  --global                             Install in user-level skill directories\n  --force                              Replace an existing ForgeGuard installation\n  --dry-run                            Print actions without changing files\n  -h, --help                           Show help\n  -v, --version                        Show version\n\nExamples:\n  forgeguard install\n  forgeguard install --client codex\n  forgeguard install --client claude --global\n  forgeguard status --client all\n`);
}

function fail(message) {
  console.error(`ForgeGuard: ${message}`);
  process.exitCode = 1;
}

function parseArgs(argv) {
  const out = { command: 'install', client: 'all', global: false, force: false, dryRun: false };
  const args = [...argv];
  if (args[0] && !args[0].startsWith('-')) out.command = args.shift();

  while (args.length) {
    const arg = args.shift();
    if (arg === '--client') out.client = args.shift();
    else if (arg?.startsWith('--client=')) out.client = arg.slice('--client='.length);
    else if (arg === '--global') out.global = true;
    else if (arg === '--force') out.force = true;
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

  const selected = client === 'all' ? ['codex', 'claude', 'cursor'] : [client];
  const grouped = new Map();

  for (const name of selected) {
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
}

function status(options) {
  for (const target of targetPaths(options.client, options.global)) {
    const version = installedVersion(target.path);
    const label = target.clients.join('+');
    console.log(
      `${version ? 'installed' : 'missing  '} ${label}: ${target.path}${version ? ` (v${version})` : ''}`
    );
  }
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
