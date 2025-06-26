import { ShoppingCart } from '../domain/ShoppingCart';
import { ShoppingCartOutput } from '../dto/ShoppingCartOutput';
import { CartItem } from '../dto/CartItem';

export interface ShoppingCartRepository {
  create(cart: ShoppingCart, items: CartItem[], userId: string): Promise<void>;
  update(cart: ShoppingCart, items: CartItem[], userId: string): Promise<void>;
  load(id: string, userId: string): Promise<ShoppingCartOutput>;
} 