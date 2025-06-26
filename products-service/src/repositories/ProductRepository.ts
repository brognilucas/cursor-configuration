import { Product } from '../domain/Product';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
} 