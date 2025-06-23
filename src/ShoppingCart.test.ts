import { ShoppingCart } from './ShoppingCart';

describe('ShoppingCart', () => {
  it('returns empty list when no products are in cart', () => {
    const cart = new ShoppingCart();

    const products = cart.listProducts();

    expect(products).toHaveLength(0);
  });
}); 