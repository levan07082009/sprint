import { create } from 'zustand';

interface AppState {
  activeGigId: string | null;
  setActiveGigId: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  activeGigId: null,
  setActiveGigId: (id) => set({ activeGigId: id }),
}));
