import React from 'react';
import { createPortal } from 'react-dom';
import { ReactFlowProvider } from 'reactflow';
import { MindMapFlow } from '../Components/MindMap';
import { Loader } from '../Components/shared';
import { useUIStore } from '../store/uiStore';

export function MindMap() {
  const isGeneratingMindMap = useUIStore((s) => s.isGeneratingMindMap);

  return (
    <div className="w-full h-screen relative">
      <ReactFlowProvider>
        <MindMapFlow />
      </ReactFlowProvider>

      {/* Full Screen Loading Overlay - Rendered to document.body */}
      {isGeneratingMindMap && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm" style={{ top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}>
          <Loader text="Generating mind map..." size="lg" />
        </div>,
        document.body
      )}
    </div>
  );
}

