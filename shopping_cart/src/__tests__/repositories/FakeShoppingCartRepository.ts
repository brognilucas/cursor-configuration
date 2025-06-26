import { Product } from '../../domain/Product';
import { ShoppingCart } from '../../domain/ShoppingCart';
import { ShoppingCartOutput } from '../../dto/ShoppingCartOutput';
import { ShoppingCartRepository } from '../../repositories/ShoppingCartRepository';

export class FakeShoppingCartRepository implements ShoppingCartRepository {
  private _carts: Map<string, string> = new Map(); // cartId -> userId
  private _cartProducts: Map<string, { product_id: string; quantity: number }[]> = new Map();
  private _products: Map<string, { name: string; price: number }> = new Map();

  registerProduct(id: string, name: string, price: number): void {
    this._products.set(id, { name, price });
  }

  async save(cart: ShoppingCart, products: Product[], userId: string): Promise<void> {
    this._carts.set(cart.id(), userId);
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

  async load(id: string, userId: string): Promise<ShoppingCartOutput> {
    const cartUserId = this._carts.get(id);
    if (!cartUserId || cartUserId !== userId) {
      throw new Error('Cart not found');
    }

    const cartProducts = this._cartProducts.get(id) || [];
    const products = cartProducts.map(cp => {
      const prod = this._products.get(cp.product_id) || { name: '', price: 0 };
      return new Product(cp.product_id, prod.name, prod.price);
    });
    return { id, products };
  }
} 