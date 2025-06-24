import { Product } from '../domain/Product';

export interface ProductOutput {
  id: string;
  name: string;
  price: number;
}

export function toProductOutput(product: Product): ProductOutput {
  return {
    id: product.id(),
    name: product.name(),
    price: product.price()
  };
} 