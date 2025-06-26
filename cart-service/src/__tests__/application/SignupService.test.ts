import { SignupService } from '../../application/SignupService';
import { FakeUserRepository } from '../repositories/FakeUserRepository';
import { FakePasswordHasher } from '../fakes/FakePasswordHasher';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';
import { SignupInput } from '../../dto/SignupInput';
import { AuthOutput } from '../../dto/AuthOutput';

describe('SignupService', () => {
  it('creates a new user, hashes password, and returns AuthOutput with token', async () => {
    const userRepository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const jwtGenerator = new FakeJwtGenerator();
    const service = new SignupService(userRepository, passwordHasher, jwtGenerator);

    const input: SignupInput = {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    };

    const output: AuthOutput = await service.execute(input);

    expect(output.userId).toBeDefined();
    expect(output.name).toBe('Alice');
    expect(output.email).toBe('alice@example.com');
    expect(output.token).toBe('fake-jwt-token');
  });
}); 