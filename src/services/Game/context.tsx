import React, { useContext, useMemo, useReducer } from 'react';

export const DEFAULT_MAP_WIDTH = 60;
export const DEFAULT_MAP_HEIGHT = 30;
export const DEFAULT_AMOUNT_OF_ROOMS = 3;

export enum KEYBOARD_CONTEXT {
  MENU,
  ROUGELIKE,
}

type StateType = {
  keyboardContext: KEYBOARD_CONTEXT;

  isKeyboardMenu: boolean;
  isKeyboardRougelike: boolean;

  mapVision: number;
  mapWidth: number;
  mapHeight: number;
  amountOfRooms: number;
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
  mapWidth: DEFAULT_MAP_WIDTH,
  mapHeight: DEFAULT_MAP_HEIGHT,
  amountOfRooms: DEFAULT_AMOUNT_OF_ROOMS,
};

type Action =
  | { type: 'setMapVision'; value: number }
  | { type: 'setMapWidth'; value: number }
  | { type: 'setMapHeight'; value: number }
  | { type: 'setAmountOfRooms'; value: number };
type Dispatch = (action: Action) => void;
const GameContext = React.createContext<{ state: StateType; dispatch: Dispatch } | undefined>(undefined);

function gameReducer(state: StateType, action: Action) {
  switch (action.type) {
    case 'setMapVision': {
      return { ...state, mapVision: action.value };
    }
    case 'setMapWidth': {
      return { ...state, mapWidth: action.value };
    }
    case 'setMapHeight': {
      return { ...state, mapHeight: action.value };
    }
    case 'setAmountOfRooms': {
      return { ...state, amountOfRooms: action.value };
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
      setMapWidth: (value: number) => dispatch({ type: 'setMapWidth', value }),
      setMapHeight: (value: number) => dispatch({ type: 'setMapHeight', value }),
      setAmountOfRooms: (value: number) => dispatch({ type: 'setAmountOfRooms', value }),
    }),
    [dispatch],
  );
};
