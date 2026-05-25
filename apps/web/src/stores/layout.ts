import { create } from 'zustand';

/**
 * Pane sizes are stored in the **split-native** shape so they map 1:1 onto the two
 * nested `<ResizableSplit>`s with no recombination math:
 *   outer = [sidebar, center+right]   (percentages of the viewport, sum 100)
 *   inner = [center, right]           (percentages of the right group, sum 100)
 */
export interface PaneLayout {
  outer: [number, number];
  inner: [number, number];
}

/** Hard fallback so a fresh boot has a sane layout even before settings load. */
export const DEFAULT_PANE_LAYOUT: PaneLayout = { outer: [22, 78], inner: [62, 38] };

/** Which single pane is expanded full-bleed (`null` = normal 3-pane). */
export type FullBleedPane = 'sidebar' | 'center' | 'right' | null;

interface LayoutState {
  panes: PaneLayout;
  fullBleed: FullBleedPane;
  bigTerminal: boolean;
  settingsOpen: boolean;
  settingsTab: string;
  projectSettingsOpen: boolean;
  newWorkspaceOpen: boolean;
  setOuter: (outer: [number, number]) => void;
  setInner: (inner: [number, number]) => void;
  hydrate: (panes: Partial<PaneLayout>) => void;
  setFullBleed: (pane: FullBleedPane) => void;
  toggleBigTerminal: () => void;
  setSettingsOpen: (open: boolean, tab?: string) => void;
  setProjectSettingsOpen: (open: boolean) => void;
  setNewWorkspaceOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  panes: DEFAULT_PANE_LAYOUT,
  fullBleed: null,
  bigTerminal: false,
  settingsOpen: false,
  settingsTab: 'appearance',
  projectSettingsOpen: false,
  newWorkspaceOpen: false,
  setOuter: (outer) => set((s) => ({ panes: { ...s.panes, outer } })),
  setInner: (inner) => set((s) => ({ panes: { ...s.panes, inner } })),
  hydrate: (panes) => set((s) => ({ panes: { ...s.panes, ...panes } })),
  setFullBleed: (fullBleed) => set({ fullBleed }),
  toggleBigTerminal: () => set((s) => ({ bigTerminal: !s.bigTerminal })),
  setSettingsOpen: (settingsOpen, tab) =>
    set((s) => ({ settingsOpen, settingsTab: tab ?? s.settingsTab })),
  setProjectSettingsOpen: (projectSettingsOpen) => set({ projectSettingsOpen }),
  setNewWorkspaceOpen: (newWorkspaceOpen) => set({ newWorkspaceOpen }),
}));
