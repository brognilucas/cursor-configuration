import { CartApi } from '../types/CartApi';
import { FakeCartApi } from '../__tests__/fakes/FakeCartApi';
import { RealCartApi } from '../api/CartApi';

describe.each([
  ['FakeCartApi', new FakeCartApi()],
  ['RealCartApi', new RealCartApi()]
])('[CONTRACT] CartApi - %s', (_, api: CartApi) => {
  let cartId: string;

  beforeEach(async () => {
    cartId = await api.createCart();
  });

  it('creates a new cart and returns its id', async () => {
    expect(cartId).toBeTruthy();
  });

  it('returns empty cart items for a new cart', async () => {
    const items = await api.getCartItems(cartId);
    expect(items).toEqual([]);
  });

  it('adds product to cart and returns updated cart items', async () => {
    const product = { id: '1', name: 'Test Product', price: 10 };
    
    const updatedItems = await api.addToCart(product, cartId);
    
    expect(updatedItems).toHaveLength(1);
    expect(updatedItems[0]).toEqual(expect.objectContaining({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }));
  });
}); 