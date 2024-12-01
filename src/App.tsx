import { useState } from 'react';
import './index.css';
import ReactSelect from 'react-select';
import GraphVisualizer from './components/Graph';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Edge = { destination: string; distance: number };
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

const findSuccessfulRouteWithStops = (
  graph: Record<string, { edges: Edge[] }>,
  journey: string[],
  maxStops: number = 12
): { route: string[]; totalDistance: number }[] => {
  const startNode = journey[0];
  const endNode = journey[journey.length - 1];
  const requiredStops = journey.slice(1, -1); // stops between start and end

  // Recursive traversal function
  const traverse = (
    currentNode: string,
    path: string[] = [],
    totalDistance: number = 0,
    depth: number = 0
  ): { route: string[]; totalDistance: number }[] => {
    // If we exceed max stops, return empty
    if (depth > maxStops) return [];

    const newPath = [...path, currentNode];
    const newDistance = totalDistance;

    // If we have reached the endNode, check if all required stops are visited
    if (currentNode === endNode) {
      const hasAllStops = requiredStops.every(stop => newPath.includes(stop));
      return hasAllStops ? [{ route: newPath, totalDistance: newDistance }] : [];
    }

    const successfulRoutes: { route: string[]; totalDistance: number }[] = [];

    // Explore each edge from the current node
    for (const edge of graph[currentNode]?.edges || []) {
      // Prevent revisiting nodes in the current path to avoid loops
      if (!newPath.includes(edge.destination)) {
        // Accumulate the distance for the current path
        successfulRoutes.push(
          ...traverse(edge.destination, newPath, newDistance + edge.distance, depth + 1)
        );
      }
    }

    return successfulRoutes;
  };

  // Start the traversal from the startNode
  return traverse(startNode);
};


function App() {
  const [selectedStops, setSelectedStops] = useState<string[]>(['']);
  const graph = buildGraph(INPUT_ROUTES)
  const noSuccessfulRoute = () => toast("Sorry there are no routes that match your selected journey");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const successfulRoutes = (findSuccessfulRouteWithStops(graph, selectedStops, SANE_LIMIT))
    console.log(successfulRoutes);
    if (successfulRoutes.length === 0) {
      noSuccessfulRoute()
    }
  };

  return (
  
      <div className="min-h-screen grid grid-rows-[auto_1fr]">
        <header className="text-black p-4">
          <h4 className="">NZ Railways Journey Planner</h4>
        </header>

        <main className="grid grid-cols-4 gap-4 p-4">
          <div className="col-span-3 p-4">
            <h2 className="text-xl font-semibold">Schedule a trip</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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
                  disabled={selectedStops.length <= 1}
                  className={`py-2 px-4 rounded-md focus:outline-none ${
                    selectedStops.length <= 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="col-span-1 p-4">
            <h2 className="text-xl font-semibold">Journey visualizer</h2>
            <GraphVisualizer />
          </div>
        </main>
        <ToastContainer />
      </div>

  );;
}

export default App;
