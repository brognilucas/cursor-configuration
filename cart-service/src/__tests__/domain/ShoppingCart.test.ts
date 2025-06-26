import { ShoppingCart } from '../../domain/ShoppingCart';
import { CartItem } from '../../dto/CartItem';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';

describe('ShoppingCart', () => {
  let repository: FakeShoppingCartRepository;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    repository = new FakeShoppingCartRepository();
  });

  it('returns empty list when no items are in cart', async () => {
    const cart = new ShoppingCart(repository);
    await cart.save(testUserId);

    const items = await cart.listItems(testUserId);

    expect(items).toHaveLength(0);
  });

  it('lists a single item when one item is added to cart (length)', async () => {
    const cart = new ShoppingCart(repository);
    await cart.save(testUserId);

    await cart.addProduct('1', 2, testUserId);

    const items = await cart.listItems(testUserId);

    expect(items).toHaveLength(1);
  });

  it('lists a single item when one item is added to cart (equality)', async () => {
    const cart = new ShoppingCart(repository);
    await cart.save(testUserId);

    await cart.addProduct('1', 2, testUserId);

    const items = await cart.listItems(testUserId);

    expect(items[0]).toEqual({ productId: '1', quantity: 2 });
  });

  it('lists multiple items when multiple items are added to cart (length)', async () => {
    const cart = new ShoppingCart(repository);
    await cart.save(testUserId);

    await cart.addProduct('1', 2, testUserId);
    await cart.addProduct('2', 1, testUserId);
    await cart.addProduct('3', 3, testUserId);

    const items = await cart.listItems(testUserId);

    expect(items).toHaveLength(3);
  });

  it('lists multiple items when multiple items are added to cart (contains item1)', async () => {
    const cart = new ShoppingCart(repository);
    await cart.save(testUserId);

    await cart.addProduct('1', 2, testUserId);
    await cart.addProduct('2', 1, testUserId);
    await cart.addProduct('3', 3, testUserId);

    const items = await cart.listItems(testUserId);

    expect(items).toContainEqual({ productId: '1', quantity: 2 });
  });

  it('increments quantity when adding same product multiple times', async () => {
    const cart = new ShoppingCart(repository);
    await cart.save(testUserId);

    await cart.addProduct('1', 2, testUserId);
    await cart.addProduct('1', 3, testUserId);

    const items = await cart.listItems(testUserId);

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({ productId: '1', quantity: 5 });
  });

  it('sets items correctly', async () => {
    const cart = new ShoppingCart(repository);
    const items: CartItem[] = [
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 1 }
    ];

    cart.setItems(items);
    await cart.save(testUserId);

    const savedItems = await cart.listItems(testUserId);
    expect(savedItems).toEqual(items);
  });
}); 