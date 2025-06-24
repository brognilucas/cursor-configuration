import { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { ProductApi } from '../types/ProductApi';

export function useProductApi(api: ProductApi) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products()
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
        setLoading(false);
      });
  }, [api]);

  return { products, loading };
} 