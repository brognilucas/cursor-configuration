import React from 'react';
import { ProductList } from '../components/ProductList';
import { CartSummary } from '../components/CartSummary';
import { useProductApi, ProductApi } from '../hooks/useProductApi';
import { useCartApi, CartApi } from '../hooks/useCartApi';

interface ProductListContainerProps {
  productApi: ProductApi;
  cartApi: CartApi;
}

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