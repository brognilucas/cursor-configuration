import { Router } from 'express';
import { AuthController } from '../AuthController';
import { SignupService } from '../../application/SignupService';
import { SigninService } from '../../application/SigninService';
import { UserRepository } from '../../repositories/UserRepository';
import { PasswordHasher } from '../../application/PasswordHasher';
import { JwtGenerator } from '../../application/JwtGenerator';

export interface AuthDependencies {
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
  jwtGenerator: JwtGenerator;
}

export function createAuthRoutes(deps: AuthDependencies): Router {
  const signupService = new SignupService(deps.userRepository, deps.passwordHasher, deps.jwtGenerator);
  const signinService = new SigninService(deps.userRepository, deps.passwordHasher, deps.jwtGenerator);
  
  return AuthController(signupService, signinService);
} 