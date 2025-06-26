import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider } from '../../hooks/useAuthProvider';
import { FakeAuthApi } from '../fakes/FakeAuthApi';
import { FakeCartApi } from '../fakes/FakeCartApi';
import { useCartApi } from '../../hooks/useCartApi';

function TestComponent({ cartApi }: { cartApi: any }) {
  const { cartItems } = useCartApi(cartApi);
  return (
    <ul>
      {cartItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

describe('CartApi', () => {
  it('logged in user can access their cart', async () => {
    const fakeAuthApi = new FakeAuthApi();
    fakeAuthApi.addUser('test@example.com', 'Test User', 'password123');
    const fakeCartApi = new FakeCartApi();
    await fakeCartApi.addToCart({ id: 'p1', name: 'Product 1', price: 10 }, 'cart-1');
    await fakeCartApi.addToCart({ id: 'p2', name: 'Product 2', price: 20 }, 'cart-1');

    let renderResult: ReturnType<typeof render>;
    await act(async () => {
      renderResult = render(
        <AuthProvider authApi={fakeAuthApi}>
          <TestComponent cartApi={fakeCartApi} />
        </AuthProvider>
      );
    });

    expect(renderResult!.getByText('Product 1')).toBeInTheDocument();
    expect(renderResult!.getByText('Product 2')).toBeInTheDocument();
  });
}); 