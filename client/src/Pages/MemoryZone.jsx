import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MemoryZoneGrid } from '../Components/MemoryZone';
import { useNoteStore } from '../store/noteStore';

export const MemoryZone = () => {
  const noteStore = useNoteStore();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('noteId');

  useEffect(() => {
    (async () => {
      await noteStore.processNotes();
      await noteStore.fetchNotes();
      
      // After fetching notes, set the selected note if noteId exists
      if (noteId) {
        noteStore.setSelectedNoteId(noteId);
      }
    })();
  }, [noteId]);

  return (
    <div className="flex justify-center items-start py-4 w-full px-2 sm:px-4">
      <MemoryZoneGrid />
    </div>
  );
};