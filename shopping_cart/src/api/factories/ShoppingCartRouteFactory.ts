import { Router } from 'express';
import { ShoppingCartController } from '../ShoppingCartController';
import { GetShoppingCartSummaryService } from '../../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService } from '../../application/AddItemToShoppingCartService';
import { CreateCartService } from '../../application/CreateCartService';
import { ShoppingCartRepository } from '../../repositories/ShoppingCartRepository';

export interface ShoppingCartDependencies {
  shoppingCartRepository: ShoppingCartRepository;
}

export function createShoppingCartRoutes(deps: ShoppingCartDependencies): Router {
  const getCartSummaryService = new GetShoppingCartSummaryService(deps.shoppingCartRepository);
  const createCartService = new CreateCartService(deps.shoppingCartRepository);
  const addItemService = new AddItemToShoppingCartService(deps.shoppingCartRepository);
  
  return ShoppingCartController(getCartSummaryService, addItemService, createCartService);
} 