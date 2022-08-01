import { MapKeysType } from './types';

export const DIRECTIONS = {
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  LEFT_DOWN: 'LEFT_DOWN',
  LEFT_UP: 'LEFT_UP',
  RIGHT: 'RIGHT',
  RIGHT_DOWN: 'RIGHT_DOWN',
  RIGHT_UP: 'RIGHT_UP',
  UP: 'UP',
};

export class KeyPressed {
  key: string;
  constructor(key: string) {
    this.key = key;
  }

  up() {
    return this.key === DIRECTIONS.UP;
  }

  down() {
    return this.key === DIRECTIONS.DOWN;
  }

  left() {
    return this.key === DIRECTIONS.LEFT;
  }

  right() {
    return this.key === DIRECTIONS.RIGHT;
  }

  leftUp() {
    return this.key === DIRECTIONS.LEFT_UP;
  }

  leftDown() {
    return this.key === DIRECTIONS.LEFT_DOWN;
  }

  rightUp() {
    return this.key === DIRECTIONS.RIGHT_UP;
  }

  rightDown() {
    return this.key === DIRECTIONS.RIGHT_DOWN;
  }
}

export class KeysPressed {
  keys: KeyPressed[];
  constructor(keys: KeyPressed[]) {
    this.keys = keys;
  }

  up() {
    return this.keys.findIndex((k) => k.up()) !== -1;
  }

  down() {
    return this.keys.findIndex((k) => k.down()) !== -1;
  }

  left() {
    return this.keys.findIndex((k) => k.left()) !== -1;
  }

  right() {
    return this.keys.findIndex((k) => k.right()) !== -1;
  }

  leftUp() {
    return this.keys.findIndex((k) => k.leftUp()) !== -1;
  }

  leftDown() {
    return this.keys.findIndex((k) => k.leftDown()) !== -1;
  }

  rightUp() {
    return this.keys.findIndex((k) => k.rightUp()) !== -1;
  }

  rightDown() {
    return this.keys.findIndex((k) => k.rightDown()) !== -1;
  }

  pressed() {
    return this.keys.length > 0;
  }
}

export const mapKeys: MapKeysType = (keys, options = {}) => {
  const onlyArrow = !!options.arrows;
  const onlyWsad = !!options.wsad;
  const allDirections = !onlyArrow && !onlyWsad;
  const mappedKeys = new KeysPressed(
    keys.map((key) => {
      let k;
      switch (key) {
        case 'ArrowLeft':
          (onlyArrow || allDirections) && (k = DIRECTIONS.LEFT);
          break;
        case 'KeyA': //A
          (onlyWsad || allDirections) && (k = DIRECTIONS.LEFT);
          break;
        case 'ArrowRight':
          (onlyArrow || allDirections) && (k = DIRECTIONS.RIGHT);
          break;
        case 'KeyD': //D
          (onlyWsad || allDirections) && (k = DIRECTIONS.RIGHT);
          break;
        case 'ArrowDown':
          (onlyArrow || allDirections) && (k = DIRECTIONS.DOWN);
          break;
        case 'KeyS': //S
          (onlyWsad || allDirections) && (k = DIRECTIONS.DOWN);
          break;
        case 'ArrowUp':
          (onlyArrow || allDirections) && (k = DIRECTIONS.UP);
          break;
        case 'KeyW': //W
          (onlyWsad || allDirections) && (k = DIRECTIONS.UP);
          break;
        default:
          k = key;
      }
      if (k === undefined) {
        k = key;
      }
      return new KeyPressed(k);
    }),
  );

  // check slant
  if (mappedKeys.left() && mappedKeys.up()) {
    mappedKeys.keys.push(new KeyPressed(DIRECTIONS.LEFT_UP));
  }
  if (mappedKeys.left() && mappedKeys.down()) {
    mappedKeys.keys.push(new KeyPressed(DIRECTIONS.LEFT_DOWN));
  }
  if (mappedKeys.right() && mappedKeys.up()) {
    mappedKeys.keys.push(new KeyPressed(DIRECTIONS.RIGHT_UP));
  }
  if (mappedKeys.right() && mappedKeys.down()) {
    mappedKeys.keys.push(new KeyPressed(DIRECTIONS.RIGHT_DOWN));
  }

  return mappedKeys;
};
