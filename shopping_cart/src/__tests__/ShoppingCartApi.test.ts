import request from 'supertest';
import { createApp } from '../api';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { Product } from '../Product';
import { ShoppingCart } from '../ShoppingCart';

describe('ShoppingCart API', () => {
  let repository: FakeShoppingCartRepository;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = new FakeShoppingCartRepository();
    app = createApp(repository);
  });

  it('returns total number of items and total price for a cart', async () => {
    const cartId = 'test-cart';
    const cart = new ShoppingCart(repository, cartId);
    const product1 = new Product('1', 'Apple', 2.5);
    const product2 = new Product('2', 'Banana', 3.0);

    await cart.addProduct(product1);
    await cart.addProduct(product2);

    const response = await request(app).get(`/shopping-carts/${cartId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      cartId,
      totalItems: 2,
      totalPrice: 5.5
    });
  });

  it('saves a shopping cart and retrieves it', async () => {
    const cartId = 'save-cart-test';
    const products = [
      { id: '1', name: 'Apple', price: 2.5 },
      { id: '2', name: 'Banana', price: 3.0 }
    ];

    // Save the cart
    const saveResponse = await request(app)
      .post(`/shopping-carts/${cartId}`)
      .send({ products });

    expect(saveResponse.status).toBe(200);

    // Retrieve the cart
    const getResponse = await request(app).get(`/shopping-carts/${cartId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject({
      cartId,
      totalItems: 2,
      totalPrice: 5.5,
      products: [
        { id: '1', name: 'Apple', price: 2.5 },
        { id: '2', name: 'Banana', price: 3.0 }
      ]
    });
  });
}); 