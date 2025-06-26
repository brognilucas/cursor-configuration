import { GetShoppingCartSummaryService } from '../../application/GetShoppingCartSummaryService';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { FakeProductApiClient } from '../fakes/FakeProductApiClient';
import { ShoppingCart } from '../../domain/ShoppingCart';

describe('GetShoppingCartSummaryService', () => {
  let service: GetShoppingCartSummaryService;
  let repository: FakeShoppingCartRepository;
  let productApiClient: FakeProductApiClient;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    repository = new FakeShoppingCartRepository();
    productApiClient = new FakeProductApiClient();
    service = new GetShoppingCartSummaryService(repository, productApiClient);
  });

  it('returns empty cart summary when cart has no items', async () => {
    const cartId = 'test-cart-123';
    const cart = new ShoppingCart(repository, cartId);
    await repository.create(cart, [], testUserId);

    const summary = await service.execute(cartId, testUserId);

    expect(summary.cartId).toBe(cartId);
    expect(summary.totalItems).toBe(0);
    expect(summary.totalPrice).toBe(0);
    expect(summary.items).toHaveLength(0);
  });

  it('returns correct summary when cart has items', async () => {
    const cartId = 'test-cart-123';
    const items = [
      { productId: 'product-1', quantity: 2 },
      { productId: 'product-2', quantity: 1 }
    ];
    const cart = new ShoppingCart(repository, cartId);
    await repository.create(cart, items, testUserId);

    productApiClient.addProduct({ id: 'product-1', name: 'Product 1', price: 10 });
    productApiClient.addProduct({ id: 'product-2', name: 'Product 2', price: 15 });

    const summary = await service.execute(cartId, testUserId);

    expect(summary.cartId).toBe(cartId);
    expect(summary.totalItems).toBe(3);
    expect(summary.totalPrice).toBe(35);
    expect(summary.items).toEqual(items);
  });

  it('throws error when cart not found', async () => {
    const cartId = 'non-existent-cart';

    await expect(service.execute(cartId, testUserId)).rejects.toThrow('Cart not found');
  });
}); 