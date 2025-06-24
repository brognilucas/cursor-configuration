import request from 'supertest';
import { createApp } from '../api';
import { FakeProductRepository } from './repositories/FakeProductRepository';
import { FakeShoppingCartRepository } from './repositories/FakeShoppingCartRepository';
import { Product } from '../Product';

describe('Product API', () => {
  let productRepository: FakeProductRepository;
  let shoppingCartRepository: FakeShoppingCartRepository;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    productRepository = new FakeProductRepository();
    shoppingCartRepository = new FakeShoppingCartRepository();
    app = createApp(shoppingCartRepository, productRepository);
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