import express from 'express';
import cors from 'cors';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductController } from './ProductController';
import { GetProductsService } from '../application/GetProductsService';
import { CreateProductService } from '../application/CreateProductService';
import { HealthController } from './HealthController';

export function createApp(
  productRepository: ProductRepository
): express.Express {
  const app = express();
  
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  const getProductsService = new GetProductsService(productRepository);
  const createProductService = new CreateProductService(productRepository);

  app.use('/health', HealthController());
  app.use('/api/v1/products', ProductController(getProductsService, createProductService));

  return app;
} 