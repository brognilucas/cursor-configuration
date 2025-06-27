import { SigninService } from '../../application/SigninService';
import { FakeUserRepository } from '../repositories/FakeUserRepository';
import { FakePasswordHasher } from '../fakes/FakePasswordHasher';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';
import { SigninInput } from '../../dto/SigninInput';
import { AuthOutput } from '../../dto/AuthOutput';
import { User } from '../../domain/User';

describe('SigninService', () => {
  it('authenticates user with correct credentials and returns AuthOutput with token', async () => {
    const userRepository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const jwtGenerator = new FakeJwtGenerator();
    const service = new SigninService(userRepository, passwordHasher, jwtGenerator);

    // Pre-populate repository with a user
    const existingUser = new User('user-123', 'alice@example.com', 'Alice', 'hashed-password123');
    await userRepository.save(existingUser);

    const input: SigninInput = {
      email: 'alice@example.com',
      password: 'password123',
    };

    const output: AuthOutput = await service.execute(input);

    expect(output.userId).toBe('user-123');
    expect(output.name).toBe('Alice');
    expect(output.email).toBe('alice@example.com');
    expect(output.token).toBe('fake-jwt-token');
  });

  it('throws error when user is not found', async () => {
    const userRepository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const jwtGenerator = new FakeJwtGenerator();
    const service = new SigninService(userRepository, passwordHasher, jwtGenerator);

    const input: SigninInput = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    await expect(service.execute(input)).rejects.toThrow('Invalid credentials');
  });

  it('throws error when password is incorrect', async () => {
    const userRepository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const jwtGenerator = new FakeJwtGenerator();
    const service = new SigninService(userRepository, passwordHasher, jwtGenerator);

    // Pre-populate repository with a user
    const existingUser = new User('user-123', 'alice@example.com', 'Alice', 'hashed-password123');
    await userRepository.save(existingUser);

    const input: SigninInput = {
      email: 'alice@example.com',
      password: 'wrongpassword',
    };

    await expect(service.execute(input)).rejects.toThrow('Invalid credentials');
  });
}); 