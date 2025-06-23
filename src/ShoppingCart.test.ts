import { ShoppingCart } from './ShoppingCart';
import { Product } from './Product';

describe('ShoppingCart', () => {
  it('returns empty list when no products are in cart', () => {
    const cart = new ShoppingCart();

    const products = cart.listProducts();

    expect(products).toHaveLength(0);
  });

  it('lists a single product when one product is added to cart', () => {
    const product = new Product(1, 'Test Product', 20);
    const cart = new ShoppingCart();

    cart.addProduct(product);

    const products = cart.listProducts();
    
    expect(products).toHaveLength(1);
    expect(products[0]).toBe(product);
  });
}); 