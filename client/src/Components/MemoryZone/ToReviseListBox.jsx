import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const notesData = [
  {
    title: "Literature",
    subtopics: ["model verbs", "adverbs"],
  },
  {
    title: "World History",
    subtopics: ["Renaissance", "World Wars"],
  },
];

export function ToReviseListBox() {
  return (
    <div className="bg-[#18192A] text-white rounded-2xl shadow flex flex-col gap-6 p-6 lg:h-[520px] h-full w-full max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">All Notes</h3>
        <Timeline notes={notesData} />
      </div>
      {/* Recall Schedule (untouched) */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Recall Schedule</h3>
        <ul className="space-y-2">
          <li className="flex justify-between bg-[#23243a] rounded-lg px-4 py-2">
            <span>Biology</span>
            <span className="text-gray-400 text-sm">Tomorrow</span>
          </li>
          <li className="flex justify-between bg-[#23243a] rounded-lg px-4 py-2">
            <span>Physics</span>
            <span className="text-gray-400 text-sm">Aug 21</span>
          </li>
          <li className="flex justify-between bg-[#23243a] rounded-lg px-4 py-2">
            <span>Literature</span>
            <span className="text-gray-400 text-sm">Aug 23</span>
          </li>
        </ul>
      </div>
    </div>
  );
}


function Timeline({ notes }) {
  const [openIdx, setOpenIdx] = useState(null);

  // Build a flat list of items for rendering
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
      {/* Vertical line - perfectly centered */}
      <div
        className="absolute top-0 w-1 bg-blue-600 rounded-full"
        style={{
          left: "28px", // 50% of w-14 (56px) container below
          transform: "translateX(-50%)",
          height: `${items.length * 36 - 8}px`,
          zIndex: 0,
        }}
      />
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div key={i} className="flex items-center min-h-[36px]">
            {/* Circles and dots */}
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
                  onClick={() =>
                    setOpenIdx(openIdx === item.idx ? null : item.idx)
                  }
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -10 }}
                  transition={{ delay: 0.05 * item.subIdx }}
                  className="w-4 h-4 bg-blue-400 rounded-full"
                />
              )}
            </div>
            {/* Text */}
            <div
              className={
                item.type === "main"
                  ? `text-base font-medium cursor-pointer transition-colors duration-200 ${
                      openIdx === item.idx ? "text-blue-400" : "text-white"
                    }`
                  : "text-gray-300 text-sm ml-2"
              }
              style={{
                fontSize: item.type === "main" ? "1.08rem" : undefined,
              }}
              onClick={
                item.type === "main"
                  ? () =>
                      setOpenIdx(openIdx === item.idx ? null : item.idx)
                  : undefined
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