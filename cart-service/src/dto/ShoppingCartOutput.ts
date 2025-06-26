import { Product } from "../domain/Product";

export interface ShoppingCartOutput {
  id: string;
  products: Product[];
}