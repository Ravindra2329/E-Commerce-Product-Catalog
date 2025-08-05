import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoading]);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCart(prevCart => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];

      const itemKey = selectedVariant
        ? `${product.id}-${selectedVariant.id}`
        : product.id;

      const existingItem = currentCart.find(item => item?.key === itemKey);

      if (existingItem) {
        return currentCart.map(item =>
          item.key === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = {
          key: itemKey,
          id: product.id,
          name: product.name,
          price: selectedVariant?.price || product.price,
          image: getProductImage(product, selectedVariant),
          quantity,
          variant: selectedVariant,
          productData: product
        };
        return [...currentCart, newItem];
      }
    });
  };

  const getProductImage = (product, variant) => {
    // Priority order for images:
    // 1. Variant image
    // 2. First product image
    // 3. Placeholder image
    if (variant?.image) return variant.image;
    if (product?.images?.[0]?.url) return product.images[0].url;
    if (typeof product?.image === 'string') return product.image;
    return 'https://via.placeholder.com/150?text=No+Image';
  };

  const removeFromCart = (itemKey) => {
    setCart(prevCart => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      return currentCart.filter(item => item?.key !== itemKey);
    });
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemKey);
      return;
    }

    setCart(prevCart => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      return currentCart.map(item =>
        item?.key === itemKey ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (item?.quantity || 0), 0)
    : 0;

  const subtotal = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart: Array.isArray(cart) ? cart : [],
        cartCount,
        subtotal,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}