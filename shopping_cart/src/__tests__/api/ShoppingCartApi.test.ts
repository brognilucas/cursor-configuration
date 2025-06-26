import request from 'supertest';
import express from 'express';
import { assembleApp } from '../../api/AppAssembler';
import { createShoppingCartRoutes, ShoppingCartDependencies } from '../../api/factories/ShoppingCartRouteFactory';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { ProductInput } from '../../dto/ProductInput';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';

function createTestApp(shoppingCartDeps: ShoppingCartDependencies): express.Express {
  const shoppingCartRouter = createShoppingCartRoutes(shoppingCartDeps);

  const routes = [
    { path: '/shopping-carts', router: shoppingCartRouter }
  ];

  return assembleApp(routes);
}

describe('ShoppingCart API', () => {
  let repository: FakeShoppingCartRepository;
  let app: express.Express;
  let token: string;

  const userId = 'test-user';

  async function createCart(): Promise<string> {
    const { body } = await request(app)
      .post(`/shopping-carts/`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return body.cartId;
  }
  
  beforeEach(() => {
    repository = new FakeShoppingCartRepository();
    const jwtGenerator = new FakeJwtGenerator();
    token = jwtGenerator.generate({ userId });
    const shoppingCartDeps: ShoppingCartDependencies = {
      shoppingCartRepository: repository,
      jwtGenerator: jwtGenerator
    };

    app = createTestApp(shoppingCartDeps);
  });

  it('returns 200 status for cart summary', async () => {
    const cartId = await createCart();
    const product1: ProductInput = { id: '1', name: 'Apple', price: 2.5 };
    const product2: ProductInput = { id: '2', name: 'Banana', price: 3.0 };

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product1);

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product2);

    const response = await request(app).get(`/shopping-carts/${cartId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });


  it('returns correct totalItems for cart summary', async () => {
    const product1: ProductInput = { id: '1', name: 'Apple', price: 2.5 };
    const product2: ProductInput = { id: '2', name: 'Banana', price: 3.0 };

    const cartId = await createCart();

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product1);

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product2);

    const response = await request(app).get(`/shopping-carts/${cartId}`).set('Authorization', `Bearer ${token}`);

    expect(response.body.totalItems).toBe(2);
  });

  it('returns correct totalPrice for cart summary', async () => {
    const cartId = await createCart();
    const product1: ProductInput = { id: '1', name: 'Apple', price: 2.5 };
    const product2: ProductInput = { id: '2', name: 'Banana', price: 3.0 };

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product1);

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product2);

    const response = await request(app).get(`/shopping-carts/${cartId}`).set('Authorization', `Bearer ${token}`);

    expect(response.body.totalPrice).toBe(5.5);
  });

  it('adds a new item to a shopping cart (status)', async () => {
    const cartId = await createCart();
    const product: ProductInput = { id: '3', name: 'Orange', price: 4.0 };

    const addResponse = await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    expect(addResponse.status).toBe(200);
  });

  it('adds a new item to a shopping cart (totalItems)', async () => {
    const cartId = await createCart();
    const product: ProductInput = { id: '3', name: 'Orange', price: 4.0 };

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    const getResponse = await request(app).get(`/shopping-carts/${cartId}`).set('Authorization', `Bearer ${token}`);

    expect(getResponse.body.totalItems).toBe(1);
  });

  it('adds a new item to a shopping cart (totalPrice)', async () => {
    const cartId = await createCart();
    const product: ProductInput = { id: '3', name: 'Orange', price: 4.0 };

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    const getResponse = await request(app).get(`/shopping-carts/${cartId}`).set('Authorization', `Bearer ${token}`);

    expect(getResponse.body.totalPrice).toBe(4.0);
  });

  it('adds a new item to a shopping cart (products)', async () => {
    const cartId = await createCart();
    const product: ProductInput = { id: '3', name: 'Orange', price: 4.0 };

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    const getResponse = await request(app).get(`/shopping-carts/${cartId}`).set('Authorization', `Bearer ${token}`);

    expect(getResponse.body.products).toEqual([
      { id: '3', name: 'Orange', price: 4.0 }
    ]);
  });

  it('creates a new cart and returns a cartId', async () => {
    const cartId = await createCart();
    expect(cartId).toEqual(expect.any(String));
  });
}); 