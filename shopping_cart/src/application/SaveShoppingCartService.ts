import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../ShoppingCart';
import { Product } from '../Product';

export class SaveShoppingCartService {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async execute(cartId: string, products: { id: string; name: string; price: number }[]): Promise<void> {
    const cart = new ShoppingCart(this.repository, cartId);
    const productInstances = products.map(p => new Product(p.id, p.name, p.price));
    await cart.setProducts(productInstances);
    await cart.save();
  }
} 