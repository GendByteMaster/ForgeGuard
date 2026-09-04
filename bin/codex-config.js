import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { dirname } from 'node:path';

export const DEFAULT_SUBAGENT_MODEL = 'gpt-5.6-luna';
export const DEFAULT_SUBAGENT_REASONING = 'xhigh';

const MANAGED_START = '# forgeguard:subagents-managed-start';
const MANAGED_END = '# forgeguard:subagents-managed-end';
const MANAGED_SECTION = '# forgeguard:subagents-managed-section';

function detectNewline(text) {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

function isSectionHeader(line) {
  return /^\s*\[[^\]]+\]\s*(?:#.*)?$/.test(line);
}

function isAgentsHeader(line) {
  return /^\s*\[agents\]\s*(?:#.*)?$/.test(line);
}

function isAgentsSubtableHeader(line) {
  return /^\s*\[agents\.[^\]]+\]\s*(?:#.*)?$/.test(line);
}

function findManagedBlock(lines) {
  const start = lines.findIndex((line) => line.trim() === MANAGED_START);
  const end = lines.findIndex((line) => line.trim() === MANAGED_END);

  if (start === -1 && end === -1) return null;
  if (start === -1 || end === -1 || end < start) {
    throw new Error('found a malformed ForgeGuard subagent config block');
  }

  return { start, end };
}

function findAgentsSection(lines) {
  const start = lines.findIndex(isAgentsHeader);
  if (start === -1) return null;

  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (isSectionHeader(lines[index])) {
      end = index;
      break;
    }
  }

  return { start, end };
}

function findFirstAgentsSubtable(lines) {
  return lines.findIndex(isAgentsSubtableHeader);
}

function findDirectKey(lines, section, key) {
  if (!section) return null;
  const pattern = new RegExp(`^\\s*${key}\\s*=`);

  for (let index = section.start + 1; index < section.end; index += 1) {
    if (pattern.test(lines[index])) return { index, line: lines[index] };
  }

  return null;
}

function hasRootDottedAgentKey(lines, key) {
  const pattern = new RegExp(`^\\s*agents\\.${key}\\s*=`);
  return lines.some((line) => pattern.test(line));
}

function parseBooleanLine(line) {
  const match = line.match(/=\s*(true|false)\b/i);
  return match ? match[1].toLowerCase() === 'true' : null;
}

function quoteToml(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('subagent config values must be non-empty strings');
  }
  return JSON.stringify(value);
}

function renderManagedBlock({ model, reasoning, includeEnabled }) {
  const lines = [MANAGED_START];
  if (includeEnabled) lines.push('enabled = true');
  lines.push(`default_subagent_model = ${quoteToml(model)}`);
  lines.push(`default_subagent_reasoning_effort = ${quoteToml(reasoning)}`);
  lines.push(MANAGED_END);
  return lines;
}

function parseManagedStatus(lines, path) {
  const block = findManagedBlock(lines);
  if (!block) {
    return {
      path,
      managed: false,
      enabled: null,
      model: null,
      reasoning: null
    };
  }

  const blockLines = lines.slice(block.start, block.end + 1);
  const readString = (key) => {
    const line = blockLines.find((candidate) => new RegExp(`^\\s*${key}\\s*=`).test(candidate));
    if (!line) return null;
    const value = line.slice(line.indexOf('=') + 1).trim();
    try {
      return JSON.parse(value);
    } catch {
      return value.replace(/^['"]|['"]$/g, '');
    }
  };

  const enabledLine = blockLines.find((candidate) => /^\s*enabled\s*=/.test(candidate));
  const section = findAgentsSection(lines);
  const existingEnabled = findDirectKey(lines, section, 'enabled');

  return {
    path,
    managed: true,
    enabled: enabledLine ? parseBooleanLine(enabledLine) : existingEnabled ? parseBooleanLine(existingEnabled.line) : null,
    model: readString('default_subagent_model'),
    reasoning: readString('default_subagent_reasoning_effort')
  };
}

function serialize(lines, newline) {
  if (!lines.length) return '';
  return `${lines.join(newline).trimEnd()}${newline}`;
}

function normalizeBlankLines(lines) {
  const out = [];
  for (const line of lines) {
    if (line === '' && out[out.length - 1] === '') continue;
    out.push(line);
  }
  return out;
}

function writeConfig(path, text, dryRun) {
  if (dryRun) return;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, 'utf8');
}

export function applyCodexSubagentConfig(
  path,
  {
    model = DEFAULT_SUBAGENT_MODEL,
    reasoning = DEFAULT_SUBAGENT_REASONING,
    dryRun = false
  } = {}
) {
  const original = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const newline = detectNewline(original);
  let lines = original ? original.replace(/\r\n/g, '\n').split('\n') : [];
  if (lines.length && lines[lines.length - 1] === '') lines.pop();

  const existingBlock = findManagedBlock(lines);
  if (existingBlock) {
    const section = findAgentsSection(lines);
    if (!section || existingBlock.start <= section.start || existingBlock.end >= section.end) {
      throw new Error('ForgeGuard subagent config block must be inside the top-level [agents] section');
    }

    const enabledOutsideBlock = lines
      .map((line, index) => ({ line, index }))
      .find(({ line, index }) =>
        index > section.start &&
        index < section.end &&
        (index < existingBlock.start || index > existingBlock.end) &&
        /^\s*enabled\s*=/.test(line)
      );

    const includeEnabled = !enabledOutsideBlock;
    if (enabledOutsideBlock && parseBooleanLine(enabledOutsideBlock.line) !== true) {
      throw new Error('existing [agents].enabled setting conflicts with ForgeGuard subagents; set it to true or remove it');
    }

    lines.splice(
      existingBlock.start,
      existingBlock.end - existingBlock.start + 1,
      ...renderManagedBlock({ model, reasoning, includeEnabled })
    );
  } else {
    const section = findAgentsSection(lines);

    for (const key of ['default_subagent_model', 'default_subagent_reasoning_effort']) {
      if (findDirectKey(lines, section, key) || hasRootDottedAgentKey(lines, key)) {
        throw new Error(
          `existing Codex agents.${key} is unmanaged; ForgeGuard will not overwrite it automatically`
        );
      }
    }

    const existingEnabled = findDirectKey(lines, section, 'enabled');
    if (existingEnabled && parseBooleanLine(existingEnabled.line) !== true) {
      throw new Error('existing [agents].enabled setting conflicts with ForgeGuard subagents; set it to true or remove it');
    }
    if (!section && hasRootDottedAgentKey(lines, 'enabled')) {
      throw new Error('existing Codex agents.enabled is unmanaged; ForgeGuard will not overwrite it automatically');
    }

    const block = renderManagedBlock({ model, reasoning, includeEnabled: !existingEnabled });

    if (section) {
      lines.splice(section.start + 1, 0, ...block, '');
    } else {
      const firstSubtable = findFirstAgentsSubtable(lines);
      const newSection = [MANAGED_SECTION, '[agents]', ...block, ''];

      if (firstSubtable >= 0) {
        lines.splice(firstSubtable, 0, ...newSection);
      } else {
        if (lines.length && lines[lines.length - 1] !== '') lines.push('');
        lines.push(...newSection);
      }
    }
  }

  lines = normalizeBlankLines(lines);
  const next = serialize(lines, newline);
  writeConfig(path, next, dryRun);
  return parseManagedStatus(lines, path);
}

export function removeCodexSubagentConfig(path, { dryRun = false } = {}) {
  if (!existsSync(path)) return false;

  const original = readFileSync(path, 'utf8');
  const newline = detectNewline(original);
  let lines = original.replace(/\r\n/g, '\n').split('\n');
  if (lines.length && lines[lines.length - 1] === '') lines.pop();

  const block = findManagedBlock(lines);
  if (!block) return false;

  lines.splice(block.start, block.end - block.start + 1);

  let section = findAgentsSection(lines);
  const managedSectionIndex = lines.findIndex((line) => line.trim() === MANAGED_SECTION);
  if (managedSectionIndex >= 0) {
    lines.splice(managedSectionIndex, 1);
    section = findAgentsSection(lines);

    if (section) {
      const meaningful = lines
        .slice(section.start + 1, section.end)
        .filter((line) => line.trim() && !line.trim().startsWith('#'));

      if (meaningful.length === 0) {
        lines.splice(section.start, section.end - section.start);
      }
    }
  }

  lines = normalizeBlankLines(lines);
  const next = lines.length ? `${lines.join(newline).trimEnd()}${newline}` : '';

  if (!dryRun) {
    if (!next.trim()) rmSync(path, { force: true });
    else writeFileSync(path, next, 'utf8');
  }

  return true;
}

export function getCodexSubagentConfigStatus(path) {
  if (!existsSync(path)) {
    return {
      path,
      managed: false,
      enabled: null,
      model: null,
      reasoning: null
    };
  }

  const text = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  return parseManagedStatus(lines, path);
}
