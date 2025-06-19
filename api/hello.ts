import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa-cors';

const app = new Koa();
const router = new Router();

// Enable CORS
app.use(cors());

// Hello world endpoint
router.get('/api/hello', async (ctx: Koa.Context) => {
  ctx.body = {
    message: 'Hello World from Koa API!',
    timestamp: new Date().toISOString()
  };
});

// Health check endpoint
router.get('/api/health', async (ctx: Koa.Context) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString()
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Start server if this file is run directly
if (require.main === module) {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`🚀 Koa API server running on http://localhost:${port}`);
    console.log(`📡 API endpoints:`);
    console.log(`   GET http://localhost:${port}/api/hello`);
    console.log(`   GET http://localhost:${port}/api/health`);
  });
}

export default app; 