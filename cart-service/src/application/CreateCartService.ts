import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../domain/ShoppingCart';

export class CreateCartService {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async execute(userId: string): Promise<string> {
    const cart = new ShoppingCart(this.repository);
    await this.repository.create(cart, [], userId);
    return cart.id();
  }
} 