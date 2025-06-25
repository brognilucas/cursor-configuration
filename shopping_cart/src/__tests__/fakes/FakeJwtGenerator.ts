export class FakeJwtGenerator {
  generate(_payload: object): string {
    return 'fake-jwt-token';
  }
} 