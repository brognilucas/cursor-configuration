import { ProductRepository } from '../../repositories/ProductRepository';
import { Product } from '../../domain/Product';

export class FakeProductRepository implements ProductRepository {
  private _products: Product[] = [];

  async findAll(): Promise<Product[]> {
    return [...this._products];
  }

  async findById(id: string): Promise<Product | null> {
    const product = this._products.find(p => p.id() === id);
    return product || null;
  }

  async save(product: Product): Promise<void> {
    const existingIndex = this._products.findIndex(p => p.id() === product.id());
    if (existingIndex >= 0) {
      this._products[existingIndex] = product;
    } else {
      this._products.push(product);
    }
  }

  clear(): void {
    this._products = [];
  }

  addProduct(product: Product): void {
    this._products.push(product);
  }
} 