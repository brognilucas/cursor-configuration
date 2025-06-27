import { BcryptPasswordHasher } from '../../application/BcryptPasswordHasher';

describe('BcryptPasswordHasher', () => {
  let passwordHasher: BcryptPasswordHasher;

  beforeEach(() => {
    passwordHasher = new BcryptPasswordHasher();
  });

  it('hashes password correctly', async () => {
    const password = 'testPassword123';
    
    const hashedPassword = await passwordHasher.hash(password);
    
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword).toHaveLength(60); // bcrypt hash length
  });

  it('compares password correctly with matching password', async () => {
    const password = 'testPassword123';
    const hashedPassword = await passwordHasher.hash(password);
    
    const isValid = await passwordHasher.compare(password, hashedPassword);
    
    expect(isValid).toBe(true);
  });

  it('compares password correctly with non-matching password', async () => {
    const password = 'testPassword123';
    const wrongPassword = 'wrongPassword123';
    const hashedPassword = await passwordHasher.hash(password);
    
    const isValid = await passwordHasher.compare(wrongPassword, hashedPassword);
    
    expect(isValid).toBe(false);
  });

  it('generates different hashes for same password', async () => {
    const password = 'testPassword123';
    
    const hash1 = await passwordHasher.hash(password);
    const hash2 = await passwordHasher.hash(password);
    
    expect(hash1).not.toBe(hash2);
  });
}); 