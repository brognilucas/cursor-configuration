import { Product } from '../Product';
import { ShoppingCart } from '../ShoppingCart';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { PostgresShoppingCartRepository } from '../repositories/PostgresShoppingCartRepository';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { DataSource } from 'typeorm';
import { ShoppingCartEntity } from '../entities/ShoppingCartEntity';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';

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
      entities: [ShoppingCartEntity],
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
      instance: (): ShoppingCartRepository => new FakeShoppingCartRepository()
    },
    {
      name: 'PostgresRepository',
      instance: (): ShoppingCartRepository => postgresRepository,
      beforeEach: async (): Promise<void> => {
        if (postgresDataSource.isInitialized) {
          await postgresDataSource.getRepository(ShoppingCartEntity).clear();
        }
      }
    }
  ];

  repositories.forEach(({ name, instance, beforeEach: beforeEachHook }) => {
    describe(name, () => {
      if (beforeEachHook) {
        beforeEach(beforeEachHook);
      }

      it('returns empty products list for a new cart', async () => {
        const repository = instance();
        const cart = new ShoppingCart(repository, 'new-cart-id');
        const loadedCart = await repository.load(cart.id());
        expect(loadedCart.products).toEqual([]);
      });

      it('saves and loads cart with a single product', async () => {
        const repository = instance();
        const product = new Product(1, 'Test Product', 10);
        const cart = new ShoppingCart(repository, 'test-cart-id');

        await repository.save(cart, [product]);
        const loadedCart = await repository.load(cart.id());
        expect(loadedCart.products).toEqual([product]);
      });

      it('saves and loads cart with multiple products', async () => {
        const repository = instance();
        const products = [
          new Product(1, 'First Product', 10),
          new Product(2, 'Second Product', 20),
          new Product(3, 'Third Product', 30)
        ];
        const cart = new ShoppingCart(repository, 'multi-product-cart');

        await repository.save(cart, products);
        const loadedCart = await repository.load(cart.id());
        expect(loadedCart.products).toEqual(products);
      });

      it('maintains separate products for different carts', async () => {
        const repository = instance();
        const product1 = new Product(1, 'Cart 1 Product', 10);
        const product2 = new Product(2, 'Cart 2 Product', 20);

        const cart1 = new ShoppingCart(repository, 'cart-1');
        const cart2 = new ShoppingCart(repository, 'cart-2');

        await repository.save(cart1, [product1]);
        await repository.save(cart2, [product2]);

        const loadedCart1 = await repository.load(cart1.id());
        const loadedCart2 = await repository.load(cart2.id());

        expect(loadedCart1.products).toEqual([product1]);
        expect(loadedCart2.products).toEqual([product2]);
      });

      it('updates existing cart products', async () => {
        const repository = instance();
        const cart = new ShoppingCart(repository, 'update-cart');
        const initialProduct = new Product(1, 'Initial Product', 10);
        const updatedProducts = [
          initialProduct,
          new Product(2, 'New Product', 20)
        ];

        await repository.save(cart, [initialProduct]);
        await repository.save(cart, updatedProducts);

        const loadedCart = await repository.load(cart.id());
        expect(loadedCart.products).toEqual(updatedProducts);
      });

      it('preserves product data correctly', async () => {
        const repository = instance();
        const product = new Product(1, 'Test Product', 99.99);
        const cart = new ShoppingCart(repository, 'data-preservation-cart');

        await repository.save(cart, [product]);
        const loadedCart = await repository.load(cart.id());
        const loadedProduct = loadedCart.products[0];

        expect(loadedProduct.id()).toBe(product.id());
        expect(loadedProduct.name()).toBe(product.name());
        expect(loadedProduct.price()).toBe(product.price());
      });
    });
  });
}); 