import defaultPreset from './presets/default.json';
import vimPreset from './presets/vim.json';
import emacsPreset from './presets/emacs.json';

export type KeyPreset = 'default' | 'vim' | 'emacs';

const PRESETS: Record<KeyPreset, Record<string, string>> = {
  default: defaultPreset,
  vim: vimPreset,
  emacs: emacsPreset,
};

/** Maps actionId → resolved key string (empty string = unbound). */
const resolved = new Map<string, string>();

let _preset: KeyPreset = 'default';
let _overrides: Record<string, string> = {};

export function loadKeyboard(
  preset: KeyPreset,
  overrides: Record<string, string> = {},
): void {
  _preset = preset;
  _overrides = overrides;
  _rebuild();
}

function _rebuild(): void {
  resolved.clear();
  const base = PRESETS[_preset] ?? PRESETS.default;
  for (const [id, key] of Object.entries(base)) {
    if (key) resolved.set(id, key);
  }
  for (const [id, key] of Object.entries(_overrides)) {
    if (key) resolved.set(id, key);
    else resolved.delete(id);
  }
}

export function getKey(actionId: string): string | undefined {
  return resolved.get(actionId) || undefined;
}

export function getAllBindings(): Map<string, string> {
  return new Map(resolved);
}

export function findConflict(actionId: string, key: string): string | undefined {
  for (const [id, k] of resolved) {
    if (id !== actionId && k === key) return id;
  }
  return undefined;
}

export function setOverride(actionId: string, key: string): void {
  _overrides[actionId] = key;
  _rebuild();
}

export function getPreset(): KeyPreset {
  return _preset;
}

export function getOverrides(): Record<string, string> {
  return { ..._overrides };
}

/** Human-readable display string, e.g. "meta+k" → "⌘K". */
export function formatKey(key: string): string {
  return key
    .replace('meta+', '⌘')
    .replace('ctrl+', '⌃')
    .replace('shift+', '⇧')
    .replace('alt+', '⌥')
    .replace('mod+', '⌘')
    .split('+')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
