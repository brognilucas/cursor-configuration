import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../domain/ShoppingCart';
import { Product } from '../domain/Product';
import { SaveShoppingCartInput } from '../dto/SaveShoppingCartInput';
import { ProductInput } from '../dto/ProductInput';

export class SaveShoppingCartService {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async execute(cartId: string, input: SaveShoppingCartInput): Promise<void> {
    const cart = new ShoppingCart(this.repository, cartId);
    const productInstances = input.products.map((p: ProductInput) => new Product(p.id, p.name, p.price));
    await cart.setProducts(productInstances);
    await cart.save();
  }
} 