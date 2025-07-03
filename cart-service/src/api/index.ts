import express from 'express';
import cors from 'cors';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCartController } from './ShoppingCartController';
import { GetShoppingCartSummaryService } from '../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService } from '../application/AddItemToShoppingCartService';
import { CreateCartService } from '../application/CreateCartService';
import { AuthController } from './AuthController';
import { UserRepository } from '../repositories/UserRepository';
import { SignupService } from '../application/SignupService';
import { SigninService } from '../application/SigninService';
import { PasswordHasher } from '../application/PasswordHasher';
import { JwtGenerator } from '../application/JwtGenerator';
import { HealthController } from './HealthController';
import { ProductApiClient } from './ProductApiClient';
import { GetUserCartSummaryService } from '../application/GetUserCartSummaryService';

export function createApp(
  shoppingCartRepository: ShoppingCartRepository,
  userRepository: UserRepository,
  passwordHasher: PasswordHasher,
  jwtGenerator: JwtGenerator,
  productApiClient: ProductApiClient,
): express.Express {
  const app = express();
  
  app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  const getCartSummaryService = new GetShoppingCartSummaryService(shoppingCartRepository, productApiClient);
  const getUserCartSummaryService = new GetUserCartSummaryService(shoppingCartRepository, productApiClient);
  const createCartService = new CreateCartService(shoppingCartRepository);
  const addItemService = new AddItemToShoppingCartService(shoppingCartRepository);
  const signupService = new SignupService(userRepository, passwordHasher, jwtGenerator);
  const signinService = new SigninService(userRepository, passwordHasher, jwtGenerator);

  app.use('/health', HealthController());
  app.use('/shopping-carts', ShoppingCartController(getCartSummaryService, addItemService, createCartService, getUserCartSummaryService));
  app.use('/auth', AuthController(signupService, signinService));

  return app;
} 