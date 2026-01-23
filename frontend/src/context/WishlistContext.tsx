import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Product } from '@/types/product';

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: Product[] };

interface WishlistContextType {
  state: WishlistState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  clear: () => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'ThriftThreads-wishlist';

const getProductId = (product: Product | { id?: string; _id?: string }) =>
  (product.id || (product as any)._id || '').toString();

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const id = getProductId(action.product);
      if (!id) return state;
      if (state.items.some((item) => getProductId(item) === id)) return state;
      return { ...state, items: [...state.items, action.product] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => getProductId(item) !== action.productId),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'LOAD':
      return { ...state, items: action.items };
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD', items: parsed });
      } catch (err) {
        console.error('Failed to parse wishlist:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', product });
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId });
  const toggleItem = (product: Product) => {
    const id = getProductId(product);
    if (!id) return;
    if (state.items.some((item) => getProductId(item) === id)) {
      dispatch({ type: 'REMOVE_ITEM', productId: id });
    } else {
      dispatch({ type: 'ADD_ITEM', product });
    }
  };
  const clear = () => dispatch({ type: 'CLEAR' });
  const isInWishlist = (productId: string) => state.items.some((item) => getProductId(item) === productId);
  const totalItems = state.items.length;

  return (
    <WishlistContext.Provider value={{ state, addItem, removeItem, toggleItem, clear, isInWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
