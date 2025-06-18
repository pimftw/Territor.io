import { Server } from 'boardgame.io/dist/cjs/server.js';
import { KingzGame } from '../src/game/KingzGame.js';

const server = Server({
  games: [KingzGame],
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Forward the request to the boardgame.io server
  const serverCallback = server.app.callback();
  await new Promise((resolve, reject) => {
    serverCallback(req, res);
    resolve();
  });
} 