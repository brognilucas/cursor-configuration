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
    
    await this.cartItemRepository.delete({ cart_id: cart.id() });
    
    const cartItems = items.map(item => {
      const cartItem = new CartItemEntity();
      cartItem.cart_id = cart.id();
      cartItem.product_id = item.productId;
      cartItem.quantity = item.quantity;
      return cartItem;
    });
    
    await this.cartItemRepository.save(cartItems);
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