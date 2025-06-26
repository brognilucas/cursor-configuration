import { Router } from 'express';
import { ShoppingCartController } from '../ShoppingCartController';
import { GetShoppingCartSummaryService } from '../../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService } from '../../application/AddItemToShoppingCartService';
import { CreateCartService } from '../../application/CreateCartService';
import { ShoppingCartRepository } from '../../repositories/ShoppingCartRepository';
import { AuthMiddleware } from '../AuthMiddleware';
import { JwtGenerator } from '../../application/JwtGenerator';

export interface ShoppingCartDependencies {
  shoppingCartRepository: ShoppingCartRepository;
  jwtGenerator: JwtGenerator;
}

export function createShoppingCartRoutes(deps: ShoppingCartDependencies): Router {
  const getCartSummaryService = new GetShoppingCartSummaryService(deps.shoppingCartRepository);
  const createCartService = new CreateCartService(deps.shoppingCartRepository);
  const addItemService = new AddItemToShoppingCartService(deps.shoppingCartRepository);
  const authMiddleware = new AuthMiddleware(deps.jwtGenerator);
  
  const shoppingCartRouter = ShoppingCartController(getCartSummaryService, addItemService, createCartService);
  
  // Create a router that applies authentication middleware to all shopping cart routes
  const protectedRouter = Router();
  protectedRouter.use(authMiddleware.authenticate.bind(authMiddleware), shoppingCartRouter);
  
  return protectedRouter;
} 