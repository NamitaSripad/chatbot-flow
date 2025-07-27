import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';

import type {
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
} from 'reactflow';

import 'reactflow/dist/style.css';

let id = 0;
const getId = () => `node_${id++}`;

export default function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const exists = edges.find((e) => e.source === params.source);
      if (exists) {
        alert('Only one outgoing edge allowed.');
        return;
      }
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)
      );
    },
    [edges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') || 'default';
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: 'Text Node' },
        style: {
          background: '#60a5fa',
          color: '#fff',
          borderRadius: 8,
          padding: 10,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;

    // Update both state and selectedNode to reflect change immediately
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode?.id ? { ...n, data: { ...n.data, label: newLabel } } : n
      )
    );

    setSelectedNode((prev) =>
      prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null
    );
  };

  const handleSave = () => {
    const noOutgoing = nodes.filter((n) => !edges.some((e) => e.source === n.id));
    if (nodes.length > 1 && noOutgoing.length > 1) {
      alert('⚠️ More than one node has no outgoing edge.');
      return;
    }
    alert('✅ Flow saved successfully!');
    console.log({ nodes, edges });
  };

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <div
          style={{
            width: 220,
            padding: 10,
            borderRight: '1px solid #ddd',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'default')}
            style={{
              padding: '10px',
              backgroundColor: '#dbeafe',
              border: '1px solid #93c5fd',
              borderRadius: 4,
              cursor: 'grab',
              textAlign: 'center',
            }}
          >
            ➕ Text Node
          </div>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 12px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            💾 Save Flow
          </button>
        </div>

        {/* Flow Area */}
        <div
          ref={reactFlowWrapper}
          style={{ flexGrow: 1, position: 'relative' }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          {selectedNode && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#fff',
                border: '1px solid #ccc',
                padding: 10,
                borderRadius: 4,
                zIndex: 1000,
              }}
            >
              <label>
                Text:{' '}
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={handleTextChange}
                />
              </label>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onNodeClick={onNodeClick}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
