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

const App: React.FC = () => {
  // Get the current hostname and port for dynamic server configuration
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const isProduction = hostname.includes('vercel.app');
  const serverUrl = isProduction
    ? `${protocol}//${hostname}/api`  // Use /api path in production
    : `${protocol}//${hostname}:8000`; // Use port 8000 in development

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
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} 