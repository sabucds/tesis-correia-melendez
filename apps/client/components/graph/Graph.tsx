import React from 'react';
import { GraphView } from 'react-digraph';

export default function Graph() {
  const GraphConfig = {
    NodeTypes: {
      factory: {
        typeText: 'Fabrica',
        shapeId: '#factory',
        shape: (
          <symbol
            viewBox="0 0 120 120"
            height="120"
            width="120"
            id="factory"
            key="0"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              style={{ fill: '#fdf9c4', border: 'none' }}
            />
          </symbol>
        ),
      },
      location: {
        typeText: 'Localización',
        shapeId: '#location',
        shape: (
          <symbol
            viewBox="0 0 120 120"
            height="120"
            width="120"
            id="location"
            key="0"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              style={{ fill: '#ffe4e1', border: 'none' }}
            />
          </symbol>
        ),
      },
      client: {
        typeText: 'Cliente',
        shapeId: '#client',
        shape: (
          <symbol
            viewBox="0 0 120 120"
            height="120"
            width="120"
            id="client"
            key="0"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              style={{ fill: '#b0f2c2', border: 'none' }}
            />
          </symbol>
        ),
      },
    },
    NodeSubtypes: {},
    EdgeTypes: {
      emptyEdge: {
        shapeId: '#emptyEdge',
        shape: (
          <symbol
            viewBox="0 0 25 25"
            id="emptyEdge"
            key="0"
            style={{
              fill: '#3C7A9C',
            }}
          />
        ),
      },
    },
  };

  const NODE_KEY = 'id';

  const nodes = [
    {
      id: '1',
      title: 'Fábrica 1',
      type: 'factory',
      x: 50,
      y: 100,
    },
    { id: '2', title: 'Fábrica 2', type: 'factory', x: 50, y: 300 },
    { id: '3', title: 'Localización 1', type: 'location', x: 300, y: 100 },
    { id: '4', title: 'Localización 2', type: 'location', x: 300, y: 300 },
    { id: '5', title: 'Cliente 1', type: 'client', x: 550, y: 100 },
    { id: '6', title: 'Cliente 2', type: 'client', x: 550, y: 300 },
  ];

  const edges = [
    { source: '1', target: '3', type: 'emptyEdge' },
    { source: '1', target: '4', type: 'emptyEdge' },
    { source: '2', target: '3', type: 'emptyEdge' },
    { source: '2', target: '4', type: 'emptyEdge' },
    { source: '3', target: '5', type: 'emptyEdge' },
    { source: '3', target: '6', type: 'emptyEdge' },
    { source: '4', target: '5', type: 'emptyEdge' },
    { source: '4', target: '6', type: 'emptyEdge' },
  ];
  return (
    <div className="h-[500px] md:w-3/4 w-full flex justify-center items-center bg-gray-200 rounded">
      <GraphView
        nodeKey={NODE_KEY}
        nodes={nodes}
        edges={edges}
        selected={null}
        nodeTypes={GraphConfig.NodeTypes}
        nodeSubtypes={GraphConfig.NodeSubtypes}
        edgeTypes={GraphConfig.EdgeTypes}
        allowMultiselect={false}
        onSelect={() => {}}
        onCreateNode={() => {}}
        onUpdateNode={() => {}}
        onCreateEdge={() => {}}
        onSwapEdge={() => {}}
        edgeArrowSize={5}
        readOnly
      />
    </div>
  );
}
