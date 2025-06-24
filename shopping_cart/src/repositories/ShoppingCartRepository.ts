import { Product } from '../Product';
import { ShoppingCart } from '../ShoppingCart';

export interface CartData {
  id: string;
  products: Product[];
}

export interface ShoppingCartRepository {
  save(cart: ShoppingCart, products: Product[]): Promise<void>;
  load(id: string): Promise<CartData>;
} 