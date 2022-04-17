export type Orientation = 'North' | 'East' | 'South' | 'West';

export interface Position {
  x: number,
  y: number,
}

export type Amount = number | 'Infinite';

export interface KarelState {
  location: Position,
  orientation: Orientation,
  beepers: Amount,
}

export interface Heap {
  location: Position,
  amount: Amount,
}

export interface Wall {
  from: Position,
  to: Position,
}

export interface World {
  state: KarelState,  
  heaps: Heap[],
  walls: Wall[],
}
