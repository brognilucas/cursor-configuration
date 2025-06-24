import React from 'react';
import { Product } from '../types/Product';
import { AddToCartButton } from './AddToCartButton';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  return (
    <ul className={styles.productList}>
      {products.map(product => (
        <li key={product.id} className={styles.productItem}>
          <span className={styles.productName}>{product.name}</span>
          <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
          <AddToCartButton product={product} onAddToCart={onAddToCart} />
        </li>
      ))}
    </ul>
  );
}; 