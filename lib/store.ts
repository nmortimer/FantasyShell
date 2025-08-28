'use client';
import { create } from 'zustand';

export type Team = {
  id: string;
  name: string;
  manager: string;
  primary: string;
  secondary: string;
  stylePack: 'v1'|'v2'|'v3';
  status: 'draft'|'final';
  logoUrl: string;
  mascot?: string;
};

export type League = { id: string; name: string; season: number };

type Store = {
  league?: League;
  teams: Team[];
  week: number;
  selectedPosterIds: string[];
  setLeague: (l: League) => void;
  setTeams: (t: Team[]) => void;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  finalizeTeam: (id: string) => void;
  finalizeCount: () => number;
  setWeek: (w: number) => void;
  togglePoster: (id: string) => void;
  clearSelection: () => void;
};

export const useAppStore = create<Store>((set, get) => ({
  teams: [],
  week: 1,
  selectedPosterIds: [],
  setLeague: (l) => set({ league: l }),
  setTeams: (t) => set({ teams: t }),
  updateTeam: (id, patch) => set({ teams: get().teams.map(tm => tm.id === id ? { ...tm, ...patch } : tm) }),
  finalizeTeam: (id) => set({ teams: get().teams.map(tm => tm.id === id ? { ...tm, status: 'final' } : tm) }),
  finalizeCount: () => get().teams.filter(t => t.status === 'final').length,
  setWeek: (w) => set({ week: w }),
  togglePoster: (id) => {
    const s = new Set(get().selectedPosterIds);
    if (s.has(id)) s.delete(id); else s.add(id);
    set({ selectedPosterIds: Array.from(s) });
  },
  clearSelection: () => set({ selectedPosterIds: [] })
}));
