import React, { useCallback, useContext, useState } from 'react';
import useKeyboardController, { KeysPressed, mapKeys } from '../../commons/Keyboard';

type InitialStateType = {
  keyPressed: KeysPressed;
};

const initialState: InitialStateType = {
  keyPressed: new KeysPressed([]),
};
const KeyboardContext = React.createContext(initialState);

type ProviderProps = {
  children?: React.ReactNode;
  // value: typeof initialState;
};
export const KeyboardProvider: React.FC<ProviderProps> = ({ children }) => {
  const [keyPressed, setKeyPressed] = useState<KeysPressed>(new KeysPressed([]));

  const keyboardCallback = useCallback(({ keys }) => {
    setKeyPressed(mapKeys(keys, { arrows: true }));
  }, []);

  useKeyboardController(keyboardCallback, 10);

  return <KeyboardContext.Provider value={{ keyPressed }}>{children}</KeyboardContext.Provider>;
};

export const useKeyboardContext = () => {
  return useContext(KeyboardContext);
};
