import { v4 as uuid } from 'uuid';
import { Product } from './Product';
import { ShoppingCartRepository } from './repositories/ShoppingCartRepository';

export class ShoppingCart {
  private _id: string;
  private _products: Product[] = [];

  constructor(private readonly _repository: ShoppingCartRepository, id?: string) {
    this._id = id ?? uuid();
  }

  async addProduct(product: Product): Promise<void> {
    const cartData = await this._repository.load(this._id);
    this._products = cartData.products;
    this._products.push(product);
    await this._repository.save(this, this._products);
  }

  async listProducts(): Promise<Product[]> {
    const cartData = await this._repository.load(this._id);
    this._products = cartData.products;
    return [...this._products];
  }

  id(): string {
    return this._id;
  }

  async save(): Promise<void> {
    await this._repository.save(this, this._products);
  }

  setProducts(products: Product[]): void {
    this._products = products;
  }
} 