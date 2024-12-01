export type SuccessfulRoute = {
  route: string[];
  totalDistance: number;
};

export type SuccessfulRoutes = SuccessfulRoute[];
export type Edge = { destination: string; distance: number };
