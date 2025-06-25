export interface JwtGenerator {
  generate(payload: object): string;
} 