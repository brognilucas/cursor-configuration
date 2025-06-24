import { Product } from '../../types/Product';
import { ProductApi } from '../../types/ProductApi';

export class FakeProductApi implements ProductApi {
  private _products: Product[] = [
    { id: '1', name: 'Test Product 1', price: 10 },
    { id: '2', name: 'Test Product 2', price: 20 }
  ];

  async products(): Promise<Product[]> {
    return Promise.resolve(this._products);
  }
} 