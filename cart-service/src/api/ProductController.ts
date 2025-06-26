import { Request, Response, Router } from 'express';
import { GetProductsService } from '../application/GetProductsService';
import { toProductOutput } from '../dto/ProductOutput';

export function ProductController(
  getProductsService: GetProductsService
): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    const products = await getProductsService.execute();
    res.json(products.map(toProductOutput));
  });

  return router;
} 