import { assembleApp, RouteConfig } from './api/AppAssembler';
import { createAuthRoutes } from './api/factories/AuthRouteFactory';
import { createShoppingCartRoutes } from './api/factories/ShoppingCartRouteFactory';
import { createProductRoutes } from './api/factories/ProductRouteFactory';
import { AppDataSource } from './config/database';
import { PostgresProductRepository } from './repositories/PostgresProductRepository';
import { PostgresShoppingCartRepository } from './repositories/PostgresShoppingCartRepository';
import { PostgresUserRepository } from './repositories/PostgresUserRepository';
import { BcryptPasswordHasher } from './application/BcryptPasswordHasher';
import { JwtTokenGenerator } from './application/JwtTokenGenerator';

AppDataSource.initialize().then(() => {
  // Initialize repositories
  const shoppingCartRepository = new PostgresShoppingCartRepository(AppDataSource);
  const productRepository = new PostgresProductRepository(AppDataSource);
  const userRepository = new PostgresUserRepository(AppDataSource);
  const passwordHasher = new BcryptPasswordHasher();
  const jwtGenerator = new JwtTokenGenerator();
  
  // Create route configurations
  const routes: RouteConfig[] = [
    {
      path: '/auth',
      router: createAuthRoutes({ userRepository, passwordHasher, jwtGenerator })
    },
    {
      path: '/shopping-carts',
      router: createShoppingCartRoutes({ shoppingCartRepository })
    },
    {
      path: '/products',
      router: createProductRoutes({ productRepository })
    }
  ];
  
  const app = assembleApp(routes);
  app.listen(3000, () => console.log('Server running on port 3000'));
}); 