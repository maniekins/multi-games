type TileModelConstructor = { type: string; blocking: boolean; id: string; blockingVisible?: boolean };

export class TileModel {
  type: string;
  blocking: boolean;
  blockingVisible: boolean;
  visible: boolean;
  visited: boolean;
  id: string;

  constructor({ type, blocking, id, blockingVisible = blocking }: TileModelConstructor) {
    this.type = type;
    this.blocking = !!blocking;
    this.visible = true;
    this.blockingVisible = !!blockingVisible;
    this.visited = false;
    this.id = id;
  }

  setSeen() {
    this.visible = true;
  }

  setUnseen() {
    this.visible = false;
  }
}

export default TileModel;

export const TYPES = {
  FOG: 'fog',
  GRASS: 'grass',
  ROOM: 'room',
  WALL: 'wall',
  WATER: 'water',
};
