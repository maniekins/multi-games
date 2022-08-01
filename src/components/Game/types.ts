import TileModel from './Models/Tile';

export type MapSizeType = {
  height: number;
  width: number;
};

export type RoomType = {
  centerX?: number; // TODO: why
  centerY?: number;
  height: number;
  width: number;
  findCenterX: number;
  findCenterY: number;
  pathWith: number[];
};

export type InitialRoomType = {
  centerX: number;
  centerY: number;
  height: number;
  width: number;
};

export type InitialWaterType = {
  centerX: number;
  centerY: number;
  height: number;
  width: number;
};

export type MapSettingsType = {
  amountOfRooms?: number;
  rooms?: InitialRoomType[];
  water?: InitialWaterType[];
};

export type MapType = TileModel[][];

export type RoomsType = RoomType[];

export type Location = {
  positionX: number;
  positionY: number;
};
