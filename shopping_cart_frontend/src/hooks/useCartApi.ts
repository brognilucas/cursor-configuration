import { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { CartItem } from '../types/CartItem';
import { CartApi } from '../types/CartApi';

export function useCartApi(api: CartApi) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function initCart() {
      let id = localStorage.getItem('cartId');
      if (!id) {
        id = await api.createCart();
        localStorage.setItem('cartId', id);
      }
      if (isMounted) {
        setCartId(id);
        const items = await api.getCartItems(id);
        setCartItems(items);
      }
    }
    initCart();
    return () => { isMounted = false; };
  }, [api]);

  const addToCart = async (product: Product) => {
    if (!cartId) return;
    const updatedCart = await api.addToCart(product, cartId);
    setCartItems(updatedCart);
  };

  return {
    cartItems,
    addToCart,
    cartId
  };
} 