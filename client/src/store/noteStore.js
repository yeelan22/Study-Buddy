import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNoteStore = create(persist(
  (set) => ({
    notes: [],
    setNotes: (notes) => set({ notes }),
    addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
    clearNotes: () => set({ notes: [] }),
  }),
  {
    name: 'user-notes-storage',
  }
));