import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const normalizeProduct = (p: any) => {
  const stockQuantity = p?.stockQuantity ?? p?.stock_quantity ?? undefined;
  const explicitInStock = p?.inStock ?? p?.in_stock;
  const derivedInStock =
    explicitInStock !== undefined ? explicitInStock : stockQuantity !== undefined ? stockQuantity > 0 : true;

  const mongoId = p?._id ? String(p._id) : null;
  const fallbackId = p?.id ? String(p.id) : null;

  return {
    ...p,
    id: mongoId || fallbackId || '',
    _id: mongoId || fallbackId || undefined,
    images: p?.images || [],
    originalPrice: p?.originalPrice ?? p?.original_price ?? p?.originalprice ?? undefined,
    inStock: derivedInStock,
    stockQuantity,
    newArrival: p?.newArrival ?? p?.new_arrival ?? false,
  };
};

export interface Product {
  _id?: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  condition: 'excellent' | 'good' | 'fair';
  size: string;
  gender?: 'men' | 'women' | 'unisex';
  color?: string;
  fabric?: string;
  measurements?: Record<string, string>;
  description: string;
  styleSuggestions?: string[];
  inStock?: boolean;
  stockQuantity?: number;
  featured?: boolean;
  newArrival?: boolean;
  sustainabilityScore?: number;
  createdAt?: string;
}

export const useProducts = (filters: Record<string, any> = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Add filters to query string
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });

        const url = `${API_BASE_URL}/api/products${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        const normalized = Array.isArray(data) ? data.map(normalizeProduct) : [];
        setProducts(normalized);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters), reloadFlag]);

  const refetch = () => setReloadFlag((n) => n + 1);

  return { products, loading, error, refetch };
};

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

        if (!response.ok) throw new Error('Product not found');

        const data = await response.json();
        setProduct(normalizeProduct(data));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
