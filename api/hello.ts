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

export default app; 