import React, { useEffect } from 'react';
import { useNoteStore } from '../../store/noteStore';

export function NotesList({ onNoteClick }) {
  const { notes, fetchNotes } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <ul className="space-y-2">
      {Object.entries(notes).map(([category, notesInCat]) => (
        <div key={category}>
          <h4 className=" subheading mb-1 mt-3">{category}</h4>
          {Array.isArray(notesInCat) && notesInCat.map((note) => (
            <li 
              key={note._id}
              onClick={() => onNoteClick(note)}
              className="cursor-pointer mb-2 px-4 py-2  inner-card text-sm text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
            >
              {note.title || note.filename}
            </li>
          ))}
        </div>
      ))}
    </ul>
  );
}