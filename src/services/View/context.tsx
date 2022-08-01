import React, { useContext, useMemo, useReducer } from 'react';

export enum VIEW_CONTEXT {
  'MENU',
  'ROUGELIKE',
}
type StateType = {
  isViewMenu: boolean;
  isViewRougelike: boolean;
  view: VIEW_CONTEXT;
};

const initialState: StateType = {
  isViewMenu: true,
  isViewRougelike: false,
  view: VIEW_CONTEXT.MENU,
};
type Action = { type: 'setViewMenu' } | { type: 'setViewRougelike' };
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
    }),
    [dispatch],
  );
};
// TODO: ADD SOME SELECTOR
