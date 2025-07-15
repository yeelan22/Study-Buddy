
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export function CalendarBox({ sessions = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dates with sessions
  const sessionDates = sessions.map(s => new Date(s.dueDate).toDateString());

  const tileContent = ({ date, view }) => {
    if (view === 'month' && sessionDates.includes(date.toDateString())) {
      return <div className="dot" />;
    }
    return null;
  };

  const dailySessions = sessions.filter(s =>
    new Date(s.dueDate).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="flex flex-col items-center gap-4 lg:h-[350px] h-full">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
      />
      <div className="w-full bg-white dark:bg-[#181818] p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">
          Revisions on {selectedDate.toDateString()}
        </h3>
        {dailySessions.length === 0 ? (
          <p className="text-sm text-gray-500">No sessions scheduled</p>
        ) : (
          <ul className="space-y-2">
            {dailySessions.map((s, i) => (
              <li key={i} className="p-2 rounded bg-violet-100 dark:bg-violet-900/30">
                <span className="font-medium">{s.title}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({s.interval}-day interval)
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
