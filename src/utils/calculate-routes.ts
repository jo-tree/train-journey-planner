import { Edge, SuccessfulRoute, SuccessfulRoutes } from './types';

class PriorityQueue {
  private elements: { node: string; priority: number }[] = [];

  enqueue(node: string, priority: number) {
    this.elements.push({ node, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): string {
    return this.elements.shift()!.node;
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}

export const findSuccessfulRouteWithStops = (
  graph: Record<string, { edges: Edge[] }>,
  startNode: string,
  endNode: string,
  selectedStops: string[],
  maxStops: number = 12
): SuccessfulRoutes => {
  // Recursive traversal function
  const traverse = (
    currentNode: string,
    path: string[] = [],
    totalDistance: number = 0,
    depth: number = 0
  ): SuccessfulRoutes => {
    // If we exceed max stops, return empty
    if (depth > maxStops) return [];

    const newPath = [...path, currentNode];
    const newDistance = totalDistance;

    // If we have reached the endNode, check if all required stops are visited
    if (currentNode === endNode) {
      const hasAllStops = selectedStops.every((stop) => newPath.includes(stop));
      return hasAllStops
        ? [{ route: newPath, totalDistance: newDistance }]
        : [];
    }

    const successfulRoutes: SuccessfulRoutes = [];

    // Explore each edge from the current node
    for (const edge of graph[currentNode]?.edges || []) {
      // Prevent revisiting nodes in the current path to avoid loops
      if (!newPath.includes(edge.destination)) {
        // Accumulate the distance for the current path
        successfulRoutes.push(
          ...traverse(
            edge.destination,
            newPath,
            newDistance + edge.distance,
            depth + 1
          )
        );
      }
    }

    return successfulRoutes;
  };

  // Start the traversal from the startNode
  return traverse(startNode);
};

export const findShortestRoute = (
  graph: Record<string, { edges: Edge[] }>,
  startNode: string,
  endNode: string
): SuccessfulRoute | null => {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited: Set<string> = new Set();
  const queue = new PriorityQueue();

  // Initialize distances and previous nodes
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startNode] = 0;
  queue.enqueue(startNode, 0);

  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();

    if (currentNode === endNode) {
      // Reconstruct the shortest path
      const path: string[] = [];
      let node: string | null = endNode;
      while (node) {
        path.unshift(node);
        node = previous[node];
      }
      return { route: path, totalDistance: distances[endNode] };
    }

    if (!visited.has(currentNode)) {
      visited.add(currentNode);

      for (const edge of graph[currentNode]?.edges || []) {
        const neighbor = edge.destination;
        const newDist = distances[currentNode] + edge.distance;

        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = currentNode;
          queue.enqueue(neighbor, newDist);
        }
      }
    }
  }

  // If there's no path to the endNode
  return null;
};
