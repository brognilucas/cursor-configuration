import { Response, Router } from 'express';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService, AddItemInput } from '../application/AddItemToShoppingCartService';
import { CreateCartService } from '../application/CreateCartService';
import { AuthenticatedRequest, UserPayload } from './AuthMiddleware';
import { PostgresShoppingCartRepository } from '../repositories/PostgresShoppingCartRepository';
import { HttpProductApiClient } from './ProductApiClient';
import { DataSource } from 'typeorm';

export function ShoppingCartController(
  getSummaryService: GetShoppingCartSummaryService,
  addItemService: AddItemToShoppingCartService,
  createCartService: CreateCartService,
  dataSource?: DataSource
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
    const repository = new PostgresShoppingCartRepository(dataSource!);
    const productApiClient = new HttpProductApiClient(process.env.PRODUCT_API_URL!);
    try {
      const carts = await repository.findAllByUserId(userId);
      let totalAmount = 0;
      const cartSummaries: { cartId: string; total: number }[] = [];
      for (const cart of carts) {
        const cartData = await repository.load(cart.id, userId);
        const items: { productId: string; quantity: number }[] = cartData.items;
        let cartTotal = 0;
        if (items.length > 0) {
          const productIds = items.map((item: { productId: string }) => item.productId);
          const products: { id: string; name: string; price: number }[] = await productApiClient.fetchProducts(productIds);
          const productMap = new Map(products.map((p: { id: string; name: string; price: number }) => [p.id, p]));
          cartTotal = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
            const product = productMap.get(item.productId);
            return sum + (product ? product.price * item.quantity : 0);
          }, 0);
        }
        totalAmount += cartTotal;
        cartSummaries.push({ cartId: cart.id, total: cartTotal });
      }
      res.json({ userId, totalAmount, carts: cartSummaries });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  return router;
} 