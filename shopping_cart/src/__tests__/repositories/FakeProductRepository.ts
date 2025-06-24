import { Product } from '../../domain/Product';
import { ProductRepository } from '../../repositories/ProductRepository';

export class FakeProductRepository implements ProductRepository {
  private _products: Product[] = [];

  async findAll(): Promise<Product[]> {
    return this._products;
  }

  async save(product: Product): Promise<void> {
    this._products.push(product);
  }
} 