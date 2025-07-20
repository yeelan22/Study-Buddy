import React, { useEffect } from 'react';
import { MemoryZoneGrid } from '../Components/MemoryZone';
import { useNoteStore } from '../store/noteStore';

export const MemoryZone = () => {
  const noteStore = useNoteStore();

  useEffect(() => {
    (async () => {
      await noteStore.processNotes();
      await noteStore.fetchNotes();
    })();
  }, []);

  return (
    <div className="flex justify-center items-start py-4 w-full px-2 sm:px-4">
      <MemoryZoneGrid />
    </div>
  );
};