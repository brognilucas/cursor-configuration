import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../ShoppingCart';
import { Product } from '../Product';

export class AddItemToShoppingCartService {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async execute(cartId: string, product: { id: string; name: string; price: number }): Promise<void> {
    const cart = new ShoppingCart(this.repository, cartId);
    const productInstance = new Product(product.id, product.name, product.price);
    await cart.addProduct(productInstance);
  }
} 