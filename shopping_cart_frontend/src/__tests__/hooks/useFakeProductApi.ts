import { useState, useEffect } from 'react';
import { Product } from '../../types/Product'

export function useFakeProductApi() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: '1', name: 'Apple', price: 1.5 },
        { id: '2', name: 'Banana', price: 0.99 },
      ]);
      setLoading(false);
    }, 100);
  }, []);

  return { products, loading };
} 