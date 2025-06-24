import { Product } from '../domain/Product';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<void>;
} 