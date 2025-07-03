import request from 'supertest';
import express from 'express';
import { ShoppingCartController } from '../../api/ShoppingCartController';
import { GetShoppingCartSummaryService } from '../../application/GetShoppingCartSummaryService';
import { AddItemToShoppingCartService } from '../../application/AddItemToShoppingCartService';
import { CreateCartService } from '../../application/CreateCartService';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { fakeAuth } from '../fakes/FakeAuthMiddleware';
import { FakeProductApiClient } from '../fakes/FakeProductApiClient';
import { AddItemInput } from '../../application/AddItemToShoppingCartService';
import { GetUserCartSummaryService } from '../../application/GetUserCartSummaryService';

function createTestApp(
  getSummaryService: GetShoppingCartSummaryService,
  addItemService: AddItemToShoppingCartService,
  createCartService: CreateCartService,
  getUserCartSummaryService: GetUserCartSummaryService
): express.Express {
  const app = express();
  app.use(express.json());
  
  const shoppingCartRouter = ShoppingCartController(
    getSummaryService,
    addItemService,
    createCartService,
    getUserCartSummaryService
  );
  
  app.use('/shopping-carts', fakeAuth({ userId: 'test-user' }), shoppingCartRouter);

  return app;
}

describe('ShoppingCart Controller', () => {
  let repository: FakeShoppingCartRepository;
  let app: express.Express;
  let productApiClient: FakeProductApiClient;
  let getSummaryService: GetShoppingCartSummaryService;
  let getUserCartSummaryService: GetUserCartSummaryService;

  async function createCart(): Promise<string> {
    const response = await request(app)
      .post(`/shopping-carts/`)
      .send();

    return response.body.cartId;
  }
  
  beforeEach(() => {
    repository = new FakeShoppingCartRepository();
    productApiClient = new FakeProductApiClient();
    getSummaryService = new GetShoppingCartSummaryService(repository, productApiClient);
    getUserCartSummaryService = new GetUserCartSummaryService(repository, productApiClient);
    const addItemService = new AddItemToShoppingCartService(repository);
    const createCartService = new CreateCartService(repository);

    app = createTestApp(
      getSummaryService,
      addItemService,
      createCartService,
      getUserCartSummaryService
    );
  });

  it('creates a new cart and returns a cartId', async () => {
    const cartId = await createCart();
    expect(cartId).toEqual(expect.any(String));
  });

  it('returns 200 status for cart summary', async () => {
    const cartId = await createCart();
    const item1: AddItemInput = { productId: '1', quantity: 2 };
    const item2: AddItemInput = { productId: '2', quantity: 1 };

    // Add products to fake API client
    productApiClient.addProduct({ id: '1', name: 'Product 1', price: 10 });
    productApiClient.addProduct({ id: '2', name: 'Product 2', price: 15 });

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item1);

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item2);

    const response = await request(app).get(`/shopping-carts/${cartId}`);

    expect(response.status).toBe(200);
  });

  it('returns correct totalItems for cart summary', async () => {
    const item1: AddItemInput = { productId: '1', quantity: 2 };
    const item2: AddItemInput = { productId: '2', quantity: 1 };

    const cartId = await createCart();

    // Add products to fake API client
    productApiClient.addProduct({ id: '1', name: 'Product 1', price: 10 });
    productApiClient.addProduct({ id: '2', name: 'Product 2', price: 15 });

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item1);

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item2);

    const response = await request(app).get(`/shopping-carts/${cartId}`);

    expect(response.body.totalItems).toBe(3);
  });

  it('returns correct totalPrice for cart summary', async () => {
    const cartId = await createCart();
    const item1: AddItemInput = { productId: '1', quantity: 2 };
    const item2: AddItemInput = { productId: '2', quantity: 1 };

    // Add products to fake API client
    productApiClient.addProduct({ id: '1', name: 'Product 1', price: 10 });
    productApiClient.addProduct({ id: '2', name: 'Product 2', price: 15 });

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item1);

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item2);

    const response = await request(app).get(`/shopping-carts/${cartId}`);

    expect(response.body.totalPrice).toBe(35); // (10 * 2) + (15 * 1) = 35
  });

  it('returns correct items for cart summary', async () => {
    const cartId = await createCart();
    const item1: AddItemInput = { productId: '1', quantity: 2 };
    const item2: AddItemInput = { productId: '2', quantity: 1 };

    // Add products to fake API client
    productApiClient.addProduct({ id: '1', name: 'Product 1', price: 10 });
    productApiClient.addProduct({ id: '2', name: 'Product 2', price: 15 });

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item1);

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item2);

    const response = await request(app).get(`/shopping-carts/${cartId}`);

    expect(response.body.items).toEqual([
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 1 }
    ]);
  });

  it('adds a new item to a shopping cart (status)', async () => {
    const cartId = await createCart();
    const item: AddItemInput = { productId: '3', quantity: 1 };

    const addResponse = await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item);

    expect(addResponse.status).toBe(200);
  });

  it('adds a new item to a shopping cart (totalItems)', async () => {
    const cartId = await createCart();
    const item: AddItemInput = { productId: '3', quantity: 2 };

    // Add product to fake API client
    productApiClient.addProduct({ id: '3', name: 'Product 3', price: 20 });

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item);

    const getResponse = await request(app).get(`/shopping-carts/${cartId}`);

    expect(getResponse.body.totalItems).toBe(2);
  });

  it('adds a new item to a shopping cart (items)', async () => {
    const cartId = await createCart();
    const item: AddItemInput = { productId: '3', quantity: 2 };

    // Add product to fake API client
    productApiClient.addProduct({ id: '3', name: 'Product 3', price: 20 });

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(item);

    const getResponse = await request(app).get(`/shopping-carts/${cartId}`);

    expect(getResponse.body.items).toEqual([
      { productId: '3', quantity: 2 }
    ]);
  });

  it('returns correct user cart summary for /users/:userId/summary', async () => {
    productApiClient.addProduct({ id: '1', name: 'Product 1', price: 10 });
    productApiClient.addProduct({ id: '2', name: 'Product 2', price: 15 });
    productApiClient.addProduct({ id: '3', name: 'Product 3', price: 20 });
    const cartId1 = await request(app).post('/shopping-carts/').send().then(res => res.body.cartId);
    const cartId2 = await request(app).post('/shopping-carts/').send().then(res => res.body.cartId);
    await request(app).post(`/shopping-carts/${cartId1}/items`).send({ productId: '1', quantity: 2 }); // 2 * 10 = 20
    await request(app).post(`/shopping-carts/${cartId1}/items`).send({ productId: '2', quantity: 1 }); // 1 * 15 = 15
    await request(app).post(`/shopping-carts/${cartId2}/items`).send({ productId: '3', quantity: 3 }); // 3 * 20 = 60

    const response = await request(app).get('/shopping-carts/users/test-user/summary');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userId: 'test-user',
      totalAmount: 95, // 20 + 15 + 60
      carts: [
        { cartId: cartId1, total: 35 },
        { cartId: cartId2, total: 60 }
      ]
    });
  });
}); 