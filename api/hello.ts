import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle different API routes
  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  if (pathname === '/api/hello') {
    res.status(200).json({
      message: 'Hello World from Koa API!',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (pathname === '/api/health') {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Default response for unknown routes
  res.status(404).json({ error: 'Not found' });
} 