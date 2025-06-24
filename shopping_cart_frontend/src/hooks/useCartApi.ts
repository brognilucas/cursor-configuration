import { useState } from 'react';
import { Product } from '../types/Product';
import { CartItem } from '../types/CartItem';

export interface CartApi {
  addToCart: (product: Product, cartId:string) => Promise<CartItem[]>;
  getCartItems: (cartId: string) => Promise<CartItem[]>;
}

export function useCartApi(api: CartApi) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = async (product: Product) => {
    const updatedCart = await api.addToCart(product, '1');
    setCartItems(updatedCart);
  };

  return {
    cartItems,
    addToCart
  };
} 