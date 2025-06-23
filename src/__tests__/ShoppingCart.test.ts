import { ShoppingCart } from '../ShoppingCart';
import { Product } from '../Product';

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

  it('lists multiple products when multiple products are added to cart', () => {
    const product1 = new Product(1, 'First Product', 20);
    const product2 = new Product(2, 'Second Product', 30);
    const product3 = new Product(3, 'Third Product', 40);
    const cart = new ShoppingCart();

    cart.addProduct(product1);
    cart.addProduct(product2);
    cart.addProduct(product3);

    const products = cart.listProducts();
    
    expect(products).toHaveLength(3);
    expect(products).toContain(product1);
    expect(products).toContain(product2);
    expect(products).toContain(product3);
  });
}); 