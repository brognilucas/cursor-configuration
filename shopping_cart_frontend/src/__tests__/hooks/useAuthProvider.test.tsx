import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../hooks/useAuthProvider';
import { FakeAuthApi } from '../fakes/FakeAuthApi';

function TestComponent() {
  const { user, signin } = useAuth();
  React.useEffect(() => {
    signin('test@example.com', 'password123');
  }, [signin]);
  return <div>{user ? user.email : 'no-user'}</div>;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('user stays logged in across page refreshes', async () => {
    const fakeApi = new FakeAuthApi();
    fakeApi.addUser('test@example.com', 'Test User', 'password123');

    // First render: login
    let utils = render(
      <AuthProvider authApi={fakeApi}>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for login
    await act(async () => {
      await Promise.resolve();
    });
    expect(utils.getByText('test@example.com')).toBeInTheDocument();

    // Simulate page refresh (re-mount context)
    utils.unmount();
    utils = render(
      <AuthProvider authApi={fakeApi}>
        <TestComponent />
      </AuthProvider>
    );
    // User should still be logged in
    expect(utils.getByText('test@example.com')).toBeInTheDocument();
  });
}); 