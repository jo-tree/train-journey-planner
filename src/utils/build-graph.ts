import { Edge } from './types';

export const buildGraph = (routes: string) => {
  const nodes: Record<string, { edges: Edge[] }> = {};

  for (const edge of routes.split(', ')) {
    const [start, destination, distance] = edge.split('');

    if (!(start in nodes)) {
      nodes[start] = { edges: [] };
    }
    nodes[start].edges.push({ destination, distance: parseInt(distance) });
  }
  return nodes;
};
