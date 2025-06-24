import request from 'supertest';
import express from 'express';
import { ProductController } from '../../api/ProductController';
import { GetProductsService } from '../../application/GetProductsService';
import { FakeProductRepository } from '../repositories/FakeProductRepository';
import { Product } from '../../Product';

describe('ProductController', () => {
  it('returns empty array as json when no products exist', async () => {
    const app = express();
    const repository = new FakeProductRepository();
    const service = new GetProductsService(repository);
    app.use('/products', ProductController(service));

    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns products as json when products exist', async () => {
    const app = express();
    const repository = new FakeProductRepository();
    const product = new Product('1', 'Test Product', 10);
    await repository.save(product);
    const service = new GetProductsService(repository);
    app.use('/products', ProductController(service));

    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{
      id: '1',
      name: 'Test Product',
      price: 10
    }]);
  });
}); 