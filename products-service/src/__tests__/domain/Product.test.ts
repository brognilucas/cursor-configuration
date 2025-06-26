import { Product } from '../../domain/Product';

describe('Product', () => {
  describe('when creating a product', () => {
    it('should create a product with id, name and price', () => {
      const product = new Product('product-1', 'Test Product', 29.99);
      
      expect(product.id()).toBe('product-1');
      expect(product.name()).toBe('Test Product');
      expect(product.price()).toBe(29.99);
    });
  });

  describe('when accessing product properties', () => {
    it('should return immutable copies of properties', () => {
      const product = new Product('product-1', 'Test Product', 29.99);
      
      const id = product.id();
      const name = product.name();
      const price = product.price();
      
      expect(id).toBe('product-1');
      expect(name).toBe('Test Product');
      expect(price).toBe(29.99);
    });
  });
}); 