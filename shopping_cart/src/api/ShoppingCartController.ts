import { Request, Response, Router } from 'express';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { SaveShoppingCartService } from '../application/SaveShoppingCartService';

export function ShoppingCartController(
  getSummaryService: GetShoppingCartSummaryService,
  saveCartService: SaveShoppingCartService
): Router {
  const router = Router();

  router.get('/:cartId', async (req: Request, res: Response) => {
    const summary = await getSummaryService.execute(req.params.cartId);
    res.json(summary);
  });

  router.post('/:cartId', async (req: Request, res: Response) => {
    await saveCartService.execute(req.params.cartId, req.body.products);
    res.status(200).send();
  });

  return router;
} 