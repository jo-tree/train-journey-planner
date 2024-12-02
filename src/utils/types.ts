type Route = {
  route: string[];
  totalDistance: number;
};

export type SuccessfulRoutes = Route[];
export type Edge = { destination: string; distance: number };
