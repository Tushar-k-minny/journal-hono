import { create } from "zustand";
import type { Entry, EntryFilters } from "@/types/entry";

interface EntriesState {
  entries: Entry[];
  currentEntry: Entry | null;
  filters: EntryFilters;
  setEntries: (entries: Entry[]) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (id: string, entry: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  setCurrentEntry: (entry: Entry | null) => void;
  setFilters: (filters: Partial<EntryFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: EntryFilters = {
  sort: "desc",
  limit: 20,
};

export const useEntriesStore = create<EntriesState>()((set, get) => ({
  entries: [],
  currentEntry: null,
  filters: defaultFilters,
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set({ entries: [entry, ...get().entries] }),
  updateEntry: (id, updates) => {
    const state = get();
    set({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
      currentEntry:
        state.currentEntry?.id === id
          ? { ...state.currentEntry, ...updates }
          : state.currentEntry,
    });
  },
  deleteEntry: (id) =>
    set({
      entries: get().entries.filter((e) => e.id !== id),
      currentEntry: get().currentEntry?.id === id ? null : get().currentEntry,
    }),
  setCurrentEntry: (entry) => set({ currentEntry: entry }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
