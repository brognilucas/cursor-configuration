import { Product } from '../types/Product';
import { ProductApi } from '../types/ProductApi';

const API_URL = 'http://localhost:3000';

export class RealProductApi implements ProductApi {
  async products(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }
} 