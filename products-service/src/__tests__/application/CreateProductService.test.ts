import { CreateProductService } from '../../application/CreateProductService';
import { FakeProductRepository } from '../repositories/FakeProductRepository';
import { Product } from '../../domain/Product';

describe('CreateProductService', () => {
  let service: CreateProductService;
  let repository: FakeProductRepository;

  beforeEach(() => {
    repository = new FakeProductRepository();
    service = new CreateProductService(repository);
  });

  describe('execute', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        price: 29.99
      };

      const product = await service.execute(productData);
      
      expect(product).toBeDefined();
      expect(product.name()).toBe('Test Product');
      expect(product.price()).toBe(29.99);
      expect(product.id()).toBeDefined();
    });

    it('should save the product to repository', async () => {
      const productData = {
        name: 'Test Product',
        price: 29.99
      };

      const product = await service.execute(productData);
      
      const savedProduct = await repository.findById(product.id());
      expect(savedProduct).toBeDefined();
      expect(savedProduct?.name()).toBe('Test Product');
    });
  });
}); 