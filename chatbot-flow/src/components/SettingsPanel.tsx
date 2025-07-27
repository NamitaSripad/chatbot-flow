import type { Node } from 'reactflow';
import { useState, useEffect } from 'react';

function SettingsPanel({
  node,
  setNodes,
}: {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}) {
  const [text, setText] = useState(node.data.label || '');

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === node.id ? { ...n, data: { ...n.data, label: text } } : n
      )
    );
  }, [text]);

  return (
    <div>
      <h3>Settings</h3>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
      />
    </div>
  );
}

export default SettingsPanel;
