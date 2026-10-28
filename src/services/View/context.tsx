import React, { useContext, useMemo, useReducer } from 'react';

export enum VIEW_CONTEXT {
  MENU,
  ROUGELIKE,
  ARITHMETIC,
  SNAKE,
  MEMORY,
}
type StateType = {
  isViewMenu: boolean;
  isViewRougelike: boolean;
  isViewArithmetic: boolean;
  isViewSnake: boolean;
  isViewMemory: boolean;
  view: VIEW_CONTEXT;
};

const initialState: StateType = {
  isViewMenu: true,
  isViewRougelike: false,
  isViewArithmetic: false,
  isViewSnake: false,
  isViewMemory: false,
  view: VIEW_CONTEXT.MENU,
};
type Action =
  | { type: 'setViewMenu' }
  | { type: 'setViewRougelike' }
  | { type: 'setViewArithmetic' }
  | { type: 'setViewSnake' }
  | { type: 'setViewMemory' };
type Dispatch = (action: Action) => void;
const ViewContext = React.createContext<{ state: StateType; dispatch: Dispatch } | undefined>(undefined);

type ProviderProps = {
  children?: React.ReactNode;
  value?: typeof initialState;
};

function getNewView(view: VIEW_CONTEXT) {
  return {
    isViewMenu: view === VIEW_CONTEXT.MENU,
    isViewRougelike: view === VIEW_CONTEXT.ROUGELIKE,
    isViewArithmetic: view === VIEW_CONTEXT.ARITHMETIC,
    isViewSnake: view === VIEW_CONTEXT.SNAKE,
    isViewMemory: view === VIEW_CONTEXT.MEMORY,
    view,
  };
}

function viewReducer(state: StateType, action: Action) {
  switch (action.type) {
    case 'setViewMenu': {
      return { ...state, ...getNewView(VIEW_CONTEXT.MENU) };
    }
    case 'setViewRougelike': {
      return { ...state, ...getNewView(VIEW_CONTEXT.ROUGELIKE) };
    }
    case 'setViewArithmetic': {
      return { ...state, ...getNewView(VIEW_CONTEXT.ARITHMETIC) };
    }
    case 'setViewSnake': {
      return { ...state, ...getNewView(VIEW_CONTEXT.SNAKE) };
    }
    case 'setViewMemory': {
      return { ...state, ...getNewView(VIEW_CONTEXT.MEMORY) };
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

export const ViewProvider = ({ children, value = initialState }: ProviderProps) => {
  const [state, dispatch] = useReducer(viewReducer, value);

  return useMemo(
    () => <ViewContext.Provider value={{ dispatch, state }}>{children}</ViewContext.Provider>,
    [children, state],
  );
};

export const useViewContext = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useViewContext must be used within a ViewProvider');
  }
  const { state } = context;
  return useMemo(() => state, [state]);
};

export const useViewActions = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useViewActions must be used within a ViewProvider');
  }
  const { dispatch } = context;
  return useMemo(
    () => ({
      setViewMenu: () => dispatch({ type: 'setViewMenu' }),
      setViewRougelike: () => dispatch({ type: 'setViewRougelike' }),
      setViewArithmetic: () => dispatch({ type: 'setViewArithmetic' }),
      setViewSnake: () => dispatch({ type: 'setViewSnake' }),
      setViewMemory: () => dispatch({ type: 'setViewMemory' }),
    }),
    [dispatch],
  );
};
// TODO: ADD SOME SELECTOR
