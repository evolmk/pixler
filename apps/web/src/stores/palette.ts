import { create } from 'zustand';

const MAX_RECENT = 10;

interface PaletteState {
  open: boolean;
  recent: string[];
  setOpen: (open: boolean) => void;
  pushRecent: (id: string) => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  open: false,
  recent: [],
  setOpen: (open) => set({ open }),
  pushRecent: (id) =>
    set((s) => ({
      recent: [id, ...s.recent.filter((r) => r !== id)].slice(0, MAX_RECENT),
    })),
}));
