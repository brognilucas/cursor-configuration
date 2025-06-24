import React from 'react';
import { Product } from '../types/Product';
import { AddToCartButton } from './AddToCartButton';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <span>{product.name}</span> - <span>${product.price.toFixed(2)}</span>
          <AddToCartButton product={product} onAddToCart={onAddToCart} />
        </li>
      ))}
    </ul>
  );
}; 