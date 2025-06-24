import { useState } from 'react';
import { Product } from '../types/Product';
import { CartItem } from '../types/CartItem';

export interface CartApi {
  addToCart: (product: Product) => Promise<CartItem[]>;
  getCartItems: () => Promise<CartItem[]>;
}

export function useCartApi(api: CartApi) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = async (product: Product) => {
    const updatedCart = await api.addToCart(product);
    setCartItems(updatedCart);
  };

  return {
    cartItems,
    addToCart
  };
} 