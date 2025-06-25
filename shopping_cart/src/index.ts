import { assembleApp } from './api/AppAssembler';
import { createAppRoutes, AppDependencies } from './api/AppConfig';
import { AppDataSource } from './config/database';
import { PostgresProductRepository } from './repositories/PostgresProductRepository';
import { PostgresShoppingCartRepository } from './repositories/PostgresShoppingCartRepository';
import { PostgresUserRepository } from './repositories/PostgresUserRepository';
import { BcryptPasswordHasher } from './application/BcryptPasswordHasher';
import { JwtTokenGenerator } from './application/JwtTokenGenerator';

AppDataSource.initialize().then(() => {
  const dependencies: AppDependencies = {
    shoppingCartRepository: new PostgresShoppingCartRepository(AppDataSource),
    productRepository: new PostgresProductRepository(AppDataSource),
    userRepository: new PostgresUserRepository(AppDataSource),
    passwordHasher: new BcryptPasswordHasher(),
    jwtGenerator: new JwtTokenGenerator()
  };
  
  const routes = createAppRoutes(dependencies);
  const app = assembleApp(routes);
  
  app.listen(3000, () => console.log('Server running on port 3000'));
}); 