import TileModel from '../Models/Tile';
import { Location, MapType } from '../types';

const setVision = (map: MapType, position: Location, VISION: number) => {
  if (!VISION || !map) {
    return;
  }

  const size = {
    height: map.length,
    width: map[0].length,
  };
  const { positionX, positionY } = position;
  const rounds = VISION;

  resetVision(map);

  const roundValues = generateRoundValues(rounds);

  for (let sy = 0; sy < roundValues.length; sy++) {
    const roundValuesInner = [];
    for (let k = 0; k < roundValues.length; k++) {
      roundValuesInner.push(roundValues[k]);
    }

    for (let sx = 0; sx < roundValuesInner.length; sx++) {
      const valX = roundValuesInner[sx];
      const valY = roundValues[sy];
      const lowX = valX < 0;
      const lowY = valY < 0;
      const centerX = valX === 0;
      const centerY = valY === 0;
      const highX = valX > 0;
      const highY = valY > 0;
      const xx = positionX + valX;
      const yy = positionY + valY;

      if (xx >= 0 && xx < size.width && yy >= 0 && yy < size.height) {
        const tile = map[yy][xx];
        tile.setSeen();

        if (lowX && lowY) {
          // x\\\\\\\\\\\\\
          checkBeforeTilesInStraight(
            valY,
            valX,
            map,
            yy,
            xx,
            isWallShouldBeSeen(map, yy, xx, tile, DIRECTIONS.DOWN, DIRECTIONS.LEFT),
            tile,
            DIRECTIONS.DOWN,
            DIRECTIONS.LEFT,
          );
        } else if (lowX && highY) {
          // x///////////////
          checkBeforeTilesInStraight(
            valY,
            valX,
            map,
            yy,
            xx,
            isWallShouldBeSeen(map, yy, xx, tile, DIRECTIONS.UP, DIRECTIONS.LEFT),
            tile,
            DIRECTIONS.UP,
            DIRECTIONS.LEFT,
          );
        } else if (highX && lowY) {
          // ///////////////x
          checkBeforeTilesInStraight(
            valY,
            valX,
            map,
            yy,
            xx,
            isWallShouldBeSeen(map, yy, xx, tile, DIRECTIONS.DOWN, DIRECTIONS.RIGHT),
            tile,
            DIRECTIONS.DOWN,
            DIRECTIONS.RIGHT,
          );
        } else if (highX && highY) {
          // \\\\\\\\\\\\\\\x
          checkBeforeTilesInStraight(
            valY,
            valX,
            map,
            yy,
            xx,
            isWallShouldBeSeen(map, yy, xx, tile, DIRECTIONS.UP, DIRECTIONS.RIGHT),
            tile,
            DIRECTIONS.UP,
            DIRECTIONS.RIGHT,
          );
        } else if (centerX) {
          // |||||||||||||||
          if (lowY) {
            if (yy + 1 < size.height) {
              const beforeTile = map[yy + 1][xx];
              if (beforeTile.blockingVisible || !beforeTile.visible) {
                tile.setUnseen();
                // tile.visible = true;
              }
            }
          }
          if (highY) {
            if (yy - 1 >= 0) {
              const beforeTile = map[yy - 1][xx];
              if (beforeTile.blockingVisible || !beforeTile.visible) {
                tile.setUnseen();
                // tile.visible = false;
              }
            }
          }
        } else if (centerY) {
          // --------------------
          if (lowX) {
            if (xx + 1 < size.width) {
              const beforeTile = map[yy][xx + 1];
              if (beforeTile.blockingVisible || !beforeTile.visible) {
                tile.setUnseen();
                // tile.visible = true;
              }
            }
          }
          if (highX) {
            if (xx - 1 >= 0) {
              const beforeTile = map[yy][xx - 1];
              if (beforeTile.blockingVisible || !beforeTile.visible) {
                tile.setUnseen();
                // tile.visible = true;
              }
            }
          }
        }
      }
    }
    setVisited(map);
  }
};
export default setVision;

const setVisited = (map: MapType) => {
  map.forEach((row) =>
    row.forEach((tile) => {
      if (tile.visible) {
        tile.visited = true;
      }
    }),
  );
};

const resetVision = (map: MapType) => {
  map.forEach((row) =>
    row.forEach((tile) => {
      tile.setUnseen();
    }),
  );
};

const generateRoundValues = (rounds: number) => {
  const roundValues = [0];
  for (let i = 1; i <= rounds; i++) {
    roundValues.push(-i);
    roundValues.push(i);
  }
  return roundValues;
};

const checkBeforeTilesInStraight = (
  valY: number,
  valX: number,
  map: MapType,
  yy: number,
  xx: number,
  see: boolean,
  tile: TileModel,
  directionY: DIRECTIONS,
  directionX: DIRECTIONS,
) => {
  const numberOfDistance = Math.max(Math.abs(valY), Math.abs(valX));

  for (let d = 1; d < numberOfDistance; d++) {
    const nextY = Math.round(Math.abs((valY * d) / numberOfDistance));
    const nextX = Math.round(Math.abs((valX * d) / numberOfDistance));

    const newY = directionY === DIRECTIONS.DOWN ? yy + nextY : yy - nextY;
    const newX = directionX === DIRECTIONS.LEFT ? xx + nextX : xx - nextX;

    if (map[newY][newX].blockingVisible || !map[newY][newX].visible) {
      if (!see) {
        tile.setUnseen();
      }
    }
  }
};

const isWallShouldBeSeen = (
  map: MapType,
  yy: number,
  xx: number,
  tile: TileModel,
  directionY: DIRECTIONS,
  directionX: DIRECTIONS,
) => {
  const newY = directionY === DIRECTIONS.DOWN ? yy + 1 : yy - 1;
  const newX = directionX === DIRECTIONS.LEFT ? xx + 1 : xx - 1;

  return (
    (!map[yy][newX].blockingVisible && map[yy][newX].visible && tile.blockingVisible) ||
    (!map[newY][xx].blockingVisible && map[newY][xx].visible && tile.blockingVisible) ||
    (!map[newY][newX].blockingVisible && map[newY][newX].visible && tile.blockingVisible)
  );
};

enum DIRECTIONS {
  DOWN,
  LEFT,
  RIGHT,
  UP,
}
