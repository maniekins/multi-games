import React, { FunctionComponent, useMemo, useState } from 'react';
import { KeyboardProvider } from '../../services/Keyboard';
import { useViewActions } from '../../services/View';
import './Game.css';
import Options from './Options';

import Render from './Render';

type GameProps = {
  children?: React.ReactNode;
};

const Game: FunctionComponent<GameProps> = () => {
  const { setViewMenu } = useViewActions();
  const [showGame, setShowGame] = useState(false);

  return useMemo(
    () => (
      <div>
        <div className="Game">
          <button onClick={setViewMenu}>BACK TO MENU</button>
          <button onClick={() => setShowGame((prev) => !prev)}>{`${
            showGame ? 'BACK TO OPTIONS' : 'SHOW GAME'
          }`}</button>

          {showGame ? (
            <KeyboardProvider>
              <Render />
            </KeyboardProvider>
          ) : (
            <Options />
          )}
        </div>
      </div>
    ),
    [setViewMenu, showGame],
  );
};

export default React.memo(Game);
