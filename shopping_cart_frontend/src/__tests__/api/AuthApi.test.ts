import { FakeAuthApi } from '../fakes/FakeAuthApi';

describe('FakeAuthApi', () => {
  it('user can login with valid credentials', async () => {
    const authApi = new FakeAuthApi();
    authApi.addUser('test@example.com', 'Test User', 'password123');

    const result = await authApi.signin('test@example.com', 'password123');

    expect(result).toEqual({
      userId: 'user-test@example.com',
      name: 'Test User',
      email: 'test@example.com',
      token: 'fake-token-test@example.com'
    });
  });
}); 