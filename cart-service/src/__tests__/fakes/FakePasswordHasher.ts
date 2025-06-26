export class FakePasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed-${password}`;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return hashedPassword === `hashed-${password}`;
  }
} 