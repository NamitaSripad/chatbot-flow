function NodesPanel() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div>
      <h3>Nodes Panel</h3>
      <div
        className="node-item"
        draggable
        onDragStart={(e) => onDragStart(e, 'text')}
      >
        📝 Text Node
      </div>
    </div>
  );
}

export default NodesPanel;
