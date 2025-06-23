import { Product } from '../Product';
import { ShoppingCart } from '../ShoppingCart';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';

describe.each([
  new FakeShoppingCartRepository()
])('[CONTRACT] Shopping Cart Repository', (repository: ShoppingCartRepository) => {
  it('saves and loads cart with products', async () => {
    const product = new Product(1, 'Test Product', 10);
    const cart = new ShoppingCart(repository, 'test-cart-id');

    await repository.save(cart, [product]);

    const loadedCart = await repository.load(cart.id());
    expect(loadedCart.products).toEqual([product]);
  });
}); 