import React from 'react';
import { createRoot } from 'react-dom/client';
import { Client } from 'boardgame.io/react';
import { Lobby } from 'boardgame.io/react';
import { KingzGame } from './game/KingzGame';
import { KingzBoard } from './components/KingzBoard';
import './styles/main.scss';

const KingzClient = Client({
  game: KingzGame,
  board: KingzBoard,
  debug: false,
});

const App = () => {
  // Get the current hostname and port for dynamic server configuration
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port || (protocol === 'https:' ? '443' : '80');
  const serverUrl = `${protocol}//${hostname}:${port}`;

  return (
    <div className="app">
      <Lobby
        gameServer={serverUrl}
        lobbyServer={serverUrl}
        gameComponents={[{ game: KingzGame, board: KingzBoard }]}
      />
    </div>
  );
};

// Start the app
const root = createRoot(document.getElementById('root'));
root.render(<App />); 