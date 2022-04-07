import React, { useCallback, useState } from 'react';
import useKeyboardController, { KeysPressed, mapKeys } from '../../commons/Keyboard';
import { GameProvider } from './context';
import './Game.css';
import TestNPC from './Objects/TestNPC/TestNPC';

type GameProps = {
  children?: React.ReactNode;
};

type GameProviderProps = {
  children?: React.ReactNode;
};

const Game: React.FC<GameProps> = ({ children }) => {
  // const x = useGameContext();
  // console.log('Game context', x);
  return (
    <div className="Game">
      <TestNPC />
      {children}
    </div>
  );
};
const MemoGame = React.memo(Game);

const GameWithProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [keyPressed, setKeyPressed] = useState<KeysPressed>(new KeysPressed([]));

  const keyboardCallback = useCallback(({ keys }) => {
    setKeyPressed(mapKeys(keys, { arrows: true }));
  }, []);
  useKeyboardController(keyboardCallback, 200);

  return (
    <GameProvider value={{ keyPressed }}>
      <MemoGame>{children}</MemoGame>
    </GameProvider>
  );
};

export default React.memo(GameWithProvider);
