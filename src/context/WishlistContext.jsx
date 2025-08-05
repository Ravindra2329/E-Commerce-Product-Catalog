import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize state with localStorage data if available
  useEffect(() => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (err) {
      setError('Failed to load wishlist');
      console.error('Error reading from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (err) {
      setError('Failed to save wishlist');
      console.error('Error writing to localStorage:', err);
    }
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (!product || !product.id) {
      setError('Invalid product: Product or product.id is missing');
      return false;
    }

    setWishlist((prev) => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        setError('Product is already in wishlist');
        return prev;
      }
      return [...prev, product];
    });
    return true;
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter(item => item.id !== productId));
    return true;
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    return true;
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        wishlistCount: wishlist.length,
        loading,
        error,
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};