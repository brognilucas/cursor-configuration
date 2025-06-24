import { Product } from './Product';

export interface ProductApi {
  products(): Promise<Product[]>;
} 