import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ProductApiClient } from '../api/ProductApiClient';
import { UserCartSummary } from '../dto/UserCartSummary';

export class GetUserCartSummaryService {
  constructor(
    private readonly repository: ShoppingCartRepository,
    private readonly productApiClient: ProductApiClient
  ) {}

  async execute(userId: string): Promise<UserCartSummary> {
    const carts = await this.repository.findAllByUserId(userId);
    let totalAmount = 0;
    const cartSummaries: { cartId: string; total: number }[] = [];

    for (const cart of carts) {
      const cartData = await this.repository.load(cart.id, userId);
      const items = cartData.items;
      let cartTotal = 0;
      if (items.length > 0) {
        const productIds = items.map(item => item.productId);
        const products = await this.productApiClient.fetchProducts(productIds);
        const productMap = new Map(products.map(p => [p.id, p]));
        cartTotal = items.reduce((sum, item) => {
          const product = productMap.get(item.productId);
          return sum + (product ? product.price * item.quantity : 0);
        }, 0);
      }
      totalAmount += cartTotal;
      cartSummaries.push({ cartId: cart.id, total: cartTotal });
    }

    return {
      userId,
      totalAmount,
      carts: cartSummaries
    };
  }
} 