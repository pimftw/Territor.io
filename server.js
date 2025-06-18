import { Server } from 'boardgame.io/server';
import { KingzGame } from './src/game/KingzGame.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Create boardgame.io server
const server = Server({
  games: [KingzGame],
});

// Mount boardgame.io server
app.use('/games', server.app);

// Serve the main app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Kingz.io server running on port ${PORT}`);
  console.log(`Game available at http://localhost:${PORT}`);
  console.log(`Lobby available at http://localhost:${PORT}/games`);
}); 