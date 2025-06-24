import express from 'express';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCartController } from './ShoppingCartController';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { SaveShoppingCartService } from '../application/SaveShoppingCartService';
import { AddItemToShoppingCartService } from '../application/AddItemToShoppingCartService';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductController } from './ProductController';
import { GetProductsService } from '../application/GetProductsService';

export function createApp(
  shoppingCartRepository: ShoppingCartRepository,
  productRepository: ProductRepository
): express.Express {
  const app = express();
  app.use(express.json());

  const getCartSummaryService = new GetShoppingCartSummaryService(shoppingCartRepository);
  const saveCartService = new SaveShoppingCartService(shoppingCartRepository);
  const addItemService = new AddItemToShoppingCartService(shoppingCartRepository);
  const getProductsService = new GetProductsService(productRepository);

  app.use('/shopping-carts', ShoppingCartController(getCartSummaryService, saveCartService, addItemService));
  app.use('/products', ProductController(getProductsService));

  return app;
} 