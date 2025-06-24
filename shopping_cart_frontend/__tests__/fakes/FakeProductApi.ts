import { Product } from '../../types/Product';
import { ProductApi } from '../../hooks/useProductApi';

export class FakeProductApi implements ProductApi {
  private readonly _products: Product[] = [
    { id: '1', name: 'Apple', price: 1.5 },
    { id: '2', name: 'Banana', price: 0.99 },
  ];

  async getProducts(): Promise<Product[]> {
    return Promise.resolve(this._products);
  }
} 