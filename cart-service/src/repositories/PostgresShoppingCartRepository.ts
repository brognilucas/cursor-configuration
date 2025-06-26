import { DataSource, Repository } from 'typeorm';
import { ShoppingCartRepository } from './ShoppingCartRepository';
import { ShoppingCartEntity } from '../entities/ShoppingCartEntity';
import { CartItemEntity } from '../entities/CartItemEntity';
import { ShoppingCart } from '../domain/ShoppingCart';
import { ShoppingCartOutput } from '../dto/ShoppingCartOutput';
import { CartItem } from '../dto/CartItem';

export class PostgresShoppingCartRepository implements ShoppingCartRepository {
  private readonly cartRepository: Repository<ShoppingCartEntity>;
  private readonly cartItemRepository: Repository<CartItemEntity>;

  constructor(dataSource: DataSource) {
    this.cartRepository = dataSource.getRepository(ShoppingCartEntity);
    this.cartItemRepository = dataSource.getRepository(CartItemEntity);
  }

  async save(cart: ShoppingCart, items: CartItem[], userId: string): Promise<void> {
    let entity = await this.cartRepository.findOne({ where: { id: cart.id(), user_id: userId } });
    if (!entity) {
      entity = new ShoppingCartEntity();
      entity.id = cart.id();
      entity.user_id = userId;
      await this.cartRepository.save(entity);
    }
    
    // Get existing cart items
    const existingItems = await this.cartItemRepository.find({ where: { cart_id: cart.id() } });
    const existingItemMap = new Map(existingItems.map(item => [item.product_id, item]));
    
    // Process each item in the new items array
    for (const item of items) {
      const existingItem = existingItemMap.get(item.productId);
      
      if (existingItem) {
        // Update existing item
        existingItem.quantity = item.quantity;
        await this.cartItemRepository.save(existingItem);
        existingItemMap.delete(item.productId); // Remove from map to track processed items
      } else {
        // Create new item
        const cartItem = new CartItemEntity();
        cartItem.cart_id = cart.id();
        cartItem.product_id = item.productId;
        cartItem.quantity = item.quantity;
        await this.cartItemRepository.save(cartItem);
      }
    }
    
    // Delete any remaining items that weren't in the new items array
    const itemsToDelete = Array.from(existingItemMap.values());
    if (itemsToDelete.length > 0) {
      await this.cartItemRepository.remove(itemsToDelete);
    }
  }

  async load(id: string, userId: string): Promise<ShoppingCartOutput> {
    const cartEntity = await this.cartRepository.findOne({ where: { id, user_id: userId } });
    if (!cartEntity) {
      throw new Error('Cart not found');
    }

    const cartItems = await this.cartItemRepository.find({ where: { cart_id: id } });
    const items: CartItem[] = cartItems.map(item => ({
      productId: item.product_id,
      quantity: item.quantity
    }));

    return { 
      id, 
      items 
    };
  }
} 