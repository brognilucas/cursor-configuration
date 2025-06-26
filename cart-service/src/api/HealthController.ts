import { Request, Response, Router } from 'express';

export function HealthController(): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'cart-service'
    };
    
    res.json(healthStatus);
  });

  return router;
} 