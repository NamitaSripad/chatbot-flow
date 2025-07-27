import { Handle, Position } from 'reactflow';

export default function TextNode({ data }: any) {
  return (
    <div className="text-node">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
