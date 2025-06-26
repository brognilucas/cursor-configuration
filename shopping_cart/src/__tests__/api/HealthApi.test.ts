import request from 'supertest';
import express from 'express';
import { createApp } from '../../api';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { FakeProductRepository } from '../repositories/FakeProductRepository';
import { FakeUserRepository } from '../repositories/FakeUserRepository';
import { FakePasswordHasher } from '../fakes/FakePasswordHasher';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';

describe('Health API', () => {
  let app: express.Express;

  beforeEach(() => {
    const shoppingCartRepository = new FakeShoppingCartRepository();
    const productRepository = new FakeProductRepository();
    const userRepository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const jwtGenerator = new FakeJwtGenerator();

    app = createApp(shoppingCartRepository, productRepository, userRepository, passwordHasher, jwtGenerator);
  });

  it('returns health status when health endpoint is called', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
      service: 'cart-service'
    });
  });
}); 