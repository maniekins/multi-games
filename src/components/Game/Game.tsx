import React, { FunctionComponent, useEffect, useState } from 'react';
import { KeyboardProvider, useKeyboardContext } from '../../services/Keyboard';
import { getRandomIntInclusive } from '../../utils';
import './Game.css';
import TestNPC from './Objects/TestNPC/TestNPC';

type GameProps = {
  children?: React.ReactNode;
};

type GameProviderProps = {
  children?: React.ReactNode;
};

const Game: FunctionComponent<GameProps> = ({ children }) => {
  const x = useKeyboardContext();

  useEffect(() => {
    console.log('x', Date.now());
  }, [x]);
  const [xc] = useState(() => {
    const x = new Array(100);
    x.fill('');
    return x;
  });

  return (
    <div className="Game">
      <TestNPC />
      {xc.map((_, i) => (
        <TestNPC
          key={i}
          startedLocation={{ left: getRandomIntInclusive(10, 1000), top: getRandomIntInclusive(10, 500) }}
        />
      ))}
      {children}
    </div>
  );
};
const MemoGame = React.memo(Game);

const GameWithProvider: React.FC<GameProviderProps> = ({ children }) => {
  return (
    <KeyboardProvider>
      <MemoGame>{children}</MemoGame>
    </KeyboardProvider>
  );
};

export default React.memo(GameWithProvider);
