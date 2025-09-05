import React, { useState, useEffect } from 'react';
import {
  CalendarBox,
  FlashcardsBox,
  ToReviseListBox,
  StatsBox,
  QuoteBox,
} from '../MemoryZone';
import { useNoteStore } from '../../store/noteStore';
import axios from '../../utils/axiosInstance';

export const MemoryZoneGrid = () => {
  const { notes, selectedNoteId, getNoteById } = useNoteStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get('/notes/schedule');
      console.log('Schedule fetched:', res.data);
      setSchedule(res.data); // array of { noteId, title, nextDue }
    })();
  }, []);

  // Handle note selection from URL parameter
  useEffect(() => {
    if (selectedNoteId) {
      const note = getNoteById(selectedNoteId);
      if (note) {
        setSelectedNote(note);
        setSelectedCategory(note.category);
      }
    }
  }, [selectedNoteId, getNoteById]);
  
  // handler from FlashcardsBox to update schedule
  const handleSessionComplete = async (sessionData) => {
    const res = await axios.post(`/notes/session/${sessionData.noteId}`, sessionData);
    console.log('Session completed:', res.data);
    const updated = { noteId: sessionData.noteId, title: sessionData.title, nextDue: res.data.nextDue };

    setSchedule(prev => {
      const filtered = prev.filter(s => s.noteId !== updated.noteId);
      return [...filtered, updated];
    });
  };

  const filteredSchedule = schedule.filter(s => s.nextDue); // before rendering

  return (
    <div className="memoryzone-grid">
      <div className="area-torevise">
        <ToReviseListBox
          notes={notes}
          schedule={filteredSchedule}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedNote={setSelectedNote}
        />
      </div>

      <div className="area-flashcards">
        <FlashcardsBox
          cards={(selectedNote?.qa || []).map(card => ({
            ...card,
            noteId: selectedNote?._id,
          }))}
          onSessionComplete={({ noteId, rating, wrongCount, durationMs }) => 
            handleSessionComplete({ noteId, title: selectedNote.title, rating, wrongCount, durationMs })
          }
        />
      </div>

      <div className="area-calendar">
        <CalendarBox schedule={filteredSchedule} />
      </div>

      <div className="area-quote">
        <QuoteBox />
      </div>

      <div className="area-stats">
        <StatsBox schedule={filteredSchedule} />
      </div>
    </div>
  );
};
