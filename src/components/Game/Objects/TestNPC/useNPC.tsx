import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NPC } from '../../Models/Components';
import { Location, MapType } from '../../types';
import { DIRECTIONS, KeyPressed, KeysPressed } from '../../../../commons/Keyboard';
import { rollDice } from '../../../../utils';
import { changeObjectLocation } from '../util';

type Props = {
  map: MapType;
  modelSize: number;
  startedLocation?: Location;
};

export const useNPC = ({
  map,
  modelSize,
  startedLocation = {
    positionX: 0,
    positionY: 0,
  },
}: Props) => {
  const [location, setLocation] = useState(startedLocation);
  // const [tt, setTT] = useState(false);

  const calculateNewDirection = useCallback(() => {
    const whichDirection = rollDice(1, 8);
    switch (whichDirection) {
      case 1:
        return new KeysPressed([new KeyPressed(DIRECTIONS.UP)]);
      case 2:
        return new KeysPressed([new KeyPressed(DIRECTIONS.DOWN)]);
      case 3:
        return new KeysPressed([new KeyPressed(DIRECTIONS.LEFT)]);
      case 4:
        return new KeysPressed([new KeyPressed(DIRECTIONS.RIGHT)]);
      case 5:
        return new KeysPressed([new KeyPressed(DIRECTIONS.LEFT_UP)]);
      case 6:
        return new KeysPressed([new KeyPressed(DIRECTIONS.LEFT_DOWN)]);
      case 7:
        return new KeysPressed([new KeyPressed(DIRECTIONS.RIGHT_UP)]);
      case 8:
        return new KeysPressed([new KeyPressed(DIRECTIONS.RIGHT_DOWN)]);
    }
    return new KeysPressed([]);
  }, []);

  const [inter, setInter] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setInter(Date.now());
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const whereWeGo = calculateNewDirection();

    changeObjectLocation(location, map, setLocation, whereWeGo);
    // Changing location trigger this all the time :/ gmm need to use something better :)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculateNewDirection, map, inter]);

  useEffect(() => {
    console.log('npc changed');
  }, [location]);

  return useMemo(
    () => ({
      component: <NPC modelSize={modelSize} />,
      location,
    }),
    [location, modelSize],
  );
};
