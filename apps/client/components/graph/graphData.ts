import {
  ModelResult,
  PrimaryModelVariable,
  TotalClientDemand,
} from '../../models';

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
export function getGraphEdges({
  results,
  totalClientDemand,
}: {
  results: ModelResult;
  totalClientDemand: TotalClientDemand[];
}) {
  const edges = [];
  Object.keys(results).forEach((result) => {
    if (result.includes('x')) {
      const [, clientId, locationId] = result.split('_');
      if (results[result] > 0)
        edges.push({
          source: locationId,
          target: clientId,
          type: 'emptyEdge',
          handleText:
            totalClientDemand.find((d) => d.client === clientId)?.totalDemand ??
            0,
        });
    }
    if (result.includes('z')) {
      const [, , factoryId, locationId] = result.split('_');
      if (results[result] > 0) {
        const previousEdge = edges.find(
          (edge) => edge.source === factoryId && edge.target === locationId
        );
        if (previousEdge)
          previousEdge.handleText = `${
            Number(previousEdge.handleText) + Number(results[result])
          }`;
        else
          edges.push({
            source: factoryId,
            target: locationId,
            type: 'emptyEdge',
            handleText: results[result],
          });
      }
    }
  });
  return edges;
}
