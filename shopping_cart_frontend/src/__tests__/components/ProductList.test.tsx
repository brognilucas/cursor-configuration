import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductList } from '../../components/ProductList';
import { Product } from '../../types/Product';

describe('ProductList', () => {
  it('renders a list of products with name, price, and add to cart buttons', () => {
    const products: Product[] = [
      { id: '1', name: 'Apple', price: 1.5 },
      { id: '2', name: 'Banana', price: 0.99 },
    ];

    const onAddToCart = jest.fn();

    render(<ProductList products={products} onAddToCart={onAddToCart} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('$1.50')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('$0.99')).toBeInTheDocument();

    const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i });
    expect(addToCartButtons).toHaveLength(2);
  });
}); 