import jwt from 'jsonwebtoken';
import { JwtGenerator } from './JwtGenerator';

export class JwtTokenGenerator implements JwtGenerator {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET!;
  }

  generate(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }

  verify(token: string): object {
    return jwt.verify(token, this.secret) as object;
  }
} 