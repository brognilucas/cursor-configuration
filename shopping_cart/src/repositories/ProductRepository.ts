import { Product } from '../Product';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<void>;
} 