import React from 'react';
import { ProductList } from '../components/ProductList';
import { CartSummary } from '../components/CartSummary';
import { useProductApi } from '../hooks/useProductApi';
import { useCartApi } from '../hooks/useCartApi';
import { ProductListContainerProps } from '../types/ProductListContainerProps';

export const ProductListContainer: React.FC<ProductListContainerProps> = ({ productApi, cartApi }) => {
  const { products, loading } = useProductApi(productApi);
  const { cartItems, addToCart } = useCartApi(cartApi);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <>
      <ProductList 
        products={products} 
        onAddToCart={addToCart}
      />
      <CartSummary items={cartItems} />
    </>
  );
}; 