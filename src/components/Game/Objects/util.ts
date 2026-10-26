import React from 'react';
import { KeysPressed } from '../../../commons/Keyboard';
import { Location, MapType } from '../types';

const isLocationChanged = (loc1: Location, loc2: Location) =>
  loc1.positionX !== loc2.positionX || loc1.positionY !== loc2.positionY;

export const changeObjectLocation = (
  location: Location,
  map: MapType,
  setLocation: React.Dispatch<React.SetStateAction<Location>>,
  whereWeGo: KeysPressed,
) => {
  const changeLocation = (newLocation: Location) => {
    const row = map[newLocation.positionY];
    const tile = row?.[newLocation.positionX];

    if (tile && isLocationChanged(newLocation, location) && !tile.blocking) {
      setLocation(newLocation);

      return true;
    }
    return false;
  };

  const tryMove = (deltaX: number, deltaY: number) =>
    changeLocation({
      positionX: location.positionX + deltaX,
      positionY: location.positionY + deltaY,
    });

  if (whereWeGo.leftDown()) {
    if (!tryMove(-1, 1) && !tryMove(0, 1)) tryMove(-1, 0);
  } else if (whereWeGo.leftUp()) {
    if (!tryMove(-1, -1) && !tryMove(0, -1)) tryMove(-1, 0);
  } else if (whereWeGo.rightDown()) {
    if (!tryMove(1, 1) && !tryMove(0, 1)) tryMove(1, 0);
  } else if (whereWeGo.rightUp()) {
    if (!tryMove(1, -1) && !tryMove(0, -1)) tryMove(1, 0);
  } else if (whereWeGo.up()) {
    tryMove(0, -1);
  } else if (whereWeGo.down()) {
    tryMove(0, 1);
  } else if (whereWeGo.left()) {
    tryMove(-1, 0);
  } else if (whereWeGo.right()) {
    tryMove(1, 0);
  }
};
