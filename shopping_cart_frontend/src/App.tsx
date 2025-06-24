import React from 'react';
import { ProductListContainer } from './containers/ProductListContainer';
import { RealProductApi } from './api/ProductApi';
import { RealCartApi } from './api/CartApi';

const productApi = new RealProductApi();
const cartApi = new RealCartApi();

export const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        <h1>Shopping Cart</h1>
      </header>
      <main>
        <ProductListContainer 
          productApi={productApi}
          cartApi={cartApi}
        />
      </main>
    </div>
  );
}; 