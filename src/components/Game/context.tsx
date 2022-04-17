import React, { useContext } from 'react';

type InitialStateType = {
  something: boolean;
};

const initialState: InitialStateType = {
  something: false,
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
