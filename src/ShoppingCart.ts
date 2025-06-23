import { Product } from './Product';

export class ShoppingCart {
  private products: Product[] = [];

  addProduct(product: Product): void {
    this.products.push(product);
  }

  listProducts(): Product[] {
    return [...this.products];
  }
} 