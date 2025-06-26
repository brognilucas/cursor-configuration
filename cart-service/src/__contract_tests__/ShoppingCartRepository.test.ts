import { ShoppingCart } from '../domain/ShoppingCart';
import { FakeShoppingCartRepository } from '../__tests__/repositories/FakeShoppingCartRepository';
import { PostgresShoppingCartRepository } from '../repositories/PostgresShoppingCartRepository';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { DataSource } from 'typeorm';
import { ShoppingCartEntity } from '../entities/ShoppingCartEntity';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { CartItemEntity } from '../entities/CartItemEntity';
import { CartItem } from '../dto/CartItem';

jest.setTimeout(30000);

describe('[CONTRACT] Shopping Cart Repository', () => {
  let postgresContainer: StartedTestContainer;
  let postgresDataSource: DataSource;
  let postgresRepository: PostgresShoppingCartRepository;

  beforeAll(async () => {
    postgresContainer = await new GenericContainer('postgres:latest')
      .withEnvironment({
        POSTGRES_DB: 'testdb',
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test'
      })
      .withExposedPorts(5432)
      .withWaitStrategy(
        Wait.forAll([
          Wait.forListeningPorts(),
          Wait.forLogMessage('database system is ready to accept connections')
        ])
      )
      .start();

    postgresDataSource = new DataSource({
      type: 'postgres',
      host: postgresContainer.getHost(),
      port: postgresContainer.getMappedPort(5432),
      username: 'test',
      password: 'test',
      database: 'testdb',
      entities: [ShoppingCartEntity, CartItemEntity],
      synchronize: true
    });

    await postgresDataSource.initialize();
    postgresRepository = new PostgresShoppingCartRepository(postgresDataSource);
  });

  afterAll(async () => {
    await postgresDataSource?.destroy();
    await postgresContainer?.stop();
  });

  const repositories = [
    {
      name: 'FakeRepository',
      instance: (): ShoppingCartRepository => new FakeShoppingCartRepository(),
      beforeEach: async (): Promise<void> => {
        // No setup needed for fake repository
      }
    },
    {
      name: 'PostgresRepository',
      instance: (): ShoppingCartRepository => postgresRepository,
      beforeEach: async (): Promise<void> => {
        if (postgresDataSource.isInitialized) {
          await postgresDataSource.getRepository(CartItemEntity).createQueryBuilder().delete().execute();
          await postgresDataSource.getRepository(ShoppingCartEntity).createQueryBuilder().delete().execute();
        }
      }
    }
  ];

  repositories.forEach(({ name, instance, beforeEach: beforeEachHook }) => {
    describe(name, () => {
      if (beforeEachHook) {
        beforeEach(beforeEachHook);
      }

      it('returns empty items list for a new cart', async () => {
        const repository = instance();
        const cart = new ShoppingCart(repository, 'new-cart-id');
        await repository.save(cart, [], 'test-user');
        const loadedCart = await repository.load(cart.id(), 'test-user');
        expect(loadedCart.items).toEqual([]);
      });

      it('saves and loads cart with a single item', async () => {
        const repository = instance();
        const item: CartItem = { productId: '1', quantity: 2 };
        const cart = new ShoppingCart(repository, 'test-cart-id');

        await repository.save(cart, [item], 'test-user');
        const loadedCart = await repository.load(cart.id(), 'test-user');
        expect(loadedCart.items).toEqual([item]);
      });

      it('saves and loads cart with multiple items', async () => {
        const repository = instance();
        const items: CartItem[] = [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
          { productId: '3', quantity: 3 }
        ];
        const cart = new ShoppingCart(repository, 'multi-item-cart');

        await repository.save(cart, items, 'test-user');
        const loadedCart = await repository.load(cart.id(), 'test-user');
        expect(loadedCart.items).toEqual(items);
      });

      it('maintains separate items for different carts', async () => {
        const repository = instance();
        const item1: CartItem = { productId: '1', quantity: 2 };
        const item2: CartItem = { productId: '2', quantity: 1 };
        const cart1 = new ShoppingCart(repository, 'cart-1');
        const cart2 = new ShoppingCart(repository, 'cart-2');

        await repository.save(cart1, [item1], 'test-user');
        await repository.save(cart2, [item2], 'test-user');

        const loadedCart1 = await repository.load(cart1.id(), 'test-user');
        const loadedCart2 = await repository.load(cart2.id(), 'test-user');

        expect(loadedCart1.items).toEqual([item1]);
        expect(loadedCart2.items).toEqual([item2]);
      });

      it('updates existing cart items', async () => {
        const repository = instance();
        const cart = new ShoppingCart(repository, 'update-cart');
        const initialItem: CartItem = { productId: '1', quantity: 2 };
        const updatedItems: CartItem[] = [
          { productId: '1', quantity: 3 },
          { productId: '2', quantity: 1 }
        ];

        await repository.save(cart, [initialItem], 'test-user');
        await repository.save(cart, updatedItems, 'test-user');

        const loadedCart = await repository.load(cart.id(), 'test-user');
        expect(loadedCart.items).toEqual(updatedItems);
      });

      it('preserves item data correctly', async () => {
        const repository = instance();
        const item: CartItem = { productId: '1', quantity: 5 };
        const cart = new ShoppingCart(repository, 'data-preservation-cart');

        await repository.save(cart, [item], 'test-user');
        const loadedCart = await repository.load(cart.id(), 'test-user');
        const loadedItem = loadedCart.items[0];

        expect(loadedItem.productId).toBe(item.productId);
        expect(loadedItem.quantity).toBe(item.quantity);
      });

      it('maintains user isolation for shopping carts', async () => {
        const repository = instance();
        const user1Cart = new ShoppingCart(repository, 'user1-cart');
        const user2Cart = new ShoppingCart(repository, 'user2-cart');
        const item1: CartItem = { productId: 'user1-product', quantity: 2 };
        const item2: CartItem = { productId: 'user2-product', quantity: 1 };

        await repository.save(user1Cart, [item1], 'user1');
        await repository.save(user2Cart, [item2], 'user2');

        const user1LoadedCart = await repository.load(user1Cart.id(), 'user1');
        const user2LoadedCart = await repository.load(user2Cart.id(), 'user2');

        expect(user1LoadedCart.items).toEqual([item1]);
        expect(user2LoadedCart.items).toEqual([item2]);
      });

      it('prevents user from accessing another users cart', async () => {
        const repository = instance();
        const user1Cart = new ShoppingCart(repository, 'user1-cart');
        const item: CartItem = { productId: 'test-product', quantity: 1 };

        await repository.save(user1Cart, [item], 'user1');

        await expect(repository.load(user1Cart.id(), 'user2')).rejects.toThrow('Cart not found');
      });

      it('handles cart with no items', async () => {
        const repository = instance();
        const cart = new ShoppingCart(repository, 'empty-cart');

        await repository.save(cart, [], 'test-user');
        const loadedCart = await repository.load(cart.id(), 'test-user');

        expect(loadedCart.items).toEqual([]);
      });
    });
  });
}); 