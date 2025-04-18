
export interface ConstellationNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  title: string;  // Added title property
  locked?: boolean;
}

export interface ConstellationEdge {
  source: string;
  target: string;
  weight: number;
  strength: number;  // Added strength property
}
