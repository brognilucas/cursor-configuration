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
import { AuthController } from './AuthController';
import { UserRepository } from '../repositories/UserRepository';
import { SignupService } from '../application/SignupService';
import { SigninService } from '../application/SigninService';
import { PasswordHasher } from '../application/PasswordHasher';
import { JwtGenerator } from '../application/JwtGenerator';

export function createApp(
  shoppingCartRepository: ShoppingCartRepository,
  productRepository: ProductRepository,
  userRepository: UserRepository,
  passwordHasher: PasswordHasher,
  jwtGenerator: JwtGenerator
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
  const signupService = new SignupService(userRepository, passwordHasher, jwtGenerator);
  const signinService = new SigninService(userRepository, passwordHasher, jwtGenerator);

  app.use('/shopping-carts', ShoppingCartController(getCartSummaryService, addItemService, createCartService));
  app.use('/products', ProductController(getProductsService));
  app.use('/auth', AuthController(signupService, signinService));

  return app;
} 