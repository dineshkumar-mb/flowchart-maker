import React, { useState, useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  MiniMap,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

import { memo } from 'react';

let id = 0;
const getId = () => `node_${id++}`;

const ShapeNode = memo(({ data, id }) => {
  const shapeStyle = getShapeStyle(data.shapeType);

  const handleLabelChange = (e) => {
    data.onLabelChange(id, e.target.value);
  };

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px', ...shapeStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />

      <button
        onClick={() => data.onDelete(id)}
        style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          background: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          zIndex: 1,
        }}
      >
        ×
      </button>

      <input
        type="text"
        value={data.label}
        onChange={handleLabelChange}
        style={{
          border: 'none',
          background: 'transparent',
          textAlign: 'center',
          width: '80%',
          fontWeight: 'bold',
          fontSize: '14px',
          outline: 'none',
          transform: data.shapeType === 'diamond' ? 'rotate(-45deg)' : 'none',
        }}
      />
    </div>
  );
});

function getShapeStyle(shapeType) {
  switch (shapeType) {
    case 'circle':
      return {
        borderRadius: '50%',
        border: '2px solid #333',
        background: '#d4edda',
      };
    case 'square':
      return {
        border: '2px solid #333',
        background: '#f8d7da',
      };
    case 'rectangle':
      return {
        border: '2px solid #333',
        background: '#cce5ff',
        width: '150px',
        height: '80px',
      };
    case 'diamond':
      return {
        border: '2px solid #333',
        background: '#fff3cd',
        transform: 'rotate(45deg)',
      };
    case 'hexagon':
      return {
        background: '#e0f7fa',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        border: '2px solid #333',
      };
    default:
      return {
        border: '2px solid #333',
        background: '#fff',
      };
  }
}

function FlowchartEditor() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodeTypes = useMemo(() => ({ shapeNode: ShapeNode }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#f6ab00', strokeWidth: 2 },
            markerEnd: {
              type: 'arrowclosed',
            },
          },
          eds
        )
      ),
    []
  );

  const addShapeNode = (shapeType) => {
    const newNode = {
      id: getId(),
      type: 'shapeNode',
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      data: {
        shapeType,
        label: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
        onDelete: handleDeleteNode,
        onLabelChange: handleLabelChange,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const handleLabelChange = (nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  };

  const handleClearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div style={{ width: '240px', padding: '10px', borderRight: '1px solid #eee' }}>
        <h3>Add Shape</h3>
        <button onClick={() => addShapeNode('circle')} style={{ marginBottom: '10px', width: '100%' }}>Add Circle</button>
        <button onClick={() => addShapeNode('square')} style={{ marginBottom: '10px', width: '100%' }}>Add Square</button>
        <button onClick={() => addShapeNode('rectangle')} style={{ marginBottom: '10px', width: '100%' }}>Add Rectangle</button>
        <button onClick={() => addShapeNode('diamond')} style={{ marginBottom: '10px', width: '100%' }}>Add Diamond</button>
        <button onClick={() => addShapeNode('hexagon')} style={{ marginBottom: '10px', width: '100%' }}>Add Hexagon</button>
        <hr />
        <button onClick={handleClearCanvas} style={{ marginTop: '10px', background: '#ed0e0e', padding: '5px', width: '100%' }}>Clear Canvas</button>
      </div>

      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ flexGrow: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="lines" gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowchartEditor;
