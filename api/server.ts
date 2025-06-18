import { Server } from 'boardgame.io/dist/cjs/server.js';
import { KingzGame } from '../src/game/KingzGame';
import type { Request, Response } from 'express';

const server = Server({
  games: [KingzGame],
  origins: ['http://localhost:1234', 'https://territor-io.vercel.app', 'https://territor-42t2jzqwf-pimvandenbergs-projects.vercel.app']
});

export default async function handler(req: Request, res: Response) {
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
  await new Promise<void>((resolve, reject) => {
    serverCallback(req, res);
    resolve();
  });
}

// Allow running this file directly for local debugging
if (import.meta.url === `file://${process.argv[1]}`) {
  const http = await import('http');
  
  const server = http.createServer((req: any, res: any) => {
    handler(req, res);
  });

  server.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
  });
} 