import { User } from '../../domain/User';

describe('User', () => {
  it('creates a user with id, email, name and hashed password', () => {
    const id = 'user-123';
    const email = 'test@example.com';
    const name = 'John Doe';
    const hashedPassword = 'hashedPassword123';

    const user = new User(id, email, name, hashedPassword);

    expect(user.id()).toBe(id);
    expect(user.email()).toBe(email);
    expect(user.name()).toBe(name);
    expect(user.password()).toBe(hashedPassword);
  });
}); 