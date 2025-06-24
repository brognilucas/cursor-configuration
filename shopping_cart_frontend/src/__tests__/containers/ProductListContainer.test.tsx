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

  it('creates and persists a cartId in localStorage if none exists', async () => {
    // Clear localStorage before test
    localStorage.clear();

    // Mock CartApi to simulate cart creation
    const cartId = 'test-cart-id';
    let created = false;
    const cartApi = {
      addToCart: jest.fn().mockResolvedValue([]),
      getCartItems: jest.fn().mockResolvedValue([]),
      createCart: jest.fn().mockImplementation(() => {
        created = true;
        return Promise.resolve(cartId);
      })
    };
    const productApi = new FakeProductApi();

    // Render and trigger cart logic
    render(<ProductListContainer productApi={productApi} cartApi={cartApi} />);

    // Wait for cart creation
    await waitFor(() => {
      expect(created).toBe(true);
      expect(localStorage.getItem('cartId')).toBe(cartId);
    });

    // Simulate reload: render again, should reuse cartId
    created = false;
    render(<ProductListContainer productApi={productApi} cartApi={cartApi} />);
    await waitFor(() => {
      expect(localStorage.getItem('cartId')).toBe(cartId);
      expect(created).toBe(false);
    });
  });
}); 