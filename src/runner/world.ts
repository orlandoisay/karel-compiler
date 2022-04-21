import { Amount, Heap, KarelState, Orientation, Position, WorldDescription } from "../types";

// Direction to the left 
const Left: { [O in Orientation]: Orientation } = {
  'North': 'West',
  'East': 'North',
  'South': 'East',
  'West': 'South',
};

const Delta: { [O in  Orientation]: Position } = {
  'North': { x: 0, y: 1 },
  'East': { x: 1, y: 0 },
  'South': { x: 0, y: -1 },
  'West': { x: -1, y: 0 },
};

export class World {
  state: KarelState;
  heaps: Map<Position, Amount>;

  constructor(world: WorldDescription) {
    this.state = world.state;

    this.heaps = new Map<Position, Amount>();
    world.heaps.forEach(heap => this.heaps.set(heap.location, heap.amount));
  }

  public getCurrentState() {
    let heaps: Heap[] = [];
    this.heaps.forEach((amount, location) => {
      heaps.push({ 
        location,
        amount,
      });
    });

    const currentState = {
      state: this.state,
      heaps,
    };

    return currentState;
  }


  public turnleft(): void {
    this.state.orientation = Left[this.state.orientation];
  }

  public pickBeeper(): void {
    this.removeBeeperFromMap();
    this.addBeeperToBag();
  }

  public putBeeper(): void {
    this.removeBeeperFromBag();
    this.addBeeperToMap();    
  }


  public hasBeepers(): boolean {
    return this.state.beepers == 'Infinite' || this.state.beepers > 0;
  }

  public nextToBeeper(): boolean {
    return this.heaps.has(this.state.location);
  }


  private addBeeperToBag() {
    if (this.state.beepers !== 'Infinite') {
      this.state.beepers += 1;
    };
  }

  private removeBeeperFromBag() {
    if (!this.hasBeepers()) {
      throw Error('Tried to put beeper unsuccesfully.');
    }

    if (this.state.beepers !== 'Infinite') {
      this.state.beepers -= 1;
    }
  }

  private addBeeperToMap() {
    if (!this.heaps.has(this.state.location)) {
      this.heaps.set(this.state.location, 1);
      return;
    }

    const amount = this.heaps.get(this.state.location);

    if (amount !== 'Infinite') {
      this.heaps.set(this.state.location, amount! + 1);
    }
  }

  private removeBeeperFromMap() {
    if (!this.nextToBeeper()) {
      throw Error('Tried to pick beeper unsuccessfuly.');
    }

    const amount = this.heaps.get(this.state.location);

    if (amount !== 'Infinite') {
      this.heaps.delete(this.state.location);

      if (amount! - 1 > 0) {
        this.heaps.set(this.state.location, amount! - 1);
      }
    }
  }
}
