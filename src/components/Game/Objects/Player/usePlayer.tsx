import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useKeyboardContext } from '../../../../services/Keyboard';
import { Player } from '../../Models/Components';
import { Location, MapType } from '../../types';

type Props = {
  map: MapType;
  modelSize: number;
  startedLocation?: Location;
};

const isLocationChanged = (loc1: Location, loc2: Location) =>
  loc1.positionX !== loc2.positionX || loc1.positionY !== loc2.positionY;

export const usePlayer = ({
  map,
  modelSize,
  startedLocation = {
    positionX: 0,
    positionY: 0,
  },
}: Props) => {
  const { keyPressed } = useKeyboardContext();
  const [location, setLocation] = useState(startedLocation);
  const [tt, setTT] = useState(false);
  const reference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // let timeoutScroll: NodeJS.Timeout;
    if (!tt && keyPressed.pressed()) {
      setTT(true);
      setTimeout(() => {
        setTT(false);
      }, 100);
      const newLocation = { ...location };
      keyPressed.up() && (newLocation.positionY -= 1);
      keyPressed.down() && (newLocation.positionY += 1);
      keyPressed.left() && (newLocation.positionX -= 1);
      keyPressed.right() && (newLocation.positionX += 1);
      if (isLocationChanged(newLocation, location) && !map[newLocation.positionY][newLocation.positionX].blocking) {
        setLocation(newLocation);

        // scroll window
        setTimeout(() => {
          reference.current?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        }, 100);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyPressed, tt]);

  useEffect(() => {
    console.log('location changed');
  }, [location]);

  return useMemo(
    () => ({
      component: <Player modelSize={modelSize} elementRef={reference} />,
      location,
    }),
    [location, modelSize],
  );
};
