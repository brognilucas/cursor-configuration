import { Product } from '../domain/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetProductsService {
  constructor(private _repository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this._repository.findAll();
  }
} 