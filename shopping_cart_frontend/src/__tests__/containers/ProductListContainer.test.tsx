import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProductListContainer } from '../../containers/ProductListContainer';
import { FakeProductApi } from '../fakes/FakeProductApi';
import { FakeCartApi } from '../fakes/FakeCartApi';

describe('ProductListContainer', () => {
  it('shows loading state', () => {
    const productApi = new FakeProductApi();
    const cartApi = new FakeCartApi();

    render(<ProductListContainer productApi={productApi} cartApi={cartApi} />);
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('renders products after loading', async () => {
    const productApi = new FakeProductApi();
    const cartApi = new FakeCartApi();

    render(<ProductListContainer productApi={productApi} cartApi={cartApi} />);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('$1.50')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('$0.99')).toBeInTheDocument();
    });
  });

  it('shows empty cart initially', async () => {
    const productApi = new FakeProductApi();
    const cartApi = new FakeCartApi();

    render(<ProductListContainer productApi={productApi} cartApi={cartApi} />);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('adds a product to the cart and updates the cart summary', async () => {
    const productApi = new FakeProductApi();
    const cartApi = new FakeCartApi();

    render(<ProductListContainer productApi={productApi} cartApi={cartApi} />);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Cart Summary')).toBeInTheDocument();
      expect(screen.getByText(/Apple x 1/)).toBeInTheDocument();
    });
  });
}); 