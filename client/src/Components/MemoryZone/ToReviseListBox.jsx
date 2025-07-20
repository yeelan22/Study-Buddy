import React, { useState } from "react";
import { motion } from "framer-motion";

export function ToReviseListBox({
  notes,
  schedule = [],
  selectedCategory,
  setSelectedCategory,
  setSelectedNote,
}) {
  const [openIdx, setOpenIdx] = useState(null);
  const categories = Object.keys(notes || {});

  const handleMainClick = (idx) => {
    const cat = categories[idx];
    setSelectedCategory(cat);
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const handleSubClick = (mainIdx, subIdx) => {
    const cat = categories[mainIdx];
    const notesInCat = notes[cat];
    const selected = notesInCat[subIdx];
    setSelectedNote(selected);
  };

  const timelineData = categories.map((cat) => ({
    title: cat,
    subtopics: Array.isArray(notes[cat])
      ? notes[cat].map((note) => note.title || note.filename)
      : [],
  }));

  return (
    <div className="bg-white dark:bg-charcoal rounded-2xl shadow flex flex-col gap-6 p-6 h-full w-full max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">All Notes</h3>
        <Timeline
          notes={timelineData}
          openIdx={openIdx}
          handleMainClick={handleMainClick}
          handleSubClick={handleSubClick}
        />
      </div>

      {/* ✅ Updated Recall Schedule Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">📅 Recall Schedule</h3>
        <ul className="space-y-2">
          {schedule.length === 0 ? (
            <p className="text-sm text-gray-400">No scheduled sessions yet</p>
          ) : (
            schedule.map((s) => (
              <li
                key={s.noteId}
                className="flex justify-between items-center bg-[#23243a] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#2e2e4a]"
                onClick={() => {
                  const flatNotes = Object.values(notes).flat();
                  const matched = flatNotes.find((n) => n._id === s.noteId);
                  if (matched) setSelectedNote(matched);
                }}
              >
                <span>{s.title}</span>
                <span className="text-sm text-gray-400">
                  {new Date(s.nextDue).toLocaleDateString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function Timeline({ notes, openIdx, handleMainClick, handleSubClick }) {
  let items = [];
  notes.forEach((note, idx) => {
    items.push({ type: "main", note, idx });
    if (openIdx === idx) {
      note.subtopics.forEach((sub, subIdx) => {
        items.push({ type: "sub", sub, idx, subIdx });
      });
    }
  });

  return (
    <div className="relative flex flex-col">
      <div
        className="absolute top-0 w-1 bg-blue-600 rounded-full"
        style={{
          left: "28px",
          transform: "translateX(-50%)",
          height: `${items.length * 36 - 8}px`,
          zIndex: 0,
        }}
      />
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div key={i} className="flex items-center min-h-[36px]">
            <div className="w-14 flex justify-center items-center relative z-10">
              {item.type === "main" ? (
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    scale: openIdx === item.idx ? 1.2 : 1,
                    boxShadow:
                      openIdx === item.idx
                        ? "0 0 0 8px rgba(59,130,246,0.15)"
                        : "none",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-6 h-6 bg-blue-600 rounded-full border-2 border-blue-400 cursor-pointer"
                  onClick={() => handleMainClick(item.idx)}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -10 }}
                  transition={{ delay: 0.05 * item.subIdx }}
                  className="w-4 h-4 bg-blue-400 rounded-full cursor-pointer"
                />
              )}
            </div>
            <div
              className={
                item.type === "main"
                  ? `text-base font-medium cursor-pointer transition-colors duration-200 ${
                      openIdx === item.idx ? "text-blue-400" : "text-white"
                    }`
                  : "text-gray-300 text-sm ml-2 cursor-pointer hover:text-blue-300"
              }
              style={{
                fontSize: item.type === "main" ? "1.08rem" : undefined,
              }}
              onClick={
                item.type === "main"
                  ? () => handleMainClick(item.idx)
                  : () => handleSubClick(item.idx, item.subIdx)
              }
            >
              {item.type === "main" ? item.note.title : item.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
