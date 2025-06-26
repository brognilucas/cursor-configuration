import { GetProductsService } from '../../application/GetProductsService';
import { FakeProductRepository } from '../repositories/FakeProductRepository';
import { Product } from '../../domain/Product';

describe('GetProductsService', () => {
  let service: GetProductsService;
  let repository: FakeProductRepository;

  beforeEach(() => {
    repository = new FakeProductRepository();
    service = new GetProductsService(repository);
  });

  describe('execute', () => {
    it('should return all products', async () => {
      const product1 = new Product('product-1', 'Test Product 1', 29.99);
      const product2 = new Product('product-2', 'Test Product 2', 39.99);
      
      repository.addProduct(product1);
      repository.addProduct(product2);

      const products = await service.execute();
      
      expect(products).toHaveLength(2);
      expect(products[0].id()).toBe('product-1');
      expect(products[1].id()).toBe('product-2');
    });

    it('should return empty array when no products', async () => {
      const products = await service.execute();
      
      expect(products).toHaveLength(0);
    });
  });
}); 