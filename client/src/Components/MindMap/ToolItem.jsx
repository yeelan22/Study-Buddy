import React from "react";
import { Tooltip } from "../shared";

export function ToolItem({ icon: Icon, label, tooltip, onClick, active }) {
  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition group w-full
          ${active ? "bg-blue-600 text-white" : ""}
          hover:bg-blue-600 hover:text-white
        `}
      >
        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-blue-600 group-hover:text-white"}`} />
        <span className={`text-base ${active ? "text-white" : "text-zinc-800 dark:text-white"} group-hover:text-white`}>
          {label}
        </span>
      </button>
    </Tooltip>
  );
}