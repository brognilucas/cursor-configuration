import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../ShoppingCart';

export interface ShoppingCartSummary {
  cartId: string;
  totalItems: number;
  totalPrice: number;
  products: { id: string; name: string; price: number }[];
}

export class GetShoppingCartSummaryService {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async execute(cartId: string): Promise<ShoppingCartSummary> {
    const cart = new ShoppingCart(this.repository, cartId);
    const products = await cart.listProducts();
    const totalItems = products.length;
    const totalPrice = products.reduce((sum, p) => sum + p.price(), 0);
    return {
      cartId: cart.id(),
      totalItems,
      totalPrice,
      products: products.map(p => ({ id: p.id(), name: p.name(), price: p.price() }))
    };
  }
} 