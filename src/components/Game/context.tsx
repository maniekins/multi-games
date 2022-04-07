import React, { useContext } from 'react';
import { KeysPressed } from '../../commons/Keyboard';

type InitialStateType = {
  keyPressed: KeysPressed;
};

const initialState: InitialStateType = {
  keyPressed: new KeysPressed([]),
};
const GameContext = React.createContext(initialState);

type ProviderProps = {
  children?: React.ReactNode;
  value: typeof initialState;
};
export const GameProvider: React.FC<ProviderProps> = ({ children, value }) => (
  <GameContext.Provider value={value}>{children}</GameContext.Provider>
);

export const useGameContext = () => {
  return useContext(GameContext);
};
