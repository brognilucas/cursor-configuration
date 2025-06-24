import { Request, Response, Router } from 'express';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { SaveShoppingCartService } from '../application/SaveShoppingCartService';
import { AddItemToShoppingCartService } from '../application/AddItemToShoppingCartService';
import { SaveShoppingCartInput } from '../dto/SaveShoppingCartInput';
import { ProductInput } from '../dto/ProductInput';

export function ShoppingCartController(
  getSummaryService: GetShoppingCartSummaryService,
  saveCartService: SaveShoppingCartService,
  addItemService: AddItemToShoppingCartService
): Router {
  const router = Router();

  router.get('/:cartId', async (req: Request, res: Response) => {
    const summary = await getSummaryService.execute(req.params.cartId);
    res.json(summary);
  });

  router.post('/:cartId', async (req: Request, res: Response) => {
    const input: SaveShoppingCartInput = req.body;
    await saveCartService.execute(req.params.cartId, input);
    res.status(200).send();
  });

  router.post('/:cartId/items', async (req: Request, res: Response) => {
    const product: ProductInput = req.body;
    await addItemService.execute(req.params.cartId, product);
    res.status(200).send();
  });

  return router;
} 