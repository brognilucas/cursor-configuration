import { createApp } from './api';
import { AppDataSource } from './config/database';
import { PostgresShoppingCartRepository } from './repositories/PostgresShoppingCartRepository';

AppDataSource.initialize().then(() => {
  const repository = new PostgresShoppingCartRepository(AppDataSource);
  const app = createApp(repository);
  app.listen(3000, () => console.log('Server running on port 3000'));
}); 