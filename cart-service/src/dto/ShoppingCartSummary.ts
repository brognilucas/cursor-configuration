import { CartItem } from './CartItem';

export interface ShoppingCartSummary {
  cartId: string;
  totalItems: number;
  totalPrice: number;
  items: CartItem[];
} 