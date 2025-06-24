import { Request, Response, Router } from 'express';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { SaveShoppingCartService } from '../application/SaveShoppingCartService';
import { AddItemToShoppingCartService } from '../application/AddItemToShoppingCartService';
import { SaveShoppingCartInput } from '../dto/SaveShoppingCartInput';
import { ProductInput } from '../dto/ProductInput';
import { ShoppingCart } from '../domain/ShoppingCart';

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

  router.post('/', async (_req: Request, res: Response) => {
    // Create a new cart with a generated ID
    // Access repository from getSummaryService
    // @ts-expect-error: Accessing private property for repository injection
    const repository = getSummaryService.repository;
    const cart = new ShoppingCart(repository);
    await cart.save();
    res.status(201).json({ cartId: cart.id() });
  });

  return router;
} 