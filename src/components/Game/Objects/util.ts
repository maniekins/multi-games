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
    if (isLocationChanged(newLocation, location) && !map[newLocation.positionY][newLocation.positionX].blocking) {
      setLocation(newLocation);

      return true;
    }
    return false;
  };
  const newLocation = { ...location };
  if (whereWeGo.leftDown()) {
    newLocation.positionY += 1;
    newLocation.positionX -= 1;
    if (!changeLocation(newLocation)) {
      const newLocation1 = { ...location };
      newLocation1.positionY += 1;
      if (!changeLocation(newLocation1)) {
        const newLocation2 = { ...location };
        newLocation2.positionX -= 1;
        !changeLocation(newLocation2);
      }
    }
  } else if (whereWeGo.leftUp()) {
    newLocation.positionY -= 1;
    newLocation.positionX -= 1;
    if (!changeLocation(newLocation)) {
      const newLocation1 = { ...location };
      newLocation1.positionY -= 1;
      if (!changeLocation(newLocation1)) {
        const newLocation2 = { ...location };
        newLocation2.positionX -= 1;
        !changeLocation(newLocation2);
      }
    }
  } else if (whereWeGo.rightDown()) {
    newLocation.positionY += 1;
    newLocation.positionX += 1;
    if (!changeLocation(newLocation)) {
      const newLocation1 = { ...location };
      newLocation1.positionY += 1;
      if (!changeLocation(newLocation1)) {
        const newLocation2 = { ...location };
        newLocation2.positionX += 1;
        !changeLocation(newLocation2);
      }
    }
  } else if (whereWeGo.rightUp()) {
    newLocation.positionY -= 1;
    newLocation.positionX += 1;
    if (!changeLocation(newLocation)) {
      const newLocation1 = { ...location };
      newLocation1.positionY -= 1;
      if (!changeLocation(newLocation1)) {
        const newLocation2 = { ...location };
        newLocation2.positionX += 1;
        !changeLocation(newLocation2);
      }
    }
  } else if (whereWeGo.up()) {
    newLocation.positionY -= 1;
    changeLocation(newLocation);
  } else if (whereWeGo.down()) {
    newLocation.positionY += 1;
    changeLocation(newLocation);
  } else if (whereWeGo.left()) {
    newLocation.positionX -= 1;
    changeLocation(newLocation);
  } else if (whereWeGo.right()) {
    newLocation.positionX += 1;
    changeLocation(newLocation);
  }
};
