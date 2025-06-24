import { Product } from '../types/Product';
import { CartItem } from '../types/CartItem';
import { CartApi } from '../hooks/useCartApi';

const API_URL = 'http://localhost:3000';

export class RealCartApi implements CartApi {
  async addToCart(product: Product, cartId: string): Promise<CartItem[]> {
    await fetch(`${API_URL}/shopping-carts/${cartId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    return this.getCartItems(cartId);
  }

  async getCartItems(cartId: string): Promise<CartItem[]> {
    const response = await fetch(`${API_URL}/shopping-carts/${cartId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }
    const data = await response.json();
    return data.products.map((product: Product) => ({
      ...product,
      quantity: 1,
    }));
  }

  async createCart(): Promise<string> {
    const response = await fetch(`${API_URL}/shopping-carts`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to create cart');
    }
    const data = await response.json();
    return data.cartId;
  }
} 