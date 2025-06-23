import { ShoppingCart } from '../ShoppingCart';

export interface ShoppingCartRepository {
  save(cart: ShoppingCart): Promise<void>;
  load(id: string): Promise<ShoppingCart>;
} 