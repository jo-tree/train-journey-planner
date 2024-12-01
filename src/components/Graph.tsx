import { useEffect, useRef } from 'react';
import { Network } from 'vis-network';

const GraphVisualizer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const data = {
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' },
        { id: 'E', label: 'E' },
      ],
      edges: [
        { from: 'A', to: 'B', label: '5' },
        { from: 'A', to: 'D', label: '5' },
        { from: 'A', to: 'E', label: '7' },
        { from: 'B', to: 'C', label: '4' },
        { from: 'C', to: 'D', label: '8' },
        { from: 'C', to: 'E', label: '2' },
        { from: 'D', to: 'C', label: '8' },
        { from: 'D', to: 'E', label: '6' },
        { from: 'E', to: 'B', label: '3' },
      ],
    };

    const options = {
      interaction: {
        dragNodes: false,
        dragView: false,
        zoomView: false,
      },
      edges: { arrows: 'to' },
    };
    const network = new Network(containerRef.current, data, options);

    return () => network.destroy();
  }, []);

  return <div className="h-[500px]" ref={containerRef} />;
};

export default GraphVisualizer;
