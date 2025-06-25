import { createApp } from './api';
import { AppDataSource } from './config/database';
import { PostgresProductRepository } from './repositories/PostgresProductRepository';
import { PostgresShoppingCartRepository } from './repositories/PostgresShoppingCartRepository';
import { PostgresUserRepository } from './repositories/PostgresUserRepository';
import { BcryptPasswordHasher } from './application/BcryptPasswordHasher';
import { JwtTokenGenerator } from './application/JwtTokenGenerator';

AppDataSource.initialize().then(() => {
  const shoppingCartRepository = new PostgresShoppingCartRepository(AppDataSource);
  const productsRepository = new PostgresProductRepository(AppDataSource);
  const userRepository = new PostgresUserRepository(AppDataSource);
  const passwordHasher = new BcryptPasswordHasher();
  const jwtGenerator = new JwtTokenGenerator();
  
  const app = createApp(shoppingCartRepository, productsRepository, userRepository, passwordHasher, jwtGenerator);
  app.listen(3000, () => console.log('Server running on port 3000'));
}); 