import { useState } from 'react';
import './index.css';
import GraphVisualizer from './components/Graph';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { findShortestRoute, findRoutes } from './utils/calculate-routes';
import { SelectOption, SuccessfulRoutes } from './utils/types';
import { buildGraph } from './utils/build-graph';
import Select from './components/Select';

const INPUT_ROUTES = 'AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7';
const selectOptions: SelectOption[] = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
];

function App() {
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [successfulRoutes, setSuccessfulRoutes] =
    useState<SuccessfulRoutes | null>(null);

  const graph = buildGraph(INPUT_ROUTES);

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

  const handleAllRoutesClick = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startNode || !endNode) {
      toast('Please select both a start and an end node.');
      return;
    }

    const successfulRoutes = findRoutes(
      graph,
      startNode,
      endNode,
      selectedStops
    );

    if (successfulRoutes.length === 0) {
      toast('Sorry, there are no possible routes to make this journey.');
      return;
    }

    setSuccessfulRoutes(successfulRoutes);
  };

  const handleShortestRouteClick = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStops.length > 0) {
      toast('Please remove all stops to find the shortest route.');
      return;
    }

    if (!startNode || !endNode) {
      toast('Please select both a start and an end node.');
      return;
    }

    const successfulRoute = findShortestRoute(graph, startNode, endNode);

    if (!successfulRoute) {
      toast(
        'Sorry, there are no ways to travel between your origin and destination.'
      );
      return;
    }

    setSuccessfulRoutes(successfulRoute);
  };

  //TODO tidy up UI for when someone makes a change to route ie invalidate the data.
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="text-black p-4">
        <h1 className="">NZ Railways Journey Planner</h1>
      </header>

      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3 p-4">
          <h2 className="text-xl font-semibold">Schedule a trip</h2>

          <div className="mb-4">
            <Select
              label="Origin:"
              value={
                selectOptions.find((opt) => opt.value === startNode)?.value ??
                null
              }
              onChange={(e) => setStartNode(e)}
              options={selectOptions}
            />
            {selectedStops.length > 0 && <label>Stops:</label>}
            {selectedStops.map((stop, index) => (
              <div key={index} className="mb-4 flex">
                <Select
                  value={
                    selectOptions.find((opt) => opt.value === stop)?.value ??
                    null
                  }
                  onChange={(e) => handleStopChange(index, e ?? '')}
                  options={selectOptions.filter(
                    (opt) =>
                      !selectedStops.includes(opt.value) || opt.value === stop
                  )}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  className="py-[3px] px-1 text-red-500 ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flx flex-ro gap-2">
              <Select
                label="Destination:"
                value={
                  selectOptions.find((opt) => opt.value === endNode)?.value ??
                  null
                }
                onChange={(e) => setEndNode(e ?? '')}
                options={selectOptions}
              />
              <button
                type="button"
                onClick={handleAddStop}
                className="py-[3px] px-1 mt-2 bg-blue-500 text-white rounded"
              >
                Add Stop
              </button>
            </div>
          </div>
          <div className="mt-2 gap-2">
            <button
              type="button"
              onClick={(e) => handleAllRoutesClick(e)}
              className="py-[3px] px-1 rounded-md focus:outline-none bg-teal"
            >
              Find all possible routes
            </button>
            <button
              type="button"
              onClick={handleShortestRouteClick}
              className="py-[3px] px-1 rounded-md focus:outline-none bg-teal"
            >
              Find shortest route
            </button>
          </div>
          {successfulRoutes && successfulRoutes.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Calculated result:</h2>
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
        </div>
        <div className="col-span-1 p-4">
          <h2 className="text-xl font-semibold">Journey visualizer</h2>
          <GraphVisualizer />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
