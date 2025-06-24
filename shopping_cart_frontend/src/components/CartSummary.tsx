import React from 'react';
import { CartItem } from '../types/CartItem';

interface CartSummaryProps {
  items: CartItem[];
}

export const CartSummary: React.FC<CartSummaryProps> = ({ items }) => {
  if (items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h2>Cart Summary</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} x {item.quantity} (${item.price.toFixed(2)} each)
          </li>
        ))}
      </ul>
    </div>
  );
}; 