import { v4 as uuid } from 'uuid';
import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../domain/Product';
import { CreateProductInput } from '../dto/CreateProductInput';

export class CreateProductService {
  constructor(private readonly _repository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const product = new Product(uuid(), input.name, input.price);
    await this._repository.save(product);
    return product;
  }
} 