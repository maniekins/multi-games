import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useKeyboardContext } from '../../../../services/Keyboard';
import { Player } from '../../Models/Components';
import { Location, MapType } from '../../types';
import { changeObjectLocation } from '../util';

type Props = {
  map: MapType;
  modelSize: number;
  startedLocation?: Location;
};

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
  const [intervalBetweenMoves, setTT] = useState(false);
  const reference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!intervalBetweenMoves && keyPressed.pressed()) {
      setTT(true);
      setTimeout(() => {
        setTT(false);
        // HERE WE HAVE A SPEED
      }, 100);

      changeObjectLocation(location, map, setLocation, keyPressed);
    }

    // Changing location trigger this all the time :/ gmm need to use something better :)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyPressed, intervalBetweenMoves]);

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
