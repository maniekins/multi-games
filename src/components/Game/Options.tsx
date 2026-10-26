import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { useGameActions, useGameContext } from '../../services/Game';
import './Options.css';

type OptionsProps = {
  onStart: () => void;
};

const clampMapSetting = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.floor(Number.isFinite(value) ? value : min)));

const Options: FunctionComponent<OptionsProps> = ({ onStart }) => {
  const { setMapVision, setMapWidth, setMapHeight, setAmountOfRooms } = useGameActions();
  const { mapVision, mapWidth, mapHeight, amountOfRooms } = useGameContext();

  const handleMapVision = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setMapVision(+evt.target.value);
    },
    [setMapVision],
  );

  const handleMapWidth = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (Number.isFinite(event.currentTarget.valueAsNumber)) {
        setMapWidth(Math.floor(event.currentTarget.valueAsNumber));
      }
    },
    [setMapWidth],
  );
  const handleMapHeight = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (Number.isFinite(event.currentTarget.valueAsNumber)) {
        setMapHeight(Math.floor(event.currentTarget.valueAsNumber));
      }
    },
    [setMapHeight],
  );
  const handleRoomCount = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (Number.isFinite(event.currentTarget.valueAsNumber)) {
        setAmountOfRooms(Math.floor(event.currentTarget.valueAsNumber));
      }
    },
    [setAmountOfRooms],
  );

  // This is only for normalizing the values when the user leaves the input field, so that they are within the allowed range.
  const normalizeMapWidth = useCallback(() => setMapWidth(clampMapSetting(mapWidth, 20, 100)), [mapWidth, setMapWidth]);
  const normalizeMapHeight = useCallback(
    () => setMapHeight(clampMapSetting(mapHeight, 15, 60)),
    [mapHeight, setMapHeight],
  );
  const normalizeRoomCount = useCallback(
    () => setAmountOfRooms(clampMapSetting(amountOfRooms, 1, 15)),
    [amountOfRooms, setAmountOfRooms],
  );

  const startGame = useCallback(() => {
    normalizeMapWidth();
    normalizeMapHeight();
    normalizeRoomCount();
    onStart();
  }, [normalizeMapHeight, normalizeMapWidth, normalizeRoomCount, onStart]);

  return useMemo(
    () => (
      <section className="Game_Options" aria-labelledby="game-options-title">
        <p className="Game_Options__eyebrow">ENTER THE ROGUELIKE</p>
        <h1 id="game-options-title">Ustawienia gry</h1>
        <div className="Game_Options__fields">
          <label htmlFor="map-width">
            Szerokość mapy
            <input
              id="map-width"
              type="number"
              min="20"
              max="100"
              step="1"
              value={mapWidth}
              onChange={handleMapWidth}
              onBlur={normalizeMapWidth}
            />
          </label>
          <label htmlFor="map-height">
            Wysokość mapy
            <input
              id="map-height"
              type="number"
              min="15"
              max="60"
              step="1"
              value={mapHeight}
              onChange={handleMapHeight}
              onBlur={normalizeMapHeight}
            />
          </label>
          <label htmlFor="map-rooms">
            Liczba pokoi
            <input
              id="map-rooms"
              type="number"
              min="1"
              max="15"
              step="1"
              value={amountOfRooms}
              onChange={handleRoomCount}
              onBlur={normalizeRoomCount}
            />
          </label>
          <label htmlFor="map-vision">
            Zasięg widzenia mapy
            <input id="map-vision" value={mapVision} onChange={handleMapVision} type="number" />
          </label>
        </div>
        <button className="Game_Options__start" type="button" onClick={startGame}>
          Pokaż grę
        </button>
      </section>
    ),
    [
      amountOfRooms,
      handleMapHeight,
      handleMapVision,
      handleMapWidth,
      handleRoomCount,
      mapHeight,
      mapVision,
      mapWidth,
      normalizeMapHeight,
      normalizeMapWidth,
      normalizeRoomCount,
      startGame,
    ],
  );
};

export default React.memo(Options);
