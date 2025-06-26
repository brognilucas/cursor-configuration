import { Response, Router } from 'express';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService } from '../application/AddItemToShoppingCartService';
import { ProductInput } from '../dto/ProductInput';
import { CreateCartService } from '../application/CreateCartService';
import { AuthenticatedRequest, UserPayload } from './AuthMiddleware';

export function ShoppingCartController(
  getSummaryService: GetShoppingCartSummaryService,
  addItemService: AddItemToShoppingCartService,
  createCartService: CreateCartService
): Router {
  const router = Router();

  router.get('/:cartId', async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user as UserPayload;
    const summary = await getSummaryService.execute(req.params.cartId, user.userId);
    res.json(summary);
  });

  router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user as UserPayload;
    const cartId = await createCartService.execute(user.userId);
    res.status(201).json({ cartId });
  });

  router.post('/:cartId/items', async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user as UserPayload;
    const product: ProductInput = req.body;
    await addItemService.execute(req.params.cartId, product, user.userId);
    res.status(200).send();
  });

  return router;
} 