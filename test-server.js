import { Server } from 'boardgame.io/dist/cjs/server.js';
import { KingzGame } from './src/game/KingzGame.js';

const server = Server({
  games: [KingzGame],
  origins: ['http://localhost:1234', 'https://territor-io.vercel.app', 'https://territor-42t2jzqwf-pimvandenbergs-projects.vercel.app']
});

console.log('Server created successfully!');
console.log('Games:', server.games);
console.log('Origins:', server.origins);

// Test the server callback
const serverCallback = server.app.callback();
console.log('Server callback created successfully!');

console.log('✅ Server test passed!'); 