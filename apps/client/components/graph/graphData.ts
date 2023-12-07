import { ModelResult, PrimaryModelVariable } from '../../models';

export function getGraphNodes({
  clients,
  locations,
  factories,
}: {
  clients: PrimaryModelVariable[];
  locations: PrimaryModelVariable[];
  factories: PrimaryModelVariable[];
}) {
  const nodes = [];
  clients.forEach((client, i) => {
    const y = 100 + i * 200;
    nodes.push({
      id: client.id,
      title: client.name,
      type: 'client',
      x: 550,
      y,
    });
  });
  locations.forEach((location, i) => {
    const y = 100 + i * 200;
    nodes.push({
      id: location.id,
      title: location.name,
      type: 'location',
      x: 300,
      y,
    });
  });
  factories.forEach((factory, i) => {
    const y = 100 + i * 200;
    nodes.push({
      id: factory.id,
      title: factory.name,
      type: 'factory',
      x: 50,
      y,
    });
  });
  return nodes;
}
export function getGraphEdges({ results }: { results: ModelResult }) {
  const edges = [];
  Object.keys(results).forEach((result) => {
    if (result.includes('x')) {
      const [, clientId, locationId] = result.split('_');
      if (results[result] > 0)
        edges.push({
          source: locationId,
          target: clientId,
          type: 'emptyEdge',
        });
    }
    if (result.includes('z')) {
      const [, , factoryId, locationId] = result.split('_');
      if (results[result] > 0)
        edges.push({
          source: factoryId,
          target: locationId,
          type: 'emptyEdge',
          handleText: results[result],
        });
    }
  });
  return edges;
}
