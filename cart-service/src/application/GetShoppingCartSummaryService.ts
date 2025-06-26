import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { ShoppingCart } from '../domain/ShoppingCart';
import { ShoppingCartSummary } from '../dto/ShoppingCartSummary';
import { ProductApiClient } from '../api/ProductApiClient';

export class GetShoppingCartSummaryService {
  constructor(
    private readonly repository: ShoppingCartRepository,
    private readonly productApiClient: ProductApiClient
  ) {}

  async execute(cartId: string, userId: string): Promise<ShoppingCartSummary> {
    const cart = new ShoppingCart(this.repository, cartId);
    const items = await cart.listItems(userId);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    let totalPrice = 0;
    if (items.length > 0) {
      const productIds = items.map(item => item.productId);
      const products = await this.productApiClient.fetchProducts(productIds);
      
      const productMap = new Map(products.map(p => [p.id, p]));
      
      totalPrice = items.reduce((sum, item) => {
        const product = productMap.get(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
    }
    
    return {
      cartId: cart.id(),
      totalItems,
      totalPrice,
      items
    };
  }
} 