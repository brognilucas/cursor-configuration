import request from 'supertest';
import { createApp } from '../../api';
import { FakeProductRepository } from '../repositories/FakeProductRepository';

describe('ProductApi', () => {
  let app: any;
  let repository: FakeProductRepository;

  beforeEach(() => {
    repository = new FakeProductRepository();
    app = createApp(repository);
  });

  describe('GET /api/v1/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return empty array when no products', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        price: 29.99
      };

      const response = await request(app)
        .post('/api/v1/products')
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Product');
      expect(response.body.price).toBe(29.99);
    });

    it('should return 400 when name is missing', async () => {
      const productData = {
        price: 29.99
      };

      await request(app)
        .post('/api/v1/products')
        .send(productData)
        .expect(400);
    });

    it('should return 400 when price is missing', async () => {
      const productData = {
        name: 'Test Product'
      };

      await request(app)
        .post('/api/v1/products')
        .send(productData)
        .expect(400);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'products-service');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
}); 