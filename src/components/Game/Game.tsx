import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
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

  const startGame = useCallback(() => setShowGame(true), []);

  return useMemo(
    () => (
      <main className="Game">
        <nav className="Game__toolbar" aria-label="Menu roguelike'a">
          <button className="Game__button" type="button" onClick={setViewMenu}>
            ← Wróć do menu
          </button>
          {showGame && (
            <button className="Game__button Game__button--primary" type="button" onClick={() => setShowGame(false)}>
              Ustawienia
            </button>
          )}
        </nav>

        {showGame ? (
          <KeyboardProvider>
            <div className="Game__render-viewport">
              <Render />
            </div>
          </KeyboardProvider>
        ) : (
          <Options onStart={startGame} />
        )}
      </main>
    ),
    [setViewMenu, showGame, startGame],
  );
};

export default React.memo(Game);
