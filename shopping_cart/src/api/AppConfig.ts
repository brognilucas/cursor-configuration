import { RouteConfig } from './AppAssembler';
import { createAuthRoutes } from './factories/AuthRouteFactory';
import { createShoppingCartRoutes } from './factories/ShoppingCartRouteFactory';
import { createProductRoutes } from './factories/ProductRouteFactory';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PasswordHasher } from '../application/PasswordHasher';
import { JwtGenerator } from '../application/JwtGenerator';

export interface AppDependencies {
  shoppingCartRepository: ShoppingCartRepository;
  productRepository: ProductRepository;
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
  jwtGenerator: JwtGenerator;
}

export function createAppRoutes(deps: AppDependencies): RouteConfig[] {
  return [
    {
      path: '/auth',
      router: createAuthRoutes({
        userRepository: deps.userRepository,
        passwordHasher: deps.passwordHasher,
        jwtGenerator: deps.jwtGenerator
      })
    },
    {
      path: '/shopping-carts',
      router: createShoppingCartRoutes({
        shoppingCartRepository: deps.shoppingCartRepository
      })
    },
    {
      path: '/products',
      router: createProductRoutes({
        productRepository: deps.productRepository
      })
    }
  ];
} 