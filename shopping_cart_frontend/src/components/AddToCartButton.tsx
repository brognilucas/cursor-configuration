import React from 'react';
import { Product } from '../types/Product';

interface AddToCartButtonProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, onAddToCart }) => {
  return (
    <button onClick={() => onAddToCart(product)}>
      Add to Cart
    </button>
  );
}; 