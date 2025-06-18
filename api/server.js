const { Server } = require('boardgame.io/server');
const { KingzGame } = require('../src/game/KingzGame.js');

const server = Server({
  games: [KingzGame],
});

module.exports = async function handler(req, res) {
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