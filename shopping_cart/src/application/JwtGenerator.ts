export interface JwtGenerator {
  generate(payload: object): string;
  verify(token: string): object;
} 