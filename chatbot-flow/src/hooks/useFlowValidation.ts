import type { Node, Edge } from 'reactflow';

export function validateFlow(nodes: Node[], edges: Edge[]) {
  const sources = edges.map((e) => e.source);
  const unconnected = nodes.filter((n) => !sources.includes(n.id));
  return unconnected.length <= 1;
}
