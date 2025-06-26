import { AuthApi, AuthResponse } from '../../types/Auth';

export class FakeAuthApi implements AuthApi {
  private _users: Map<string, { name: string; password: string }> = new Map();

  async signin(email: string, password: string): Promise<AuthResponse> {
    const user = this._users.get(email);

    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    return {
      userId: `user-${email}`,
      name: user.name,
      email,
      token: `fake-token-${email}`
    };
  }

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    if (this._users.has(email)) {
      throw new Error('Email already in use');
    }

    this._users.set(email, { name, password });

    return {
      userId: `user-${email}`,
      name,
      email,
      token: `fake-token-${email}`
    };
  }

  addUser(email: string, name: string, password: string): void {
    this._users.set(email, { name, password });
  }

  clear(): void {
    this._users.clear();
  }
} 