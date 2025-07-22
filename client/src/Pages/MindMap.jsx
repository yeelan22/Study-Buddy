import React from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MindMapSidebar } from '../Components/MindMap';
import { useUIStore } from '../store/uiStore';

function MindMapCore() {
  const mindMap = useUIStore((s) => s.mindMapData);
  const summary = useUIStore((s) => s.selectedNoteSummary);

  const nodes = (mindMap?.nodes || []).map((n) => ({
    id: n.id,
    data: { label: n.label },
    position: { x: n.x, y: n.y },
    style: {
      background: '#e0f7fa',
      padding: 10,
      borderRadius: 10,
      border: '1px solid #00acc1',
    },
  }));

  const edges = (mindMap?.edges || []).map((e) => ({
    ...e,
    animated: true,
    style: { stroke: '#00acc1' },
  }));

  return (
    <div className="w-full flex relative">
      <div className="flex-grow h-[85vh]">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
        <MindMapSidebar />
    </div>
  );
}

export function MindMap() {
  return (
    <ReactFlowProvider>
      <MindMapCore />
    </ReactFlowProvider>
  );
}
