import { Request, Response, Router } from 'express';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService } from '../application/AddItemToShoppingCartService';
import { ProductInput } from '../dto/ProductInput';
import { CreateCartService } from '../application/CreateCartService';

export function ShoppingCartController(
  getSummaryService: GetShoppingCartSummaryService,
  addItemService: AddItemToShoppingCartService,
  createCartService: CreateCartService
): Router {
  const router = Router();

  router.get('/:cartId', async (req: Request, res: Response) => {
    const summary = await getSummaryService.execute(req.params.cartId);
    res.json(summary);
  });

  router.post('/', async (_req: Request, res: Response) => {
    const cartId = await createCartService.execute();
    res.status(201).json({ cartId });
  });

  router.post('/:cartId/items', async (req: Request, res: Response) => {
    const product: ProductInput = req.body;
    await addItemService.execute(req.params.cartId, product);
    res.status(200).send();
  });

  return router;
} 