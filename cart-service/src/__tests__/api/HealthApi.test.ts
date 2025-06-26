import request from 'supertest';
import express from 'express';
import { createApp } from '../../api';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { FakeUserRepository } from '../repositories/FakeUserRepository';
import { FakePasswordHasher } from '../fakes/FakePasswordHasher';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';
import { FakeProductApiClient } from '../fakes/FakeProductApiClient';

describe('Health API', () => {
  let app: express.Express;
  let shoppingCartRepository: FakeShoppingCartRepository;
  let userRepository: FakeUserRepository;
  let passwordHasher: FakePasswordHasher;
  let jwtGenerator: FakeJwtGenerator;
  let productApiClient: FakeProductApiClient;

  beforeEach(() => {
    shoppingCartRepository = new FakeShoppingCartRepository();
    userRepository = new FakeUserRepository();
    passwordHasher = new FakePasswordHasher();
    jwtGenerator = new FakeJwtGenerator();
    productApiClient = new FakeProductApiClient();
    app = createApp(shoppingCartRepository, userRepository, passwordHasher, jwtGenerator, productApiClient);
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