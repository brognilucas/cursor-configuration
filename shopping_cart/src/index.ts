import { createApp } from './api';
import { FakeShoppingCartRepository } from './repositories/FakeShoppingCartRepository';

const repository = new FakeShoppingCartRepository();
const app = createApp(repository);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 