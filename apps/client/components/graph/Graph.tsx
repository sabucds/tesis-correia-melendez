import React from 'react';
import { GraphView } from 'react-digraph';

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

export default class Graph extends React.Component<any> {
  constructor(props: any | Readonly<any>) {
    super(props);
    this.isControlKeyPressed = this.isControlKeyPressed.bind(this);
  }

  isControlKeyPressed() {}

  render() {
    const { nodes, edges } = this.props;

    return (
      <div className="h-[500px] w-full flex justify-center items-center bg-gray-200 rounded">
        <GraphView
          nodeKey="id"
          nodes={nodes}
          edges={edges}
          selected={null}
          nodeTypes={GraphConfig.NodeTypes}
          nodeSubtypes={GraphConfig.NodeSubtypes}
          edgeTypes={GraphConfig.EdgeTypes}
          allowMultiselect={false}
          edgeArrowSize={5}
          readOnly={false}
          canSwapEdge={() => false}
          onDeleteSelected={() => {}}
          canDeleteSelected={() => false}
        />
      </div>
    );
  }
}
