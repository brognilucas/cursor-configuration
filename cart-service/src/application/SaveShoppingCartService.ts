import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../domain/ShoppingCart';
import { SaveShoppingCartInput } from '../dto/SaveShoppingCartInput';

export class SaveShoppingCartService {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async execute(cartId: string, input: SaveShoppingCartInput, userId: string): Promise<void> {
    const cart = new ShoppingCart(this.repository, cartId);
    await cart.setItems(input.items);
    await cart.save(userId);
  }
} 