import { CartApi } from './CartApi';
import { ProductApi } from './ProductApi';

export interface ProductListContainerProps {
  productApi: ProductApi;
  cartApi: CartApi;
} 