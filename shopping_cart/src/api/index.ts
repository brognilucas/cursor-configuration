import express from 'express';
import cors from 'cors';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCartController } from './ShoppingCartController';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService } from '../application/AddItemToShoppingCartService';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductController } from './ProductController';
import { GetProductsService } from '../application/GetProductsService';
import { CreateCartService } from '../application/CreateCartService';

export function createApp(
  shoppingCartRepository: ShoppingCartRepository,
  productRepository: ProductRepository
): express.Express {
  const app = express();
  
  app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  const getCartSummaryService = new GetShoppingCartSummaryService(shoppingCartRepository);
  const createCartService = new CreateCartService(shoppingCartRepository);
  const addItemService = new AddItemToShoppingCartService(shoppingCartRepository);
  const getProductsService = new GetProductsService(productRepository);

  app.use('/shopping-carts', ShoppingCartController(getCartSummaryService, addItemService, createCartService));
  app.use('/products', ProductController(getProductsService));

  return app;
} 