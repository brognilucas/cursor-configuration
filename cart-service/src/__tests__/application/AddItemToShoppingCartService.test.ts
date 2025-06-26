import { AddItemToShoppingCartService } from '../../application/AddItemToShoppingCartService';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { ShoppingCart } from '../../domain/ShoppingCart';

describe('AddItemToShoppingCartService', () => {
  let service: AddItemToShoppingCartService;
  let repository: FakeShoppingCartRepository;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    repository = new FakeShoppingCartRepository();
    service = new AddItemToShoppingCartService(repository);
  });

  it('adds an item to the shopping cart', async () => {
    const cartId = 'test-cart-123';
    const item = { productId: 'product-1', quantity: 2 };
    
    // Create cart first
    const cart = new ShoppingCart(repository, cartId);
    await cart.save(testUserId);

    await service.execute(cartId, item, testUserId);

    const cartData = await repository.load(cartId, testUserId);
    expect(cartData.items).toHaveLength(1);
    expect(cartData.items[0]).toEqual(item);
  });

  it('increments quantity when adding same product multiple times', async () => {
    const cartId = 'test-cart-123';
    const item1 = { productId: 'product-1', quantity: 2 };
    const item2 = { productId: 'product-1', quantity: 3 };
    
    // Create cart first
    const cart = new ShoppingCart(repository, cartId);
    await cart.save(testUserId);

    await service.execute(cartId, item1, testUserId);
    await service.execute(cartId, item2, testUserId);

    const cartData = await repository.load(cartId, testUserId);
    expect(cartData.items).toHaveLength(1);
    expect(cartData.items[0]).toEqual({ productId: 'product-1', quantity: 5 });
  });
}); 