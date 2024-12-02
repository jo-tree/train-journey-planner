import { Edge, SuccessfulRoutes } from './types';

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

// Calculate distance
// Allow the user to enter a number of stops and then print the distance involved in  traversing the route.
// If the route cannot be traversed because it is invalid then print out an error message.

export const findRoutes = (
  graph: Record<string, { edges: Edge[] }>,
  startNode: string,
  endNode: string,
  selectedStops: string[] = [],
  maxStops: number = 12,
  exactStops?: number
): SuccessfulRoutes => {
  const traverse = (
    currentNode: string,
    path: string[] = [],
    totalDistance: number = 0,
    depth: number = 0
  ): SuccessfulRoutes => {
    const MAX_ALLOWED_STOPS = 100;

    // Guard against user entering excessively large maxStops values
    if (maxStops > MAX_ALLOWED_STOPS) {
      console.warn(
        `maxStops exceeds the maximum allowed value of ${MAX_ALLOWED_STOPS}. Setting maxStops to ${MAX_ALLOWED_STOPS}.`
      );
      maxStops = MAX_ALLOWED_STOPS;
    }
    // Check if we've exceeded the maximum allowed stops
    if (maxStops !== undefined && depth > maxStops) return [];
    if (exactStops !== undefined && depth > exactStops) return [];

    const newPath = [...path, currentNode];

    const successfulRoutes: SuccessfulRoutes = [];

    // Check if we've reached the end node (but not on the first move)
    if (currentNode === endNode && depth > 0) {
      let constraintsSatisfied = true;

      // Check if all selected stops are included in the path
      if (selectedStops.length > 0) {
        constraintsSatisfied = selectedStops.every((stop) =>
          newPath.includes(stop)
        );
      }

      // Check for exact number of stops
      if (exactStops !== undefined) {
        constraintsSatisfied = constraintsSatisfied && depth === exactStops;
      }

      if (constraintsSatisfied) {
        successfulRoutes.push({ route: newPath, totalDistance });
      }
    }

    // Explore adjacent nodes
    for (const edge of graph[currentNode]?.edges || []) {
      // Prevent revisiting nodes to avoid loops
      // will this cause an issue in the instance where a user selects the same stop more than once
      if (!newPath.includes(edge.destination) || edge.destination === endNode) {
        successfulRoutes.push(
          ...traverse(
            edge.destination,
            newPath,
            totalDistance + edge.distance,
            depth + 1
          )
        );
      }
    }

    return successfulRoutes;
  };

  return traverse(startNode);
};

// What is the shortest route?
// Allow the user to enter a start and end station (which could be the same station) and
// then print out the length and details of the shortest route (in terms of distance to travel).

// seperate function to avoid the overhead and expense of finding all routes just to get shortest

export const findShortestRoute = (
  graph: Record<string, { edges: Edge[] }>,
  startNode: string,
  endNode: string
): SuccessfulRoutes | null => {
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
      return [{ route: path, totalDistance: distances[endNode] }];
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

  // If there's no path to the endNode return null
  return null;
};
