import { Product } from '../domain/Product';
import { ProductRepository } from '../repositories/ProductRepository';
import { FakeProductRepository } from '../__tests__/fakes/FakeProductRepository';
import { PostgresProductRepository } from '../repositories/PostgresProductRepository';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { DataSource } from 'typeorm';
import { ProductEntity } from '../entities/ProductEntity';

jest.setTimeout(30000);

describe('[CONTRACT] Product Repository', () => {
  let postgresContainer: StartedTestContainer;
  let postgresDataSource: DataSource;
  let postgresRepository: PostgresProductRepository;

  beforeAll(async () => {
    postgresContainer = await new GenericContainer('postgres:15-alpine')
      .withEnvironment({
        POSTGRES_DB: 'testdb',
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test'
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forListeningPorts())
      .start();

    postgresDataSource = new DataSource({
      type: 'postgres',
      host: postgresContainer.getHost(),
      port: postgresContainer.getMappedPort(5432),
      username: 'test',
      password: 'test',
      database: 'testdb',
      entities: [ProductEntity],
      synchronize: true
    });

    await postgresDataSource.initialize();
    postgresRepository = new PostgresProductRepository(postgresDataSource);
  });

  afterAll(async () => {
    if (postgresDataSource?.isInitialized) {
      await postgresDataSource.destroy();
    }
    if (postgresContainer) {
      await postgresContainer.stop();
    }
  });

  const repositories = [
    {
      name: 'FakeRepository',
      instance: (): ProductRepository => new FakeProductRepository(),
      beforeEach: async (): Promise<void> => void 0
    },
    {
      name: 'PostgresRepository',
      instance: (): ProductRepository => postgresRepository,
      beforeEach: async (): Promise<void> => {
        if (postgresDataSource.isInitialized) {
          await postgresDataSource.getRepository(ProductEntity).createQueryBuilder().delete().execute();
        }
      }
    }
  ];

  repositories.forEach(({ name, instance, beforeEach: beforeEachHook }) => {
    describe(name, () => {
      if (beforeEachHook) {
        beforeEach(beforeEachHook);
      }

      it('returns empty list when no products exist', async () => {
        const repository = instance();
        const products = await repository.findAll();
        expect(products).toEqual([]);
      });

      it('returns all saved products', async () => {
        const repository = instance();
        const product = new Product('1', 'Test Product', 10);
        await repository.save(product);

        const products = await repository.findAll();

        expect(products).toEqual([product]);
      });

      it('preserves product data correctly', async () => {
        const repository = instance();
        const product = new Product('1', 'Test Product', 10.99);
        
        await repository.save(product);
        const [savedProduct] = await repository.findAll();
        
        expect(savedProduct.id()).toBe(product.id());
        expect(savedProduct.name()).toBe(product.name());
        expect(savedProduct.price()).toBe(product.price());
      });

      it('returns multiple saved products', async () => {
        const repository = instance();
        const products = [
          new Product('1', 'First Product', 10.99),
          new Product('2', 'Second Product', 20.50),
          new Product('3', 'Third Product', 30.00)
        ];
        
        for (const product of products) {
          await repository.save(product);
        }
        
        const savedProducts = await repository.findAll();
        expect(savedProducts).toEqual(products);
      });
    });
  });
}); 