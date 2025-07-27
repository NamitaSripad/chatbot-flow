import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';

const TextNode = ({ data }: NodeProps) => {
  return (
    <div style={{ padding: 10, backgroundColor: '#fff', border: '1px solid #999', borderRadius: 5 }}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label || 'Text Message'}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TextNode;
