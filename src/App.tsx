import React, { useMemo } from 'react';
import './App.css';
import Container from './components/Container';
import Providers from './Providers';

function App() {
  return useMemo(
    () => (
      <div className="App">
        <Providers>
          <Container />
        </Providers>
      </div>
    ),
    [],
  );
}

export default App;
