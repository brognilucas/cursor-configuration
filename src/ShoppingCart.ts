import { v4 as uuid } from 'uuid';
import { Product } from './Product';
import { ShoppingCartRepository } from './repositories/ShoppingCartRepository';

export class ShoppingCart {
  private _products: Product[] = [];
  private _id: string;
  private _repository: ShoppingCartRepository;

  constructor(repository: ShoppingCartRepository) {
    this._id = uuid();
    this._repository = repository;
  }

  addProduct(product: Product): void {
    this._products.push(product);
  }

  listProducts(): Product[] {
    return [...this._products];
  }

  id(): string {
    return this._id;
  }

  async save(): Promise<void> {
    await this._repository.save(this);
  }

  static async load(id: string, repository: ShoppingCartRepository): Promise<ShoppingCart> {
    return repository.load(id);
  }
} 