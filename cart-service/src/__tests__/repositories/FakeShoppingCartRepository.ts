import { ShoppingCart } from '../../domain/ShoppingCart';
import { CartItem } from '../../dto/CartItem';
import { ShoppingCartOutput } from '../../dto/ShoppingCartOutput';
import { ShoppingCartRepository } from '../../repositories/ShoppingCartRepository';

export class FakeShoppingCartRepository implements ShoppingCartRepository {
  private _carts: Map<string, string> = new Map(); // cartId -> userId
  private _cartItems: Map<string, CartItem[]> = new Map();

  async create(cart: ShoppingCart, items: CartItem[], userId: string): Promise<void> {
    if (this._carts.has(cart.id())) {
      throw new Error('Cart already exists');
    }
    this._carts.set(cart.id(), userId);
    this._cartItems.set(cart.id(), [...items]);
  }

  async update(cart: ShoppingCart, items: CartItem[], userId: string): Promise<void> {
    if (!this._carts.has(cart.id()) || this._carts.get(cart.id()) !== userId) {
      throw new Error('Cart not found');
    }
    this._cartItems.set(cart.id(), [...items]);
  }

  async load(id: string, userId: string): Promise<ShoppingCartOutput> {
    const cartUserId = this._carts.get(id);
    if (!cartUserId || cartUserId !== userId) {
      throw new Error('Cart not found');
    }

    const items = this._cartItems.get(id) || [];
    return { id, items };
  }
} 