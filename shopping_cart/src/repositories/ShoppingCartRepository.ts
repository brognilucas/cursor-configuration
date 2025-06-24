import { Product } from '../domain/Product';
import { ShoppingCart } from '../domain/ShoppingCart';
import { ShoppingCartOutput } from '../dto/ShoppingCartOutput';


export interface ShoppingCartRepository {
  save(cart: ShoppingCart, products: Product[]): Promise<void>;
  load(id: string): Promise<ShoppingCartOutput>;
} 