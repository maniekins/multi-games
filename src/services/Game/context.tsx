import React, { useContext, useMemo, useReducer } from 'react';

export enum KEYBOARD_CONTEXT {
  'MENU',
  'ROUGELIKE',
}

type StateType = {
  keyboardContext: KEYBOARD_CONTEXT;

  isKeyboardMenu: boolean;
  isKeyboardRougelike: boolean;

  mapVision: number;
};

const initialState: StateType = {
  // TODO: need to refactor check view provider
  get isKeyboardMenu() {
    return this.keyboardContext === KEYBOARD_CONTEXT.MENU;
  },
  get isKeyboardRougelike() {
    return this.keyboardContext === KEYBOARD_CONTEXT.ROUGELIKE;
  },

  keyboardContext: KEYBOARD_CONTEXT.MENU,
  mapVision: 0,
};

type Action = { type: 'setMapVision'; value: number };
type Dispatch = (action: Action) => void;
const GameContext = React.createContext<{ state: StateType; dispatch: Dispatch } | undefined>(undefined);

function gameReducer(state: StateType, action: Action) {
  switch (action.type) {
    case 'setMapVision': {
      return { ...state, mapVision: action.value };
    }

    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

type ProviderProps = {
  children?: React.ReactNode;
  value?: typeof initialState;
};

export const GameProvider: React.FC<ProviderProps> = ({ children, value = initialState }) => {
  const [state, dispatch] = useReducer(gameReducer, value);
  return useMemo(
    () => <GameContext.Provider value={{ dispatch, state }}>{children}</GameContext.Provider>,
    [children, state],
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  const { state } = context;
  return useMemo(() => state, [state]);
};

export const useGameActions = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useViewActions must be used within a GameProvider');
  }
  const { dispatch } = context;
  return useMemo(
    () => ({
      setMapVision: (value: number) => dispatch({ type: 'setMapVision', value }),
    }),
    [dispatch],
  );
};
