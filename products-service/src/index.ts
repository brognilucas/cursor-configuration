import { createApp } from './api';
import { FakeProductRepository } from './__tests__/repositories/FakeProductRepository';

const port = process.env.PORT || 3002;

// For now, using fake repository. In production, this would be a real repository
const productRepository = new FakeProductRepository();

const app = createApp(productRepository);

app.listen(port, () => {
  console.log(`Products service running on port ${port}`);
}); 