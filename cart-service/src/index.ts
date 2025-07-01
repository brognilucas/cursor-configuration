import { createApp } from './api';
import { PostgresShoppingCartRepository } from './repositories/PostgresShoppingCartRepository';
import { PostgresUserRepository } from './repositories/PostgresUserRepository';
import { BcryptPasswordHasher } from './application/BcryptPasswordHasher';
import { JwtTokenGenerator } from './application/JwtTokenGenerator';
import { AppDataSource } from './config/database';
import { HttpProductApiClient } from './api/ProductApiClient';

const port = process.env.PORT || 3003;
const productsServiceUrl = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002';

async function startServer(): Promise<void> {
  await AppDataSource.initialize();

  const shoppingCartRepository = new PostgresShoppingCartRepository(AppDataSource);
  const userRepository = new PostgresUserRepository(AppDataSource);
  const passwordHasher = new BcryptPasswordHasher();
  const jwtGenerator = new JwtTokenGenerator();
  const productApiClient = new HttpProductApiClient(productsServiceUrl);

  const app = createApp(shoppingCartRepository, userRepository, passwordHasher, jwtGenerator, productApiClient, AppDataSource);

  app.listen(port, () => {
    console.log(`Cart service running on port ${port}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 