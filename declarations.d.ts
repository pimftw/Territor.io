declare module '*.scss';
declare module 'boardgame.io/dist/cjs/server.js' {
  export function Server(config: any): any;
}
declare module 'boardgame.io/dist/cjs/core.js' {
  export const INVALID_MOVE: any;
}
declare module 'koa-mount' {
  const mount: any;
  export default mount;
} 