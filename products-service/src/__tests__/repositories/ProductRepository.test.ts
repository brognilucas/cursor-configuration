import { ProductRepository } from '../../repositories/ProductRepository';
import { FakeProductRepository } from '../fakes/FakeProductRepository';
import { Product } from '../../domain/Product';

describe('ProductRepository', () => {
  let repository: FakeProductRepository;

  beforeEach(() => {
    repository = new FakeProductRepository();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const product1 = new Product('product-1', 'Test Product 1', 29.99);
      const product2 = new Product('product-2', 'Test Product 2', 39.99);
      
      repository.addProduct(product1);
      repository.addProduct(product2);

      const products = await repository.findAll();
      
      expect(products).toHaveLength(2);
      expect(products[0].id()).toBe('product-1');
      expect(products[1].id()).toBe('product-2');
    });

    it('should return empty array when no products', async () => {
      const products = await repository.findAll();
      
      expect(products).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const product = new Product('product-1', 'Test Product', 29.99);
      repository.addProduct(product);

      const foundProduct = await repository.findById('product-1');
      
      expect(foundProduct).toBeDefined();
      expect(foundProduct?.id()).toBe('product-1');
      expect(foundProduct?.name()).toBe('Test Product');
      expect(foundProduct?.price()).toBe(29.99);
    });

    it('should return null when product not found', async () => {
      const product = await repository.findById('non-existent');
      
      expect(product).toBeNull();
    });
  });

  describe('save', () => {
    it('should save a new product', async () => {
      const product = new Product('product-1', 'Test Product', 29.99);
      
      await repository.save(product);

      const savedProduct = await repository.findById('product-1');
      expect(savedProduct).toBeDefined();
      expect(savedProduct?.name()).toBe('Test Product');
    });

    it('should update an existing product', async () => {
      const product = new Product('product-1', 'Test Product', 29.99);
      repository.addProduct(product);

      const updatedProduct = new Product('product-1', 'Updated Product', 39.99);
      await repository.save(updatedProduct);

      const savedProduct = await repository.findById('product-1');
      expect(savedProduct?.name()).toBe('Updated Product');
      expect(savedProduct?.price()).toBe(39.99);
    });
  });
}); 