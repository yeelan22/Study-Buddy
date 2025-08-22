import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useUIStore } from '../store/uiStore';
import { DrawingCanvas, MindMapFlow } from '../Components/MindMap';

export function MindMap() {
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);

  return (
    <div className="w-full h-screen relative">
      <button
        className="absolute z-50 top-5 left-5 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        onClick={() => setViewMode(viewMode === 'mindmap' ? 'draw' : 'mindmap')}
      >
        Switch to {viewMode === 'mindmap' ? 'Draw' : 'Mind Map'} Mode
      </button>

      {viewMode === 'mindmap' ? (
        <ReactFlowProvider>
          <MindMapFlow />
        </ReactFlowProvider>
      ) : (
        <DrawingCanvas />
      )}
    </div>
  );
}
