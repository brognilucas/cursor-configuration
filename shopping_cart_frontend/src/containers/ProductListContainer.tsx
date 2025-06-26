import React from 'react';
import { ProductList } from '../components/ProductList';
import { CartSummary } from '../components/CartSummary';
import { useProductApi } from '../hooks/useProductApi';
import { useCartApi } from '../hooks/useCartApi';
import { useAuth } from '../hooks/useAuthProvider';
import { ProductListContainerProps } from '../types/ProductListContainerProps';

export const ProductListContainer: React.FC<ProductListContainerProps> = ({ productApi, cartApi }) => {
  const { products, loading } = useProductApi(productApi);
  const { user } = useAuth();
  const cartApiResult = user ? useCartApi(cartApi) : { cartItems: [], addToCart: () => { }, cartId: null };
  const { cartItems, addToCart } = cartApiResult;

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (!user) {
    return <div>Please login to view the cart</div>;
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