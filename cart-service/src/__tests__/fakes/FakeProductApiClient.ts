import { ProductApiClient, Product } from '../../api/ProductApiClient';

export class FakeProductApiClient implements ProductApiClient {
  private products: Map<string, Product> = new Map();

  addProduct(product: Product): void {
    this.products.set(product.id, product);
  }

  async fetchProduct(productId: string): Promise<Product> {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }
    return product;
  }

  async fetchProducts(productIds: string[]): Promise<Product[]> {
    return productIds
      .map(id => this.products.get(id))
      .filter((product): product is Product => product !== undefined);
  }
} 