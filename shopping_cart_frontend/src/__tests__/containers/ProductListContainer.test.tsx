import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { ProductListContainer } from '../../containers/ProductListContainer';
import { FakeProductApi } from '../fakes/FakeProductApi';
import { FakeCartApi } from '../fakes/FakeCartApi';
import { FakeAuthApi } from '../fakes/FakeAuthApi';
import { renderWithAuthAndCart } from '../utils/renderWithAuthAndCart';
import { AuthResponse } from '../../types/Auth';
import { AuthProvider } from '../../hooks/useAuthProvider';

let user: AuthResponse;
let authApi: FakeAuthApi;
let cartApi: FakeCartApi;

beforeEach(async () => {
  authApi = new FakeAuthApi();
  user = await authApi.signup('Test User', 'test@example.com', 'password123');
  cartApi = new FakeCartApi();
  localStorage.clear();
});

describe('ProductListContainer', () => {
  it('shows loading state', async () => {
    localStorage.setItem('auth-user', JSON.stringify(user));
    let renderResult;
    await act(async () => {
      renderResult = renderWithAuthAndCart(
        <ProductListContainer productApi={{ products: () => new Promise(() => {}) }} cartApi={cartApi} />,
        { user, authApi }
      );
    });
    expect(renderResult!.getByText('Loading products...')).toBeInTheDocument();
  });

  it('renders products after loading', async () => {
    localStorage.setItem('auth-user', JSON.stringify(user));
    let renderResult;
    await act(async () => {
      renderResult = renderWithAuthAndCart(
        <ProductListContainer productApi={{ products: () => Promise.resolve([{ id: 'p1', name: 'Test Product 1', price: 10 }]) }} cartApi={cartApi} />,
        { user, authApi }
      );
    });
    expect(renderResult!.getByText('Test Product 1')).toBeInTheDocument();
  });

  it('shows empty cart initially', async () => {
    localStorage.setItem('auth-user', JSON.stringify(user));
    let renderResult;
    await act(async () => {
      renderResult = renderWithAuthAndCart(
        <ProductListContainer productApi={{ products: () => Promise.resolve([]) }} cartApi={cartApi} />,
        { user, authApi }
      );
    });
    expect(renderResult!.queryByText(/Product 1/)).not.toBeInTheDocument();
  });

  it('adds a product to the cart and updates the cart summary', async () => {
    localStorage.setItem('auth-user', JSON.stringify(user));
    let renderResult;
    await act(async () => {
      renderResult = renderWithAuthAndCart(
        <ProductListContainer productApi={{ products: () => Promise.resolve([{ id: 'p1', name: 'Product 1', price: 10 }]) }} cartApi={cartApi} />,
        { user, authApi }
      );
    });
    // Simulate add to cart
    await act(async () => {
      renderResult!.getByText('Add to Cart').click();
    });
    expect(renderResult!.getByText(/Product 1.*x.*1.*\$10\.00.*each/)).toBeInTheDocument();
  });

  it('shows cart items for logged in user', async () => {
    localStorage.setItem('auth-user', JSON.stringify(user));
    await cartApi.addToCart({ id: 'p1', name: 'Product 1', price: 10 }, 'cart-1');
    await cartApi.addToCart({ id: 'p2', name: 'Product 2', price: 20 }, 'cart-1');
    let renderResult;
    await act(async () => {
      renderResult = renderWithAuthAndCart(
        <ProductListContainer productApi={{ products: () => Promise.resolve([]) }} cartApi={cartApi} />,
        { user, authApi }
      );
    });
    expect(renderResult!.getByText(/Product 1/)).toBeInTheDocument();
    expect(renderResult!.getByText(/Product 2/)).toBeInTheDocument();
  });

  it('does not show cart items if user is not logged in', async () => {
    localStorage.removeItem('auth-user');
    await cartApi.addToCart({ id: 'p1', name: 'Product 1', price: 10 }, 'cart-1');
    await cartApi.addToCart({ id: 'p2', name: 'Product 2', price: 20 }, 'cart-1');
    let renderResult;
    await act(async () => {
      renderResult = render(
        <AuthProvider authApi={authApi}>
          <ProductListContainer productApi={{ products: () => Promise.resolve([]) }} cartApi={cartApi} />
        </AuthProvider>
      );
    });
    expect(renderResult!.queryByText(/Product 1/)).not.toBeInTheDocument();
    expect(renderResult!.queryByText(/Product 2/)).not.toBeInTheDocument();
  });

  it('shows login message if user is not logged in', async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(
        <AuthProvider authApi={authApi}>
          <ProductListContainer productApi={{ products: () => Promise.resolve([]) }} cartApi={cartApi} />
        </AuthProvider>
      );
    });
    expect(renderResult!.getByText(/Please login to view the cart/)).toBeInTheDocument();
  });
}); 