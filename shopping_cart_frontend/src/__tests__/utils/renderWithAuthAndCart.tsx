import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../hooks/useAuthProvider';
import { AuthResponse, AuthApi } from '../../types/Auth';

interface RenderWithAuthAndCartOptions {
  user: AuthResponse;
  authApi: AuthApi;
}

export function renderWithAuthAndCart(
  ui: React.ReactElement,
  { user, authApi }: RenderWithAuthAndCartOptions
) {
  return render(
    <AuthProvider authApi={authApi}>
      {ui}
    </AuthProvider>
  );
} 