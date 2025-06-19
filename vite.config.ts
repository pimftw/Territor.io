import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';
import path from 'path';

// Custom plugin to handle API routes
function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      // Handle API routes
      server.middlewares.use('/api', async (req, res, next) => {
        try {
          // For now, let's create a simple API response
          if (req.url === '/hello' || req.url === '/hello/') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              message: 'Hello World from Koa API!',
              timestamp: new Date().toISOString()
            }));
            return;
          }
          if (req.url === '/health' || req.url === '/health/') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              status: 'ok',
              timestamp: new Date().toISOString()
            }));
            return;
          }
          next();
        } catch (error) {
          next(error);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
}); 