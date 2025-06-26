import { Router } from 'express';
import { ProductController } from '../ProductController';
import { GetProductsService } from '../../application/GetProductsService';
import { ProductRepository } from '../../repositories/ProductRepository';

export interface ProductDependencies {
  productRepository: ProductRepository;
}

export function createProductRoutes(deps: ProductDependencies): Router {
  const getProductsService = new GetProductsService(deps.productRepository);
  
  return ProductController(getProductsService);
} 