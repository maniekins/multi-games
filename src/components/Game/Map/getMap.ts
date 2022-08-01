import { rollDice } from '../../../utils';
import TileModel, { TYPES } from '../Models/Tile';
import { MapSettingsType, MapSizeType, MapType, RoomsType, RoomType } from '../types';

const generateInitialMap = (mapSize: MapSizeType): MapType => {
  const map: MapType = new Array(mapSize.height);

  for (let i = 0; i < map.length; i++) {
    map[i] = new Array(mapSize.width);
    for (let j = 0; j < map[i].length; j++) {
      map[i][j] = new TileModel({ blocking: true, id: `${i}-${j}`, type: TYPES.WALL });
    }
  }
  return map;
};

export const renderWalls = (mapSize: MapSizeType, mapSettings: MapSettingsType): MapType => {
  const map = generateInitialMap(mapSize);

  createRooms({ map, mapSettings });

  return map as MapType;
};

export const calculateStart = (map: MapType, mapSize: MapSizeType) => {
  while (true) {
    const positionY = rollDice(0, mapSize.height - 1);
    const positionX = rollDice(0, mapSize.width - 1);
    if (!map[positionY][positionX].blocking) {
      return { positionX, positionY };
    }
  }
};

const addWater = (map: MapType, mapSettings?: MapSettingsType): MapType => {
  if (mapSettings?.water) {
    for (let i = 0; i < mapSettings.water.length; i++) {
      const water = mapSettings.water[i];
      const width = water.width;
      const height = water.height;
      const findCenterX = water.centerX;
      const findCenterY = water.centerY;

      let startX, startY;

      try {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            startY = findCenterY - Math.floor(height / 2) + y;
            startX = findCenterX - Math.floor(width / 2) + x;
            // console.log("startY", startY, "startX", startX);
            map[startY][startX] = new TileModel({
              blocking: true,
              blockingVisible: false,
              id: `${startY}-${startX}`,
              type: TYPES.WATER,
            });
          }
        }
      } catch (e) {
        console.log('ERROR with adding WATER');
        console.log('findCenterX', findCenterX, 'findCenterY', findCenterY);
        console.log('width', width, 'height', height);
        console.log('startX', startX, 'ERROR startY', startY);
      }
    }
  } else {
    // TODO: generate
  }
  return map;
};

type getMapPropsType = { mapSize: MapSizeType; mapSettings?: MapSettingsType };
type getMapType = (props: getMapPropsType) => MapType;
export const getMap: getMapType = ({ mapSize, mapSettings = {} }) => {
  const map = renderWalls(mapSize, mapSettings);

  addWater(map, mapSettings);
  return map;
};

type createRoomsPropsType = { map: MapType; mapSettings: MapSettingsType };
type createRoomsType = (props: createRoomsPropsType) => void;
const createRooms: createRoomsType = ({ map, mapSettings }) => {
  const mapWidth = map[0].length;
  const mapHeight = map.length;
  // TODO: add some wages for rooms :)
  const amountOfRooms = mapSettings.amountOfRooms || rollDice(2, 15);
  // const amountOfRooms = 4;
  const rooms: RoomsType = [];
  for (let i = 0; i < amountOfRooms; i++) {
    // TODO: add some wages for rooms :)
    // const width = rollDice(2, mapWidth - 2);
    // const height = rollDice(2, mapHeight - 2);
    let roomFromSettings: Partial<RoomType> = {};
    if (mapSettings.rooms && mapSettings.rooms[i]) {
      roomFromSettings = mapSettings.rooms[i];
    }
    const width = roomFromSettings.width || rollDice(3, 7);
    const height = roomFromSettings.height || rollDice(3, 7);
    const findCenterX =
      roomFromSettings.centerX || rollDice(Math.ceil(width / 2) + 1, mapWidth - Math.floor(width / 2) - 2);
    const findCenterY =
      roomFromSettings.centerY || rollDice(Math.ceil(height / 2) + 1, mapHeight - Math.floor(height / 2) - 2);

    rooms.push({ findCenterX, findCenterY, height, pathWith: [], width });
    // console.log("mapWidth", mapWidth, "mapHeight", mapHeight);
    // console.log("findCenterX", findCenterX, "findCenterY", findCenterY);
    // console.log("width", width, "height", height);
    let startX, startY;

    try {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          startY = findCenterY - Math.floor(height / 2) + y;
          startX = findCenterX - Math.floor(width / 2) + x;
          // console.log("startY", startY, "startX", startX);
          map[startY][startX] = new TileModel({ blocking: false, id: `${startY}-${startX}`, type: TYPES.ROOM });
        }
      }
    } catch (e) {
      console.log('ERROR');
      console.log('mapWidth', mapWidth, 'mapHeight', mapHeight);
      console.log('findCenterX', findCenterX, 'findCenterY', findCenterY);
      console.log('width', width, 'height', height);
      console.log('startX', startX, 'ERROR startY', startY);
    }
  }

  rooms.forEach((room, currentId) => {
    let nearestRoomId = 0;
    let pathLength = 0;
    rooms.forEach((otherRoom, otherId) => {
      const currentPathLength = Math.abs(
        room.findCenterX + room.findCenterY - otherRoom.findCenterY - otherRoom.findCenterX,
      );

      if (!pathLength || currentPathLength < pathLength) {
        pathLength = currentPathLength;
        nearestRoomId = otherId;
      }
    });
    if (nearestRoomId) {
      room.pathWith.push(nearestRoomId);
      rooms[nearestRoomId].pathWith.push(currentId);
      createPath({ map, otherRoom: rooms[nearestRoomId], room });
    }

    if (rooms[currentId + 1]) {
      room.pathWith.push(currentId + 1);
      rooms[currentId + 1].pathWith.push(currentId);
      createPath({ map, otherRoom: rooms[currentId + 1], room });
    } else {
      room.pathWith.push(0);
      rooms[0].pathWith.push(currentId);
      createPath({ map, otherRoom: rooms[0], room });
    }
  });
};

type createPathPropsType = { room: RoomType; otherRoom: RoomType; map: MapType };
const createPath = ({ room, otherRoom, map }: createPathPropsType) => {
  const yL = 0;
  const xL = 0;
  let latestY = 0;
  for (let y = 0; y <= Math.abs(room.findCenterY - otherRoom.findCenterY); y++) {
    if (room.findCenterY - otherRoom.findCenterY < 0) {
      const newY = room.findCenterY + y - yL;
      if (map[newY][room.findCenterX].type !== TYPES.ROOM) {
        map[newY][room.findCenterX] = new TileModel({
          blocking: false,
          id: `${newY}-${room.findCenterX}`,
          type: TYPES.GRASS,
        });
      }
      latestY = newY;
    } else {
      const newY = room.findCenterY - y - yL;
      if (map[newY][room.findCenterX].type !== TYPES.ROOM) {
        map[newY][room.findCenterX] = new TileModel({
          blocking: false,
          id: `${newY}-${room.findCenterX}`,
          type: TYPES.GRASS,
        });
      }
      latestY = newY;
    }
  }
  for (let x = 0; x <= Math.abs(room.findCenterX - otherRoom.findCenterX); x++) {
    const newX = room.findCenterX + x - xL;
    if (room.findCenterX - otherRoom.findCenterX < 0) {
      if (map[latestY][newX].type !== TYPES.ROOM) {
        map[latestY][newX] = new TileModel({ blocking: false, id: `${latestY}-${newX}`, type: TYPES.GRASS });
      }
    } else {
      const newX = room.findCenterX - x - xL;
      if (map[latestY][newX].type !== TYPES.ROOM) {
        map[latestY][newX] = new TileModel({ blocking: false, id: `${latestY}-${newX}`, type: TYPES.GRASS });
      }
    }
  }
};

export default getMap;
