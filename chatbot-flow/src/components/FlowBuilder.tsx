// Type-only imports
import type { Node, Edge, Connection } from 'reactflow';

// Runtime values
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import React, { useCallback } from 'react';
import TextNode from '../nodes/TextNode';



const nodeTypes = { text: TextNode };

type FlowBuilderProps = {
  setSelectedNode: (node: Node | null) => void;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

export default function FlowBuilder({
  setSelectedNode,
  nodes,
  setNodes,
  edges,
  setEdges,
}: FlowBuilderProps) {
  const [nodeList, setNodeList, onNodesChange] = useNodesState(nodes);
  const [edgeList, setEdgeList, onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const sourceExists = edgeList.some((e) => e.source === params.source);
      if (sourceExists) {
        alert('Only one outgoing connection allowed!');
        return;
      }
      setEdgeList((eds) => addEdge(params, eds));
    },
    [edgeList]
  );

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const newNode: Node = {
      id: `${+new Date()}`,
      type,
      position: { x: event.clientX - 250, y: event.clientY - 50 },
      data: { label: 'Text Message' },
    };
    setNodeList((nds) => nds.concat(newNode));
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }} onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
        <ReactFlow
          nodes={nodeList}
          edges={edgeList}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNode(node)}
          fitView
        />
      </div>
    </ReactFlowProvider>
  );
}
