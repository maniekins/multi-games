import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { KeyboardProvider } from '../../services/Keyboard';
import { useViewActions } from '../../services/View';
import './Game.css';
import Options from './Options';

import Render from './Render';
import { ObjContext } from '../../services/Game/contextExperiment';
import Options2 from './Options2';
import Options3 from './Options3';
import OptionsInt from './OptionsInt';

type GameProps = {
  children?: React.ReactNode;
};

const Game: FunctionComponent<GameProps> = () => {
  const { setViewMenu } = useViewActions();
  const [showGame, setShowGame] = useState(false);
  useEffect(() => {
    setInterval(() => {
      ObjContext.setSomeVal('bla' + Date.now());
    }, 1000);
  }, []);

  console.log('rerender Game');
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
            <>
              <Options />
              <Options2 />
              <Options3 />
              <OptionsInt />
            </>
          )}
        </div>
      </div>
    ),
    [setViewMenu, showGame],
  );
};

export default React.memo(Game);
