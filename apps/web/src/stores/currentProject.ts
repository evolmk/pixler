import { create } from 'zustand';

interface CurrentProjectState {
  projectId: string | null;
  setProjectId: (id: string | null) => void;
}

const STORAGE_KEY = 'pixler.currentProjectId';

function loadFromStorage(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

function saveToStorage(id: string | null) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export const useCurrentProjectStore = create<CurrentProjectState>((set) => ({
  projectId: loadFromStorage(),
  setProjectId: (id) => {
    saveToStorage(id);
    set({ projectId: id });
  },
}));
