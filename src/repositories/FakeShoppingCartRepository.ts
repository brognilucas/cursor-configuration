import { ShoppingCart } from '../ShoppingCart';
import { ShoppingCartRepository } from './ShoppingCartRepository';

export class FakeShoppingCartRepository implements ShoppingCartRepository {
  private _carts: Map<string, ShoppingCart> = new Map();

  async save(cart: ShoppingCart): Promise<void> {
    this._carts.set(cart.id(), cart);
  }

  async load(id: string): Promise<ShoppingCart> {
    const cart = this._carts.get(id);
    if (!cart) {
      throw new Error(`Cart with id ${id} not found`);
    }
    return cart;
  }
} 