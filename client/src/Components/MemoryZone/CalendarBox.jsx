import React, { useState } from "react";
import clsx from "clsx";
import { ChevronRight, ChevronLeft } from "lucide-react";

const daysShort = ["S", "M", "T", "W", "T", "F", "S"];

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let matrix = [];
  let week = [];
  let day = 1 - firstDay;
  for (let i = 0; i < 6; i++) {
    week = [];
    for (let j = 0; j < 7; j++, day++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
    }
    matrix.push(week);
  }
  return matrix;
}

export function CalendarBox({ schedule = [] }) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState({ year: date.getFullYear(), month: date.getMonth() });

  // Map events by date string
  const eventMap = schedule.reduce((acc, s) => {
    const d = new Date(s.nextDue).toDateString();
    acc[d] = acc[d] || [];
    acc[d].push(s);
    return acc;
  }, {});

  const matrix = getMonthMatrix(view.year, view.month);

  function selectDay(day) {
    if (!day) return;
    const newDate = new Date(view.year, view.month, day);
    setDate(newDate);
    setView({ year: newDate.getFullYear(), month: newDate.getMonth() });
  }

  function prevMonth() {
    setView(v => {
      let m = v.month - 1, y = v.year;
      if (m < 0) { m = 11; y--; }
      return { year: y, month: m };
    });
  }
  function nextMonth() {
    setView(v => {
      let m = v.month + 1, y = v.year;
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  }

  // Today's date
  const today = new Date();
  const isToday = (d) =>
    d &&
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return (
    <div className=" card card-hover p-6 min-w-[320px] mx-auto transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="heading-2 rounded-md p-1 transition-colors cursor-pointer">
          <ChevronLeft />
        </button>
        <div className="text-center p-1 heading-2">
          <div className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100 tracking-wide">
            {new Date(view.year, view.month).toLocaleString('default', { month: 'long' })} {view.year}
          </div>
        </div>
        <button onClick={nextMonth} className="heading-2 p-1 transition-colors cursor-pointer">
          <ChevronRight />
        </button>
      </div>
      {/* Days of week */}

      <div className="grid grid-cols-7 mb-2">
        {daysShort.map((d, i) => (
          <div key={i} className="text-zinc-400 dark:text-indigo-200 font-bold text-center text-base tracking-wide">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {matrix.flat().map((day, i) => {
          const isSelected = day && date.getDate() === day && view.month === date.getMonth() && view.year === date.getFullYear();
          const dObj = day ? new Date(view.year, view.month, day) : null;
          const events = dObj ? eventMap[dObj.toDateString()] : null;
          const markToday = isToday(dObj) && !isSelected;
          return (
            <div
              key={i}
              className={clsx(
                "aspect-square flex flex-col items-center justify-center",
                day ? "cursor-pointer" : "",
              )}
              onClick={() => selectDay(day)}
            >
              <div
                className={clsx(
                  "w-10 h-10 flex items-center justify-center rounded-xl font-bold text-lg transition-all duration-200 shadow-sm border relative",
                  day
                    ? "calendarBox border-zinc-200 dark:border-zinc-700 subheading"
                    : "opacity-0 pointer-events-none",
                  isSelected && "bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-blue-500 shadow-lg scale-105 z-10",
                  day && !isSelected && "hover:bg-blue-50 dark:hover:bg-zinc-700 hover:border-blue-400",
                  markToday && "border-2 border-blue0"
                )}
                style={{
                  boxShadow: day ? "0 2px 8px 0 rgba(80,80,180,0.06)" : undefined,
                }}
              >
                {day}
                {/* Today dot */}
                {markToday && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue" />
                )}
              </div>
              {/* Event bar */}
              {events && (
                <div
                  className="w-6 h-1.5 rounded-full mt-1 transition-all duration-200"
                  style={{
                    background: events[0]?.color || "#3b82f6",
                    boxShadow: "0 1px 4px 0 rgba(59,130,246,0.15)"
                  }}
                />
              )}
            </div>
          );
        })}
      </div>


      {/* Events for selected day */}
      <div className="mt-4 ">
        <h3 className="subheading mb-2">
          Revisions on {date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </h3>
        <ul>
          {schedule.filter(s => new Date(s.nextDue).toDateString() === date.toDateString())
            .map(s => (
              <li
                key={s.noteId}
                className="flex items-center inner-card px-0 py-2 mb-2 transition-all relative"
                style={{ overflow: "hidden", minHeight: 44 }}
              >
                <span
                  className="absolute left-0 top-0 h-full w-1.5 rounded-l"
                  style={{
                    background: s.color || "#3b82f6",
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  }}
                />
                <span className="pl-5">{s.title}</span>
              </li>
            ))}
        </ul>
      </div>

    </div>
  );
}