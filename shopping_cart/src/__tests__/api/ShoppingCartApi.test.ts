import request from 'supertest';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { Product } from '../../domain/Product';
import { ShoppingCart } from '../../domain/ShoppingCart';
import { ProductInput } from '../../dto/ProductInput';
import { createApp } from '../../api';
import { FakeProductRepository } from '../repositories/FakeProductRepository';

describe('ShoppingCart API', () => {
  let repository: FakeShoppingCartRepository;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = new FakeShoppingCartRepository();
    app = createApp(repository, new FakeProductRepository());
  });

  it('returns 200 status for cart summary', async () => {
    const cartId = 'test-cart';
    const cart = new ShoppingCart(repository, cartId);
    const product1 = new Product('1', 'Apple', 2.5);
    const product2 = new Product('2', 'Banana', 3.0);

    await cart.addProduct(product1);
    await cart.addProduct(product2);

    const response = await request(app).get(`/shopping-carts/${cartId}`);

    expect(response.status).toBe(200);
  });

  it('returns correct totalItems for cart summary', async () => {
    const cartId = 'test-cart';
    const cart = new ShoppingCart(repository, cartId);
    const product1 = new Product('1', 'Apple', 2.5);
    const product2 = new Product('2', 'Banana', 3.0);

    await cart.addProduct(product1);
    await cart.addProduct(product2);

    const response = await request(app).get(`/shopping-carts/${cartId}`);

    expect(response.body.totalItems).toBe(2);
  });

  it('returns correct totalPrice for cart summary', async () => {
    const cartId = 'test-cart';
    const cart = new ShoppingCart(repository, cartId);
    const product1 = new Product('1', 'Apple', 2.5);
    const product2 = new Product('2', 'Banana', 3.0);

    await cart.addProduct(product1);
    await cart.addProduct(product2);

    const response = await request(app).get(`/shopping-carts/${cartId}`);

    expect(response.body.totalPrice).toBe(5.5);
  });

  it('adds a new item to a shopping cart (status)', async () => {
    const cartId = 'add-item-cart';
    const product: ProductInput = { id: '3', name: 'Orange', price: 4.0 };

    const addResponse = await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(product);

    expect(addResponse.status).toBe(200);
  });

  it('adds a new item to a shopping cart (totalItems)', async () => {
    const cartId = 'add-item-cart';
    const product: ProductInput = { id: '3', name: 'Orange', price: 4.0 };

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(product);

    const getResponse = await request(app).get(`/shopping-carts/${cartId}`);

    expect(getResponse.body.totalItems).toBe(1);
  });

  it('adds a new item to a shopping cart (totalPrice)', async () => {
    const cartId = 'add-item-cart';
    const product: ProductInput = { id: '3', name: 'Orange', price: 4.0 };

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(product);

    const getResponse = await request(app).get(`/shopping-carts/${cartId}`);

    expect(getResponse.body.totalPrice).toBe(4.0);
  });

  it('adds a new item to a shopping cart (products)', async () => {
    const cartId = 'add-item-cart';
    const product: ProductInput = { id: '3', name: 'Orange', price: 4.0 };

    await request(app)
      .post(`/shopping-carts/${cartId}/items`)
      .send(product);

    const getResponse = await request(app).get(`/shopping-carts/${cartId}`);

    expect(getResponse.body.products).toEqual([
      { id: '3', name: 'Orange', price: 4.0 }
    ]);
  });

  it('creates a new cart and returns a cartId', async () => {
    const response = await request(app)
      .post('/shopping-carts')
      .send();

    expect(response.status).toBe(201);
    expect(typeof response.body.cartId).toBe('string');
    expect(response.body.cartId.length).toBeGreaterThan(0);
  });
}); 