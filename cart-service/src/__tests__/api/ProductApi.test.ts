import request from 'supertest';
import express from 'express';
import { assembleApp } from '../../api/AppAssembler';
import { createProductRoutes, ProductDependencies } from '../../api/factories/ProductRouteFactory';
import { FakeProductRepository } from '../repositories/FakeProductRepository';
import { Product } from '../../domain/Product';

function createTestApp(productDeps: ProductDependencies): express.Express {
  const productRouter = createProductRoutes(productDeps);
  
  const routes = [
    { path: '/products', router: productRouter }
  ];

  return assembleApp(routes);
}

describe('Product API', () => {
  let productRepository: FakeProductRepository;
  let app: express.Express;

  beforeEach(() => {
    productRepository = new FakeProductRepository();
    const productDeps: ProductDependencies = {
      productRepository: productRepository
    };
    
    app = createTestApp(productDeps);
  });

  it('returns empty array when no products exist', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns products when they exist', async () => {
    const product = new Product('1', 'Test Product', 10);
    await productRepository.save(product);

    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{
      id: '1',
      name: 'Test Product',
      price: 10
    }]);
  });
}); 