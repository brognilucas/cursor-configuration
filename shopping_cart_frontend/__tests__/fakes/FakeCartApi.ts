import { Product } from '../../types/Product';
import { CartItem } from '../../types/CartItem';
import { CartApi } from '../../hooks/useCartApi';

export class FakeCartApi implements CartApi {
  private _cartItems: CartItem[] = [];

  async addToCart(product: Product): Promise<CartItem[]> {
    const existingItem = this._cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      this._cartItems = this._cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      this._cartItems = [...this._cartItems, { ...product, quantity: 1 }];
    }

    return Promise.resolve(this._cartItems);
  }

  async getCartItems(): Promise<CartItem[]> {
    return Promise.resolve(this._cartItems);
  }
} 