import { Product } from './Product';

export class ShoppingCart {
  private _products: Product[] = [];

  addProduct(product: Product): void {
    this._products.push(product);
  }

  listProducts(): Product[] {
    return [...this._products];
  }
} 