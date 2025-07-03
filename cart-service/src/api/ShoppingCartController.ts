import { Response, Router } from 'express';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService, AddItemInput } from '../application/AddItemToShoppingCartService';
import { CreateCartService } from '../application/CreateCartService';
import { AuthenticatedRequest, UserPayload } from './AuthMiddleware';

import { GetUserCartSummaryService } from '../application/GetUserCartSummaryService';

export function ShoppingCartController(
  getSummaryService: GetShoppingCartSummaryService,
  addItemService: AddItemToShoppingCartService,
  createCartService: CreateCartService,
  getUserCartSummaryService: GetUserCartSummaryService
): Router {
  const router = Router();

  router.get('/:cartId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user as UserPayload;
      const summary = await getSummaryService.execute(req.params.cartId, user.userId);
      res.json(summary);
    } catch (error) {
      console.error('Error getting cart summary:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user as UserPayload;
      const cartId = await createCartService.execute(user.userId);
      res.status(201).json({ cartId });
    } catch (error) {
      console.error('Error creating cart:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  router.post('/:cartId/items', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user as UserPayload;
      const item: AddItemInput = req.body;
      await addItemService.execute(req.params.cartId, item, user.userId);
      res.status(200).send();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  router.get('/users/:userId/summary', async (req, res) => {
    const userId = req.params.userId;
    try {
      const summary = await getUserCartSummaryService.execute(userId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  return router;
} 