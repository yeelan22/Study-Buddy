import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../utils/axiosInstance';

export const useNoteStore = create(persist(
  (set, get) => ({
    notes: {}, // grouped by category

    setNotes: (notesObj) => {
      set({ notes: notesObj });
    },

    addNote: (note) => {
      const current = get().notes;
      const cat = note.category || "Uncategorized";
      const updated = { ...current };
      if (!updated[cat]) updated[cat] = [];
      updated[cat] = [note, ...(updated[cat] || [])];
      set({ notes: updated });
    },

    clearNotes: () => set({ notes: {} }),

    fetchNotes: async () => {
      try {
        const res = await axiosInstance.get('/notes');
        get().setNotes(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch notes:", err);
      }
    },

    processNotes: async () => {
      try {
        await axiosInstance.post('/notes/process');
      } catch (err) {
        console.error("❌ Failed to process notes:", err);
      }
    },
  }),
  {
    name: 'user-notes-storage',
  }
));