import bcrypt from 'bcrypt';
import { PasswordHasher } from './PasswordHasher';

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
} 