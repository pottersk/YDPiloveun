'use client';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('wishlist');
      if (savedItems) {
        try {
          return JSON.parse(savedItems);
        } catch (error) {
          console.error('Failed to parse wishlist from localStorage:', error);
          localStorage.removeItem('wishlist');
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (wishlistItems.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } else {
      localStorage.removeItem('wishlist');
    }
    
  }, [wishlistItems]);

  const addToWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      if (!prev.some(item => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const contextValue = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  }), [wishlistItems, addToWishlist, removeFromWishlist, isInWishlist]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}