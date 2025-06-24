import express from 'express';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCartController } from './ShoppingCartController';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';

export function createApp(repository: ShoppingCartRepository): express.Express {
  const app = express();
  app.use(express.json());
  const getCartSummaryService = new GetShoppingCartSummaryService(repository);
  app.use('/shopping-carts', ShoppingCartController(getCartSummaryService));
  return app;
} 