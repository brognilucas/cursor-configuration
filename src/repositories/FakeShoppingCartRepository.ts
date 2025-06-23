import { Product } from '../Product';
import { ShoppingCart } from '../ShoppingCart';
import { CartData, ShoppingCartRepository } from './ShoppingCartRepository';

interface StoredCart {
  id: string;
  products: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

export class FakeShoppingCartRepository implements ShoppingCartRepository {
  private _carts: Map<string, StoredCart> = new Map();

  async save(cart: ShoppingCart, products: Product[]): Promise<void> {
    this._carts.set(cart.id(), {
      id: cart.id(),
      products: products.map(product => ({
        id: product.id(),
        name: product.name(),
        price: product.price()
      }))
    });
  }

  async load(id: string): Promise<CartData> {
    const storedCart = this._carts.get(id);
    if (!storedCart) {
      return { id, products: [] };
    }

    return {
      id: storedCart.id,
      products: storedCart.products.map(p => new Product(p.id, p.name, p.price))
    };
  }
} 