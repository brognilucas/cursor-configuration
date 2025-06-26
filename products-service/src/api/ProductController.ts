import { Router, RequestHandler } from 'express';
import { GetProductsService } from '../application/GetProductsService';
import { CreateProductService } from '../application/CreateProductService';
import { CreateProductInput } from '../dto/CreateProductInput';

export function ProductController(
  getProductsService: GetProductsService,
  createProductService: CreateProductService
) {
  const router = Router();

  const getProducts: RequestHandler = async (req, res) => {
    try {
      const products = await getProductsService.execute();
      const productOutputs = products.map(product => ({
        id: product.id(),
        name: product.name(),
        price: product.price()
      }));
      res.json(productOutputs);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const createProduct: RequestHandler = async (req, res) => {
    try {
      const { name, price } = req.body;

      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Name is required and must be a string' });
        return;
      }

      if (!price || typeof price !== 'number' || price <= 0) {
        res.status(400).json({ error: 'Price is required and must be a positive number' });
        return;
      }

      const input: CreateProductInput = { name, price };
      const product = await createProductService.execute(input);

      res.status(201).json({
        id: product.id(),
        name: product.name(),
        price: product.price()
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  router.get('/', getProducts);
  router.post('/', createProduct);

  return router;
} 