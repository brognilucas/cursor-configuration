import { createApp } from './api';
import { FakeProductRepository } from './__tests__/fakes/FakeProductRepository';
import { PostgresProductRepository } from './repositories/PostgresProductRepository';
import { AppDataSource } from './config/database';

const port = process.env.PORT || 3002;

async function startServer() {
  let productRepository;

  if (process.env.NODE_ENV === 'test') {
    // Use fake repository for tests
    productRepository = new FakeProductRepository();
  } else {
    // Use real repository for production
    await AppDataSource.initialize();
    productRepository = new PostgresProductRepository();
  }

  const app = createApp(productRepository);

  app.listen(port, () => {
    console.log(`Products service running on port ${port}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 