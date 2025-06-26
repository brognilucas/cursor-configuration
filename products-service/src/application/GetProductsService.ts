import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../domain/Product';

export class GetProductsService {
  constructor(private readonly _repository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this._repository.findAll();
  }
} 