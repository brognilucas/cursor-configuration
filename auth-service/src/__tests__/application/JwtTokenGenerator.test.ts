import { JwtTokenGenerator } from '../../application/JwtTokenGenerator';

describe('JwtTokenGenerator', () => {
  let jwtGenerator: JwtTokenGenerator;
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
    jwtGenerator = new JwtTokenGenerator();
  });

  afterEach(() => {
    if (originalSecret) {
      process.env.JWT_SECRET = originalSecret;
    } else {
      delete process.env.JWT_SECRET;
    }
  });

  it('generates token correctly', () => {
    const payload = { userId: 'user-123', email: 'test@example.com' };
    
    const token = jwtGenerator.generate(payload);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('verifies valid token correctly', () => {
    const payload = { userId: 'user-123', email: 'test@example.com' };
    const token = jwtGenerator.generate(payload);
    
    const verifiedPayload = jwtGenerator.verify(token);
    
    // JWT includes additional fields (exp, iat), so we check only our payload fields
    expect(verifiedPayload).toMatchObject(payload);
    expect(verifiedPayload).toHaveProperty('exp');
    expect(verifiedPayload).toHaveProperty('iat');
  });

  it('throws error when verifying invalid token', () => {
    const invalidToken = 'invalid.token.here';
    
    expect(() => jwtGenerator.verify(invalidToken)).toThrow();
  });

  it('throws error when verifying token with wrong secret', () => {
    const payload = { userId: 'user-123', email: 'test@example.com' };
    const token = jwtGenerator.generate(payload);
    
    process.env.JWT_SECRET = 'wrong-secret-key';
    const wrongJwtGenerator = new JwtTokenGenerator();
    
    expect(() => wrongJwtGenerator.verify(token)).toThrow();
  });
}); 