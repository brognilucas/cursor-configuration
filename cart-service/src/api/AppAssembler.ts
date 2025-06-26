import express from 'express';
import cors from 'cors';

export interface RouteConfig {
  path: string;
  router: express.Router;
}

export function assembleApp(routes: RouteConfig[]): express.Express {
  const app = express();
  
  // Common middleware
  app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  app.use(express.json());
  
  // Mount routes
  routes.forEach(({ path, router }) => {
    app.use(path, router);
  });
  
  return app;
} 