import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { useGameActions, useGameContext } from '../../services/Game';
import './Options.css';

const Options: FunctionComponent = () => {
  const { setMapVision } = useGameActions();
  const { mapVision } = useGameContext();

  const handleMapVision = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setMapVision(+evt.target.value);
    },
    [setMapVision],
  );

  return useMemo(
    () => (
      <div className="Game_Options">
        <label>Map Vision: </label>
        <input value={mapVision} onChange={handleMapVision} type="number" />
      </div>
    ),
    [handleMapVision, mapVision],
  );
};

export default React.memo(Options);
