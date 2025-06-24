import { useState, useEffect } from 'react';
import { Product } from '../types/Product';

export interface ProductApi {
  getProducts: () => Promise<Product[]>;
}

export function useProductApi(api: ProductApi) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
        setLoading(false);
      });
  }, [api]);

  return { products, loading };
} 