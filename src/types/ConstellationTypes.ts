
export interface ConstellationNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface ConstellationEdge {
  source: string;
  target: string;
  weight: number;
}
