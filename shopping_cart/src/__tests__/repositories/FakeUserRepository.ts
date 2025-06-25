import { User } from '../../domain/User';
import { UserRepository } from '../../repositories/UserRepository';

export class FakeUserRepository implements UserRepository {
  private _users: Map<string, User> = new Map();
  private _usersByEmail: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this._users.set(user.id(), user);
    this._usersByEmail.set(user.email(), user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this._usersByEmail.get(email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this._users.get(id) || null;
  }

  async cleanup(): Promise<void> {
    this._users.clear();
    this._usersByEmail.clear();
  }
} 