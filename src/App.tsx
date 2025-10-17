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

const webSocket = new WebSocket('ws://localhost:443/');
webSocket.onmessage = (event) => {
  console.log(event);
};
webSocket.addEventListener('open', () => {
  console.log('We are connected');
});
function sendMessage(event?: Event) {
  webSocket.send('test');
  event?.preventDefault();
}

setTimeout(() => {
  sendMessage();
}, 4000);

export default App;
