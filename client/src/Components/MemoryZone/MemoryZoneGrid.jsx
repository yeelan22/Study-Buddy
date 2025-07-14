import React from 'react';
import {
  CalendarBox,
  FlashcardsBox,
  ToReviseListBox,
  StatsBox,
  QuoteBox,
  ForgottenNotesBox,
  RevisingHistoryBox,
} from '../MemoryZone';

export const MemoryZoneGrid = () => (
  <div className="memoryzone-grid flex flex-col gap-4 w-full px-2 md:px-0 overflow-x-hidden">
    <div className="area-calendar">
      <CalendarBox />
    </div>
    <div className="area-flashcards">
      <FlashcardsBox />
    </div>
    <div className="area-torevise">
      <ToReviseListBox />
    </div>
    <div className="area-stats">
      <StatsBox />
    </div>
    <div className="area-quote">
      <QuoteBox />
    </div>
    <div className="area-forgotten">
      <ForgottenNotesBox />
    </div>
    <div className="area-revising">
      <RevisingHistoryBox />
    </div>
  </div>
);