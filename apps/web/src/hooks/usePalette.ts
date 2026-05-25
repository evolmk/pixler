import { useCallback } from 'react';
import { usePaletteStore } from '../stores/palette';
import { getAction, getActions, type PaletteAction } from '../lib/palette/registry';

export function usePalette(): {
  open: boolean;
  setOpen: (open: boolean) => void;
  recent: string[];
  runAction: (id: string) => void;
  getActions: () => PaletteAction[];
} {
  const { open, setOpen, recent, pushRecent } = usePaletteStore();

  const runAction = useCallback(
    (id: string) => {
      const action = getAction(id);
      if (!action) return;
      pushRecent(id);
      setOpen(false);
      action.perform();
    },
    [pushRecent, setOpen],
  );

  return { open, setOpen, recent, runAction, getActions };
}
