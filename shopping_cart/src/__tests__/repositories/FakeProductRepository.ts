import { Product } from '../../Product';
import { ProductRepository } from '../../repositories/ProductRepository';

export class FakeProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return [];
  }
} 