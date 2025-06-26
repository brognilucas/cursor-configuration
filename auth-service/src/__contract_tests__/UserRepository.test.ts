import { UserRepository } from '../repositories/UserRepository';
import { User } from '../domain/User';
import { FakeUserRepository } from '../__tests__/repositories/FakeUserRepository';
import { PostgresUserRepository } from '../repositories/PostgresUserRepository';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';

jest.setTimeout(30000);

describe('[CONTRACT] User Repository', () => {
  let postgresContainer: StartedTestContainer;
  let postgresDataSource: DataSource;
  let postgresRepository: PostgresUserRepository;
  let fakeRepository: FakeUserRepository;

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
      entities: [UserEntity],
      synchronize: true
    });

    await postgresDataSource.initialize();
    postgresRepository = new PostgresUserRepository(postgresDataSource);
    fakeRepository = new FakeUserRepository();
  });

  afterAll(async () => {
    await postgresDataSource?.destroy();
    await postgresContainer?.stop();
  });

  const repositories = [
    {
      name: 'FakeRepository',
      instance: (): UserRepository => fakeRepository,
      beforeEach: async (): Promise<void> => fakeRepository.clear()
    },
    {
      name: 'PostgresRepository',
      instance: (): UserRepository => postgresRepository,
      beforeEach: async (): Promise<void> => {
        if (postgresDataSource.isInitialized) {
          await postgresDataSource.getRepository(UserEntity).createQueryBuilder().delete().execute();
        }
      }
    }
  ];

  repositories.forEach(({ name, instance, beforeEach: beforeEachHook }) => {
    describe(name, () => {
      if (beforeEachHook) {
        beforeEach(beforeEachHook);
      }

      it('saves and finds user by email', async () => {
        const repository = instance();
        const user = new User('user-123', 'test@example.com', 'John Doe', 'hashedPassword123');

        await repository.save(user);

        const foundUser = await repository.findByEmail('test@example.com');

        expect(foundUser).toEqual(user);
      });

      it('returns null when user is not found by email', async () => {
        const repository = instance();
        const foundUser = await repository.findByEmail('nonexistent@example.com');

        expect(foundUser).toBeNull();
      });

      it('saves and finds user by id', async () => {
        const repository = instance();
        const user = new User('user-123', 'test@example.com', 'John Doe', 'hashedPassword123');

        await repository.save(user);

        const foundUser = await repository.findById('user-123');

        expect(foundUser).toEqual(user);
      });

      it('returns null when user is not found by id', async () => {
        const repository = instance();
        const foundUser = await repository.findById('nonexistent-id');

        expect(foundUser).toBeNull();
      });
    });
  });
}); 