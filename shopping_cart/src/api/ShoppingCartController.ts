import { Request, Response, Router } from 'express';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';

export function ShoppingCartController(service: GetShoppingCartSummaryService): Router {
  const router = Router();

  router.get('/:cartId', async (req: Request, res: Response) => {
    const summary = await service.execute(req.params.cartId);
    res.json(summary);
  });

  return router;
} 