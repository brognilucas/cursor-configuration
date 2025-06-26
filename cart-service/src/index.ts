import { createApp } from './api';
import { PostgresShoppingCartRepository } from './repositories/PostgresShoppingCartRepository';
import { PostgresProductRepository } from './repositories/PostgresProductRepository';
import { PostgresUserRepository } from './repositories/PostgresUserRepository';
import { BcryptPasswordHasher } from './application/BcryptPasswordHasher';
import { JwtTokenGenerator } from './application/JwtTokenGenerator';
import { AppDataSource } from './config/database';

const port = process.env.PORT || 3003;

async function startServer(): Promise<void> {
  await AppDataSource.initialize();

  const shoppingCartRepository = new PostgresShoppingCartRepository(AppDataSource);
  const productRepository = new PostgresProductRepository(AppDataSource);
  const userRepository = new PostgresUserRepository(AppDataSource);
  const passwordHasher = new BcryptPasswordHasher();
  const jwtGenerator = new JwtTokenGenerator();

  const app = createApp(shoppingCartRepository, productRepository, userRepository, passwordHasher, jwtGenerator);

  app.listen(port, () => {
    console.log(`Cart service running on port ${port}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 