import { SignupInput } from '../dto/SignupInput';
import { AuthOutput } from '../dto/AuthOutput';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../domain/User';
import { PasswordHasher } from './PasswordHasher';
import { JwtGenerator } from './JwtGenerator';
import { v4 as uuidv4 } from 'uuid';

export class SignupService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtGenerator: JwtGenerator
  ) {}

  async execute(input: SignupInput): Promise<AuthOutput> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already in use');
    }
    const hashedPassword = await this.passwordHasher.hash(input.password);
    const user = new User(uuidv4(), input.email, input.name, hashedPassword);
    await this.userRepository.save(user);
    const token = this.jwtGenerator.generate({ userId: user.id(), email: user.email() });
    return {
      userId: user.id(),
      name: user.name(),
      email: user.email(),
      token,
    };
  }
} 