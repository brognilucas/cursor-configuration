import { Product } from './Product';
import { CartItem } from './CartItem';

export interface CartApi {
  addToCart: (product: Product, cartId: string) => Promise<CartItem[]>;
  getCartItems: (cartId: string) => Promise<CartItem[]>;
  createCart: () => Promise<string>;
} 