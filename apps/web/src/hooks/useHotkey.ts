import { useHotkeys } from 'react-hotkeys-hook';
import type { Options } from 'react-hotkeys-hook';
import { getKey } from '../lib/palette/keyboard';

/**
 * Registers a hotkey for an action ID using the keyboard registry.
 * The hotkey is disabled when an input/textarea is focused unless `global` is set.
 */
export function useHotkey(
  actionId: string,
  handler: (e: KeyboardEvent) => void,
  options: Partial<Options> = {},
): void {
  const key = getKey(actionId);
  useHotkeys(key ?? '__unbound__', handler, {
    enabled: !!key,
    preventDefault: true,
    enableOnFormTags: options.enableOnFormTags ?? false,
    ...options,
  });
}
