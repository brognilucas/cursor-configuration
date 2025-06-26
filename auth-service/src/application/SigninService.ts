import { SigninInput } from '../dto/SigninInput';
import { AuthOutput } from '../dto/AuthOutput';
import { UserRepository } from '../repositories/UserRepository';
import { PasswordHasher } from './PasswordHasher';
import { JwtGenerator } from './JwtGenerator';

export class SigninService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtGenerator: JwtGenerator
  ) {}

  async execute(input: SigninInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(input.password, user.password());
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtGenerator.generate({ userId: user.id(), email: user.email() });
    
    return {
      userId: user.id(),
      name: user.name(),
      email: user.email(),
      token,
    };
  }
} 