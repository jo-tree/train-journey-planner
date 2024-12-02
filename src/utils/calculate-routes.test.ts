import { buildGraph } from './build-graph';
import { findRoutes, findShortestRoute } from './calculate-routes';

const INPUT_ROUTES = 'AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7';
const graph = buildGraph(INPUT_ROUTES);

// Calculate Distance - getting all routes
// Test data: A-B-C, A-E-B-C-D, A-D, A-D-C, A-E-D
describe('findRoutes Function Tests', () => {
  it('Finds routes from A to C that include stop B', () => {
    const routes = findRoutes(graph, 'A', 'C', ['B']);
    const routesIncludingB = routes.filter((routeInfo) =>
      routeInfo.route.includes('B')
    );
    expect(routesIncludingB.length).toBeGreaterThan(0);
    expect(routes.every((routeInfo) => routeInfo.route.includes('B'))).toBe(
      true
    );
  });

  it('Finds routes from A to D that include stops E, B and C in order', () => {
    const routes = findRoutes(graph, 'A', 'D', ['E', 'B', 'C']);
    expect(
      routes.every((routeInfo) => {
        const eIndex = routeInfo.route.indexOf('E');
        const bIndex = routeInfo.route.indexOf('B');
        const cIndex = routeInfo.route.indexOf('C');
        return (
          eIndex !== -1 &&
          bIndex !== -1 &&
          cIndex !== -1 &&
          eIndex < bIndex &&
          bIndex < cIndex
        );
      })
    ).toBe(true);
  });

  it('Finds routes from A to D', () => {
    const routes = findRoutes(graph, 'A', 'D', []);

    expect(
      routes.every((routeInfo) =>
        ['A', 'D'].every((stop) => routeInfo.route.includes(stop))
      )
    ).toBe(true);
  });

  it('Finds routes from A to C that include stop D', () => {
    const routes = findRoutes(graph, 'A', 'C', ['D']);
    const routesIncludingD = routes.filter((routeInfo) =>
      routeInfo.route.includes('D')
    );
    expect(routesIncludingD.length).toBeGreaterThan(0);
    expect(routes.every((routeInfo) => routeInfo.route.includes('D'))).toBe(
      true
    );
  });

  it('Finds routes from A to D that include stop E', () => {
    const routes = findRoutes(graph, 'A', 'D', ['E']);
    const routesIncludingB = routes.filter((routeInfo) =>
      routeInfo.route.includes('B')
    );
    expect(routesIncludingB.length).toBeGreaterThan(0);
    expect(routes.every((routeInfo) => routeInfo.route.includes('B'))).toBe(
      true
    );
  });

  it('Does not return routes that do not include the selected stops', () => {
    const routes = findRoutes(graph, 'A', 'C', ['E']);
    expect(routes.every((routeInfo) => routeInfo.route.includes('E'))).toBe(
      true
    );
  });

  it('Handles case where no route includes all selected stops', () => {
    const routes = findRoutes(graph, 'B', 'E', ['A']);
    expect(routes.length).toBe(0);
  });

  it('Finds routes from C to C with a maximum of 3 stops', () => {
    const routes = findRoutes(graph, 'C', 'C', [], 3);
    expect(routes.length).toBe(2);
    expect(
      routes.every(
        (routeInfo) =>
          routeInfo.route[0] === 'C' &&
          routeInfo.route[routeInfo.route.length - 1] === 'C' &&
          routeInfo.route.length - 1 <= 3
      )
    ).toBe(true);
  });
});

// What is the shortest route?
// Test data: B to B, A to C
describe('findShortestRoute Function Tests', () => {
  it('should find the shortest route from B to B with a total distance of 9', () => {
    const result = findShortestRoute(graph, 'B', 'B');

    const expectedRoute = ['B'];
    const expectedDistance = 0;
    console.log(result);

    expect(result).not.toBeNull();
    if (result) {
      expect(result[0].route).toEqual(expectedRoute);
      expect(result[0].totalDistance).toBe(expectedDistance);
    }
  });

  it('should find the shortest route from A to C with a total distance of 9', () => {
    const result = findShortestRoute(graph, 'A', 'C');

    const expectedRoute = ['A', 'B', 'C'];
    const expectedDistance = 9;

    expect(result).not.toBeNull();
    if (result) {
      expect(result[0].route).toEqual(expectedRoute);
      expect(result[0].totalDistance).toBe(expectedDistance);
    }
  });
});
