import { useState } from 'react';
import './index.css';
import ReactSelect from 'react-select';
import GraphVisualizer from './components/Graph';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  findShortestRoute,
  findSuccessfulRouteWithStops,
} from './utils/calculate-routes';
import { Edge, SuccessfulRoute, SuccessfulRoutes } from './utils/types';

interface SelectOption {
  value: string;
  label: string;
}

const INPUT_ROUTES = 'AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7';
const SANE_LIMIT = 12;

const buildGraph = (routes: string) => {
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

function App() {
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [successfulRoutes, setSuccessfulRoutes] =
    useState<SuccessfulRoutes | null>(null);
  const [shortestRoute, setShortestRoute] = useState<SuccessfulRoute | null>(
    null
  );

  const graph = buildGraph(INPUT_ROUTES);

  const options: SelectOption[] = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
  ];

  const handleAddStop = () => {
    setSelectedStops([...selectedStops, '']);
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...selectedStops];
    newStops[index] = value;
    setSelectedStops(newStops);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = selectedStops.filter((_, i) => i !== index);
    setSelectedStops(newStops);
  };
  //error handling if no selected. A toast even
  const handleAllRoutesClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (startNode && endNode) {
      const successfulRoutes = findSuccessfulRouteWithStops(
        graph,
        startNode,
        endNode,
        selectedStops,
        SANE_LIMIT
      );
      if (successfulRoutes.length === 0) {
        toast('Sorry, there are no possible routes to make this journey.');
      } else {
        setSuccessfulRoutes(successfulRoutes);
      }
    } else {
      toast('Please select both a start and an end node.');
    }
  };

  const handleShortestRouteClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStops.length > 0) {
      toast('Please remove all stops to find shortest route.');
    }
    if (startNode && endNode) {
      const successfulRoute = findShortestRoute(graph, startNode, endNode);
      if (!successfulRoute) {
        toast(
          'Sorry, there are no ways to travel between your origin and destination.'
        );
      } else {
        setShortestRoute(successfulRoute);
      }
    } else {
      toast('Please select both a start and an end node.');
    }
  };
  console.log(shortestRoute);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="text-black p-4">
        <h1 className="">NZ Railways Journey Planner</h1>
      </header>

      <main className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3 p-4">
          <h2 className="text-xl font-semibold">Schedule a trip</h2>
          <form onSubmit={handleAllRoutesClick}>
            <div className="mb-4">
              <label>Origin:</label>
              <ReactSelect
                value={options.find((opt) => opt.value === startNode) ?? null}
                onChange={(e) => setStartNode(e?.value ?? '')}
                options={options}
                className="w-24"
              />
              {selectedStops.length > 0 && <label>Stops:</label>}
              {selectedStops.map((stop, index) => (
                <div key={index} className="mb-4 flex items-center">
                  <ReactSelect
                    value={options.find((opt) => opt.value === stop) ?? null}
                    onChange={(e) => handleStopChange(index, e?.value ?? '')}
                    options={options}
                    className="w-24"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <label>Destination:</label>
              <ReactSelect
                value={options.find((opt) => opt.value === endNode) ?? null}
                onChange={(e) => setEndNode(e?.value ?? '')}
                options={options}
                className="w-24"
              />
            </div>
            <div className="mt-2 gap-2">
              <button
                type="button"
                onClick={handleAddStop}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Stop
              </button>
              <button
                type="submit"
                className="py-2 px-4 rounded-md focus:outline-none bg-teal"
              >
                Find all possible routes
              </button>
              <button
                type="button"
                onClick={(e) => handleShortestRouteClick(e)}
                className="py-2 px-4 rounded-md focus:outline-none bg-teal"
              >
                Find shortest route
              </button>
            </div>
            {successfulRoutes && successfulRoutes.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">
                  Calculated result:
                </h2>
                <ul className="space-y-4">
                  {successfulRoutes.map((route, index) => (
                    <li key={index} className="p-4 border rounded shadow">
                      <p className="text-lg font-medium">
                        Route {index + 1}: {route.route.join(' → ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Distance: {route.totalDistance} km
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {shortestRoute && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">
                  Calculated result:
                </h2>
                <div className="p-4 border rounded shadow">
                  <p className="text-lg font-medium">
                    Shortest route: {shortestRoute.route.join(' → ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Distance: {shortestRoute.totalDistance} km
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="col-span-1 p-4">
          <h2 className="text-xl font-semibold">Journey visualizer</h2>
          <GraphVisualizer />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
