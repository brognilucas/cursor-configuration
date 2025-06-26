import request from 'supertest';
import express from 'express';
import { ShoppingCartController } from '../../api/ShoppingCartController';
import { GetShoppingCartSummaryService } from '../../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService } from '../../application/AddItemToShoppingCartService';
import { CreateCartService } from '../../application/CreateCartService';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';
import { AuthMiddleware } from '../../api/AuthMiddleware';

function createTestApp(
  getSummaryService: GetShoppingCartSummaryService,
  addItemService: AddItemToShoppingCartService,
  createCartService: CreateCartService,
  authMiddleware: AuthMiddleware
): express.Express {
  const app = express();
  app.use(express.json());
  
  const shoppingCartRouter = ShoppingCartController(getSummaryService, addItemService, createCartService);
  
  // Apply authentication middleware to all shopping cart routes
  app.use('/shopping-carts', authMiddleware.authenticate.bind(authMiddleware), shoppingCartRouter);

  return app;
}

describe('ShoppingCartController', () => {
  let app: express.Express;
  let shoppingCartRepository: FakeShoppingCartRepository;
  let jwtGenerator: FakeJwtGenerator;
  let authMiddleware: AuthMiddleware;
  let getSummaryService: GetShoppingCartSummaryService;
  let addItemService: AddItemToShoppingCartService;
  let createCartService: CreateCartService;

  beforeEach(() => {
    shoppingCartRepository = new FakeShoppingCartRepository();
    jwtGenerator = new FakeJwtGenerator();
    authMiddleware = new AuthMiddleware(jwtGenerator);

    getSummaryService = new GetShoppingCartSummaryService(shoppingCartRepository);
    addItemService = new AddItemToShoppingCartService(shoppingCartRepository);
    createCartService = new CreateCartService(shoppingCartRepository);

    app = createTestApp(getSummaryService, addItemService, createCartService, authMiddleware);
  });

  it('creates a new cart for authenticated user', async () => {
    const userPayload = { userId: 'user-123', email: 'test@example.com' };
    const token = jwtGenerator.generate(userPayload);

    const response = await request(app)
      .post('/shopping-carts')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body).toHaveProperty('cartId');
  });

  it('rejects cart creation without authentication', async () => {
    await request(app)
      .post('/shopping-carts')
      .expect(401);
  });

  it('adds item to cart for authenticated user', async () => {
    const userPayload = { userId: 'user-123', email: 'test@example.com' };
    const token = jwtGenerator.generate(userPayload);

    const createResponse = await request(app)
      .post('/shopping-carts')
      .set('Authorization', `Bearer ${token}`);

    const cartId = createResponse.body.cartId;

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 'product-1',
        name: 'Test Product',
        price: 10
      })
      .expect(200);
  });

  it('rejects adding item without authentication', async () => {
    await request(app)
      .post('/shopping-carts/cart-123/items')
      .send({
        id: 'product-1',
        name: 'Test Product',
        price: 10
      })
      .expect(401);
  });

  it('gets cart summary for authenticated user', async () => {
    const userPayload = { userId: 'user-123', email: 'test@example.com' };
    const token = jwtGenerator.generate(userPayload);

    const createResponse = await request(app)
      .post('/shopping-carts')
      .set('Authorization', `Bearer ${token}`);
  
    const cartId = createResponse.body.cartId;
    const response = await request(app)
      .get(`/shopping-carts/${cartId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('cartId', cartId);
    expect(response.body).toHaveProperty('totalItems');
    expect(response.body).toHaveProperty('totalPrice');
    expect(response.body).toHaveProperty('products');
  });

  it('rejects getting cart summary without authentication', async () => {
    await request(app)
      .get('/shopping-carts/cart-123')
      .expect(401);
  });
}); 