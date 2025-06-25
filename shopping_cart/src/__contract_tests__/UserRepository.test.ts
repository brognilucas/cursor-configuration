import { UserRepository } from '../repositories/UserRepository';
import { User } from '../domain/User';
import { FakeUserRepository } from '../__tests__/repositories/FakeUserRepository';

describe.each([
  new FakeUserRepository(),
  // We'll add PostgresUserRepository here later
])('[CONTRACT] User Repository', (repository: UserRepository) => {
  afterEach(async () => {
    await repository.cleanup();
  });

  it('saves and finds user by email', async () => {
    const user = new User('user-123', 'test@example.com', 'John Doe', 'hashedPassword123');

    await repository.save(user);

    const foundUser = await repository.findByEmail('test@example.com');

    expect(foundUser).toEqual(user);
  });

  it('returns null when user is not found by email', async () => {
    const foundUser = await repository.findByEmail('nonexistent@example.com');

    expect(foundUser).toBeNull();
  });

  it('saves and finds user by id', async () => {
    const user = new User('user-123', 'test@example.com', 'John Doe', 'hashedPassword123');

    await repository.save(user);

    const foundUser = await repository.findById('user-123');

    expect(foundUser).toEqual(user);
  });

  it('returns null when user is not found by id', async () => {
    const foundUser = await repository.findById('nonexistent-id');

    expect(foundUser).toBeNull();
  });
}); 