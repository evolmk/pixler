import type { ComponentType } from 'react';

export type PaletteGroup =
  | 'recent'
  | 'actions'
  | 'settings'
  | 'workspaces'
  | 'tickets'
  | 'files';

export interface PaletteAction {
  id: string;
  title: string;
  group: PaletteGroup;
  keywords?: string[];
  icon?: ComponentType<{ className?: string }>;
  shortcut?: string;
  perform: () => void;
  when?: () => boolean;
}

const registry = new Map<string, PaletteAction>();

export function registerAction(action: PaletteAction): void {
  registry.set(action.id, action);
}

export function unregisterAction(id: string): void {
  registry.delete(id);
}

export function getActions(): PaletteAction[] {
  return Array.from(registry.values()).filter((a) => !a.when || a.when());
}

export function getActionsByGroup(group: PaletteGroup): PaletteAction[] {
  return getActions().filter((a) => a.group === group);
}

export function getAction(id: string): PaletteAction | undefined {
  return registry.get(id);
}
