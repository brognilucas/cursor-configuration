import { Product } from '../../Product';
import { ShoppingCart } from '../../ShoppingCart';
import { CartData, ShoppingCartRepository } from '../../repositories/ShoppingCartRepository';

export class FakeShoppingCartRepository implements ShoppingCartRepository {
  private _carts: Set<string> = new Set();
  private _cartProducts: Map<string, { product_id: string; quantity: number }[]> = new Map();
  private _products: Map<string, { name: string; price: number }> = new Map();

  registerProduct(id: string, name: string, price: number): void {
    this._products.set(id, { name, price });
  }

  async save(cart: ShoppingCart, products: Product[]): Promise<void> {
    this._carts.add(cart.id());
    this._cartProducts.set(
      cart.id(),
      products.map(product => ({ product_id: product.id(), quantity: 1 }))
    );
    // Register products on save for convenience (optional, can be removed if explicit registration is preferred)
    products.forEach(product => {
      if (!this._products.has(product.id())) {
        this.registerProduct(product.id(), product.name(), product.price());
      }
    });
  }

  async load(id: string): Promise<CartData> {
    if (!this._carts.has(id)) {
      return { id, products: [] };
    }
    const cartProducts = this._cartProducts.get(id) || [];
    const products = cartProducts.map(cp => {
      const prod = this._products.get(cp.product_id) || { name: '', price: 0 };
      return new Product(cp.product_id, prod.name, prod.price);
    });
    return { id, products };
  }
} 