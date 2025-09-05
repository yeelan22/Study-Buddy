import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../utils/axiosInstance';

export const useNoteStore = create(persist(
  (set, get) => ({
    notes: {}, // grouped by category
    selectedNoteId: null, // for URL-based note selection

    setNotes: (notesObj) => {
      set({ notes: notesObj });
    },

    setSelectedNoteId: (noteId) => {
      set({ selectedNoteId: noteId });
    },

    getNoteById: (noteId) => {
      const notes = get().notes;
      
      for (const category in notes) {
        const categoryNotes = notes[category];
        
        if (Array.isArray(categoryNotes)) {
          const note = categoryNotes.find(n => n._id === noteId);
          if (note) return note;
        }
      }
      return null;
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
        console.log('📥 Raw notes from server:', res.data);
        
        // Check if data is already grouped by category or is an array
        if (Array.isArray(res.data)) {
          // If it's an array, group by category
          const groupedNotes = res.data.reduce((acc, note) => {
            const category = note.category || "Uncategorized";
            if (!acc[category]) acc[category] = [];
            acc[category].push(note);
            return acc;
          }, {});
          console.log('📚 Grouped notes:', groupedNotes);
          get().setNotes(groupedNotes);
        } else {
          // If it's already grouped, use as is
          get().setNotes(res.data);
        }
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