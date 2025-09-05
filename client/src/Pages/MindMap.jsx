import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { MindMapFlow } from '../Components/MindMap';

export function MindMap() {
  return (
    <div className="w-full h-screen relative">
      <ReactFlowProvider>
        <MindMapFlow />
      </ReactFlowProvider>
    </div>
  );
}

