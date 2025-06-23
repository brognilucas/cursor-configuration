import { Product } from '../Product';
import { ShoppingCart } from '../ShoppingCart';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';

describe.each([
  new FakeShoppingCartRepository()
])('[CONTRACT] Shopping Cart Repository', (repository: ShoppingCartRepository) => {
  it('saves and loads cart with products', async () => {
    const product = new Product(1, 'Test Product', 10);
    const cart = new ShoppingCart(repository);

    cart.addProduct(product);
    await cart.save();

    const loadedCart = await ShoppingCart.load(cart.id(), repository);

    expect(loadedCart.listProducts()).toEqual([product]);
  });
}); 