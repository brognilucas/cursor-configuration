import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../domain/ShoppingCart';

export interface AddItemInput {
  productId: string;
  quantity: number;
}

export class AddItemToShoppingCartService {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async execute(cartId: string, input: AddItemInput, userId: string): Promise<void> {
    const cart = new ShoppingCart(this.repository, cartId);
    await cart.addProduct(input.productId, input.quantity, userId);
  }
} 