import React, { FunctionComponent } from 'react';
import { GameProvider } from './services/Game';
// import { KeyboardProvider } from './services/Keyboard';
import { ViewProvider } from './services/View';

type ProvidersProps = {
  children?: React.ReactNode;
};

const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
  // const providers = useMemo(() => [KeyboardProvider, GameProvider, ViewProvider], []);
  return (
    // <KeyboardProvider>
    <GameProvider>
      <ViewProvider>{children}</ViewProvider>
    </GameProvider>
    // </KeyboardProvider>
  );
  // return useMemo(() => providers.map((Provider, idx) => <Provider key={idx} />), [providers]);
};

export default React.memo(Providers);
