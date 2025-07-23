// src/Components/MindMap/NotesCard.jsx
import React from 'react';
import { NotesList } from '../MindMap';
import { StickyNote } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import axiosInstance from '../../utils/axiosInstance';

export function NotesCard({ onClose }) {
  const setSummary = useUIStore((s) => s.setSelectedNoteSummary);
  const setMindMapData = useUIStore((s) => s.setMindMapData);

  async function handleNoteClick(note) {
  try {
    const res = await axiosInstance.post(`/mindmap/${note._id}`);
    console.log("📜 Note data:", res.data);

    const { summary, title, nodes, edges } = res.data;

    // Update UI stores
    setSummary(`<b># Main Subject:</b><br/><br/>- <b>${title}</b><br/><br/>${summary}`);
    setMindMapData({
      nodes: nodes || [],
      edges: edges || [],
    });

    useUIStore.getState().setSelectedNoteId(note._id);


    console.log("🧠 Mind map data:", { nodes, edges });
  } catch (err) {
    console.error("❌ Failed to load mind map:", err);
  }

  onClose(); // close sidebar
  }


  return (
    <div className="p-5">
      <h2 className="mb-4 flex items-center gap-2 heading-2">
        <StickyNote className="w-5 h-5" /> Your Notes
      </h2>
      <NotesList onNoteClick={handleNoteClick} />
    </div>
  );
}
