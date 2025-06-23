import { Product } from '../Product';
import { ShoppingCart } from '../ShoppingCart';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { PostgresShoppingCartRepository } from '../repositories/PostgresShoppingCartRepository';
import { GenericContainer, Wait } from 'testcontainers';
import { DataSource } from 'typeorm';
import { ShoppingCartEntity } from '../entities/ShoppingCartEntity';

jest.setTimeout(30000);

interface RepositorySetup {
  repository: ShoppingCartRepository;
  cleanup: () => Promise<void>;
}

describe('[CONTRACT] Shopping Cart Repository', () => {
  const implementations: (() => Promise<RepositorySetup>)[] = [
    async (): Promise<RepositorySetup> => ({
      repository: new FakeShoppingCartRepository(),
      cleanup: async (): Promise<void> => {}
    }),
    async (): Promise<RepositorySetup> => {
      const container = await new GenericContainer('postgres:latest')
        .withEnvironment({
          POSTGRES_DB: 'testdb',
          POSTGRES_USER: 'test',
          POSTGRES_PASSWORD: 'test'
        })
        .withExposedPorts(5432)
        .withWaitStrategy(Wait.forListeningPorts())
        .start();

      const dataSource = new DataSource({
        type: 'postgres',
        host: container.getHost(),
        port: container.getMappedPort(5432),
        username: 'test',
        password: 'test',
        database: 'testdb',
        entities: [ShoppingCartEntity],
        synchronize: true
      });

      await dataSource.initialize();
      
      return {
        repository: new PostgresShoppingCartRepository(dataSource),
        cleanup: async (): Promise<void> => {
          if (dataSource.isInitialized) {
            await dataSource.destroy();
          }
          await container.stop();
        }
      };
    }
  ];

  implementations.forEach((createRepository, index) => {
    const implName = index === 0 ? 'FakeRepository' : 'PostgresRepository';
    
    describe(implName, () => {
      let repository: ShoppingCartRepository;
      let cleanup: () => Promise<void>;
      
      beforeEach(async () => {
        const setup = await createRepository();
        repository = setup.repository;
        cleanup = setup.cleanup;
      });

      afterEach(async () => {
        await cleanup();
      });

      it('returns empty products list for a new cart', async () => {
        const cart = new ShoppingCart(repository, 'new-cart-id');
        
        const loadedCart = await repository.load(cart.id());
        
        expect(loadedCart.products).toEqual([]);
      });

      it('saves and loads cart with a single product', async () => {
        const product = new Product(1, 'Test Product', 10);
        const cart = new ShoppingCart(repository, 'test-cart-id');

        await repository.save(cart, [product]);

        const loadedCart = await repository.load(cart.id());
        expect(loadedCart.products).toEqual([product]);
      });

      it('saves and loads cart with multiple products', async () => {
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