export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface ProductApiClient {
  fetchProduct(productId: string): Promise<Product>;
  fetchProducts(productIds: string[]): Promise<Product[]>;
}

export class HttpProductApiClient implements ProductApiClient {
  constructor(private readonly baseUrl: string) {}

  async fetchProduct(productId: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product ${productId}: ${response.statusText}`);
    }
    return response.json() as Promise<Product>;
  }

  async fetchProducts(productIds: string[]): Promise<Product[]> {
    if (productIds.length === 0) return [];
    
    const queryParams = productIds.map(id => `ids=${id}`).join('&');
    const response = await fetch(`${this.baseUrl}/products?${queryParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return response.json() as Promise<Product[]>;
  }
} 