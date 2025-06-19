# Vercel Koa React App

A simple TypeScript application with a Koa backend and React frontend, designed to deploy on Vercel without errors.

## Features

- ✅ **Koa Backend** - Simple API endpoints in TypeScript
- ✅ **React Frontend** - Modern React with TypeScript
- ✅ **Vercel Ready** - Configured for seamless deployment
- ✅ **TypeScript** - Full type safety for both frontend and backend
- ✅ **Hello World** - Simple, working example

## Project Structure

```
├── api/
│   └── hello.ts          # Koa API endpoints
├── src/
│   ├── App.tsx           # Main React component
│   ├── main.tsx          # React entry point
│   └── index.html        # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment config
└── vite.config.ts        # Vite build configuration
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

```bash
npm run dev
```

This will start the Vercel development server which handles both frontend and backend.

### 3. Build for Production

```bash
npm run build
```

### 4. Deploy to Vercel

```bash
vercel
```

## API Endpoints

- `GET /api/hello` - Returns a hello world message
- `GET /api/health` - Health check endpoint

## Local Development

The app uses Vercel's development server which automatically:
- Serves the React frontend on port 3000
- Handles API routes from the `/api` directory
- Provides hot reloading for both frontend and backend

## Deployment

This app is configured to deploy seamlessly on Vercel:

1. **Backend**: API routes in `/api` are automatically deployed as serverless functions
2. **Frontend**: React app is built and served as static files
3. **Routing**: Vercel handles routing between API and frontend

## Technologies Used

- **Backend**: Koa.js with TypeScript
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Language**: TypeScript throughout

## Next Steps

This is a minimal working example. You can extend it by:

1. Adding more API endpoints in `/api`
2. Creating additional React components
3. Adding a database (e.g., Vercel Postgres)
4. Implementing authentication
5. Adding more complex frontend features

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Check that TypeScript compilation works: `npm run type-check`
3. Verify the build process: `npm run build`
4. For deployment issues, check the Vercel logs in your dashboard 