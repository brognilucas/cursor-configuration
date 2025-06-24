import express from 'express';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCartController } from './ShoppingCartController';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { SaveShoppingCartService } from '../application/SaveShoppingCartService';
import { AddItemToShoppingCartService } from '../application/AddItemToShoppingCartService';

export function createApp(repository: ShoppingCartRepository): express.Express {
  const app = express();
  app.use(express.json());
  const getCartSummaryService = new GetShoppingCartSummaryService(repository);
  const saveCartService = new SaveShoppingCartService(repository);
  const addItemService = new AddItemToShoppingCartService(repository);
  app.use('/shopping-carts', ShoppingCartController(getCartSummaryService, saveCartService, addItemService));
  return app;
} 