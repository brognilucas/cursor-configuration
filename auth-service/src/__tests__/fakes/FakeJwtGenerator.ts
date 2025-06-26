import { JwtGenerator } from '../../application/JwtGenerator';

export class FakeJwtGenerator implements JwtGenerator {
  private _tokens: Map<string, object> = new Map();

  generate(payload: object): string {
    const token = 'fake-jwt-token';
    this._tokens.set(token, payload);
    return token;
  }

  verify(token: string): object {
    const payload = this._tokens.get(token);
    if (!payload) {
      throw new Error('Invalid token');
    }
    return payload;
  }

  registerToken(token: string, payload: object): void {
    this._tokens.set(token, payload);
  }
} 