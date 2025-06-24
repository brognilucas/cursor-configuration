import { createApp } from './api';
import { AppDataSource } from './config/database';
import { PostgresProductRepository } from './repositories/PostgresProductRepository';
import { PostgresShoppingCartRepository } from './repositories/PostgresShoppingCartRepository';

AppDataSource.initialize().then(() => {
  const shoppingCartRepository = new PostgresShoppingCartRepository(AppDataSource);
  const productsRepository = new PostgresProductRepository(AppDataSource);
  const app = createApp(shoppingCartRepository, productsRepository);
  app.listen(3000, () => console.log('Server running on port 3000'));
}); 