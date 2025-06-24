import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Product } from '../../types/Product';
import { AddToCartButton } from '../../components/AddToCartButton';

describe('AddToCartButton', () => {
  it('renders the button and allows clicking', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10.00
    };

    const onAddToCart = jest.fn();

    render(<AddToCartButton product={product} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
  });
}); 