import { ProductOutput } from './ProductOutput';

export interface ShoppingCartSummary {
  cartId: string;
  totalItems: number;
  totalPrice: number;
  products: ProductOutput[];
} 