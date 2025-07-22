import React from "react";
import { Sparkle, BrainCog, Palette, Volume2, PencilRuler } from "lucide-react";
import { ToolItem } from "../MindMap";
import { useUIStore } from "../../store/uiStore";

export function ToolCard({ onClose, showSummary, setShowSummary }) {
  const summary = useUIStore((s) => s.selectedNoteSummary);

  const tools = [
    {
      name: "Show Summary",
      icon: Sparkle,
      tooltip: "Show a quick summary",
      onClick: () => setShowSummary(!showSummary),
    },
    {
      name: "Ask AI",
      icon: BrainCog,
      tooltip: "Ask AI about this mind map",
      onClick: () => alert("Ask AI clicked"),
    },
    {
      name: "Visual Settings",
      icon: Palette,
      tooltip: "Change visual style",
      onClick: () => alert("Update visuals clicked"),
    },
    {
      name: "Audio Story",
      icon: Volume2,
      tooltip: "Listen to an audio explanation",
      onClick: () => alert("Audio explain clicked"),
    },
    {
      name: "Hand Draw",
      icon: PencilRuler,
      tooltip: "Draw on the mind map",
      onClick: () => alert("Draw mode clicked"),
    },
  ];

  return (
    <div className="p-5 relative z-50 ">
      <h2 className="heading-2 mb-4 flex items-center gap-2 ">
        <Sparkle className="w-5 h-5" /> Tools
      </h2>
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <ToolItem
            key={tool.name}
            icon={tool.icon}
            label={tool.name}
            tooltip={tool.tooltip}
            onClick={tool.onClick}
            active={tool.name === "Show Summary" && showSummary}
          />
        ))}
      </div>
    </div>
  );
}