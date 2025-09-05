import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useUIStore } from '../../store/uiStore';
import { MindMapSidebar } from './MindMapSidebar';

const NODE_COLORS = {
  title: { bg: '#1976d2', text: '#fff' },
  subtitle: { bg: '#00bfae', text: '#fff' },
  0: { bg: '#ffe082', text: '#795548' },
  1: { bg: '#b3e5fc', text: '#01579b' },
  2: { bg: '#c8e6c9', text: '#2e7d32' },
  3: { bg: '#f8bbd0', text: '#ad1457' },
  4: { bg: '#d1c4e9', text: '#4527a0' },
  5: { bg: '#fff9c4', text: '#fbc02d' },
  6: { bg: '#e0e0e0', text: '#424242' },
  7: { bg: '#ffccbc', text: '#bf360c' },
};

const COLOR_PALETTE = [
  '#1976d2', '#00bfae', '#ffb300', '#f06292',
  '#7e57c2', '#26a69a', '#ff7043', '#bdbdbd'
];

function EditableNode({ id, data, selected, onContextMenu }) {
  const color = data.bg
    ? { bg: data.bg, text: data.text || '#222' }
    : NODE_COLORS[data.type] || NODE_COLORS[data.level] || NODE_COLORS[0];

  return (
    <div
      onDoubleClick={data.onDoubleClick}
      onContextMenu={onContextMenu}
      style={{
        background: color.bg,
        color: color.text,
        borderRadius: 16,
        padding: '10px 18px',
        minWidth: 120,
        fontWeight: data.type === 'title' ? 700 : 500,
        fontSize: data.type === 'title' ? 18 : data.type === 'subtitle' ? 15 : 14,
        border: selected ? '2px solid #1976d2' : '1.5px solid #e0e0e0',
        cursor: 'pointer',
        boxShadow: selected ? '0 0 0 3px #1976d2' : '0 2px 8px #0001',
        userSelect: 'none',
      }}
    >
      <Handle type="target" position="top" id="a" style={{ background: '#1976d2', width: 10, height: 10, borderRadius: 8 }} />
      <Handle type="source" position="bottom" id="a" style={{ background: '#1976d2', width: 10, height: 10, borderRadius: 8 }} />
      <span>{data.label}</span>
    </div>
  );
}

export function MindMapFlow() {
  const mindMap = useUIStore((s) => s.mindMapData);
  const updateNode = useUIStore((s) => s.updateNode);
  const deleteNode = useUIStore((s) => s.deleteNode);
  const updateNodePosition = useUIStore((s) => s.updateNodePosition);
  const setMindMapData = useUIStore((s) => s.setMindMapData);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [contextMenu, setContextMenu] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [editValue, setEditValue] = useState('');

  // sync Zustand store -> ReactFlow nodes/edges
  useEffect(() => {
    if (!mindMap) return;

    setNodes(
      (mindMap.nodes || []).map((n) => ({
        id: n.id,
        type: 'editable',
        data: {
          ...n,
          label: n.label,
          level: n.level,
          type: n.level === 0 ? 'title' : n.level === 1 ? 'subtitle' : undefined,
          onDoubleClick: (e) => {
            e.stopPropagation();
            setEditingNode(n.id);
            setEditValue(n.label);
            setContextMenu(null);
          },
        },
        position: { x: n.x, y: n.y },
      }))
    );

    setEdges(
      (mindMap.edges || []).map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        style: { stroke: '#1976d2', strokeWidth: 2 },
        labelStyle: { fill: '#1976d2', fontWeight: 500, fontSize: 13 },
      }))
    );
  }, [mindMap, setNodes, setEdges]);

  const onNodeContextMenu = useCallback((e, node) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ nodeId: node.id, x: e.clientX, y: e.clientY });
  }, []);

  const onPaneClick = useCallback(() => setContextMenu(null), []);

  // smooth drag: update store only after drag stops
  const onNodeDragStop = useCallback((_, node) => {
    updateNodePosition(node.id, node.position);
  }, [updateNodePosition]);

  const handleEdit = () => {
    setEditingNode(contextMenu.nodeId);
    const node = mindMap.nodes.find(n => n.id === contextMenu.nodeId);
    setEditValue(node.label);
    setContextMenu(null);
  };

  const handleDelete = () => {
    deleteNode(contextMenu.nodeId);
    setContextMenu(null);
  };

  const handleColorChange = (bg) => {
    updateNode(contextMenu.nodeId, { bg, text: '#fff' });
    setContextMenu(null);
  };

  const handleEditSave = () => {
    if (editingNode) {
      updateNode(editingNode, { label: editValue });
      setEditingNode(null);
      setEditValue('');
    }
  };

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{
          editable: (props) => (
            <EditableNode {...props} onContextMenu={(e) => onNodeContextMenu(e, props)} />
          ),
        }}
        fitView
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        minZoom={0.3}
        maxZoom={2}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        style={{ background: 'transparent' }}
      >
        <MiniMap nodeColor={(n) => n.data?.bg || '#1976d2'} nodeStrokeColor={(n) => n.selected ? '#1976d2' : '#fff'} nodeBorderRadius={8} />
        <Controls showInteractive={false} />
        <Background variant="dots" color="#b3e5fc" gap={18} size={1.5} />
      </ReactFlow>

      {/* Inline edit */}
      {editingNode && (
        <div
          style={{
            position: 'fixed',
            top: (contextMenu?.y || 100) + 30,
            left: (contextMenu?.x || 100),
            zIndex: 10001,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 24px #0002',
            padding: 16,
            minWidth: 200,
          }}
        >
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
            style={{
              width: '100%',
              border: '1px solid #ccc',
              outline: 'none',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 8,
              padding: 8,
              fontSize: 15,
            }}
          />
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 10000,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 24px #0002',
            padding: 16,
            minWidth: 160,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <button onClick={handleEdit}>✏️ Edit</button>
          <div style={{ fontSize: 13, marginBottom: 6, color: '#888' }}>Change color:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            {COLOR_PALETTE.map((c) => (
              <div key={c} onClick={() => handleColorChange(c)} style={{
                width: 26, height: 26, borderRadius: '50%',
                background: c, border: '2px solid #fff',
                boxShadow: '0 1px 4px #0002',
                cursor: 'pointer',
              }} />
            ))}
          </div>
          <button onClick={handleDelete} style={{ color: '#d32f2f' }}>🗑️ Delete</button>
        </div>
      )}

      <MindMapSidebar />
    </>
  );
}
