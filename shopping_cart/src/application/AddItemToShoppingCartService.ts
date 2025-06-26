import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../domain/ShoppingCart';
import { Product } from '../domain/Product';
import { ProductInput } from '../dto/ProductInput';

export class AddItemToShoppingCartService {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async execute(cartId: string, product: ProductInput, userId: string): Promise<void> {
    const cart = new ShoppingCart(this.repository, cartId);
    const productInstance = new Product(product.id, product.name, product.price);
    await cart.addProduct(productInstance, userId);
  }
} 