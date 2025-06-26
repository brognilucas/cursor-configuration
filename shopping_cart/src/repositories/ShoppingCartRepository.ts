import { Product } from '../domain/Product';
import { ShoppingCart } from '../domain/ShoppingCart';
import { ShoppingCartOutput } from '../dto/ShoppingCartOutput';


export interface ShoppingCartRepository {
  save(cart: ShoppingCart, products: Product[], userId: string): Promise<void>;
  load(id: string, userId: string): Promise<ShoppingCartOutput>;
} 