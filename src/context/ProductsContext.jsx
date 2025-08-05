import { createContext, useContext, useState, useEffect } from 'react';
import defaultProducts from '../data/products';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize with default products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (process.env.NODE_ENV === 'development') {
          await new Promise(resolve => setTimeout(resolve, 500));
          setProducts(defaultProducts);
          return;
        }

        const response = await fetch('/api/products', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Received HTML response - check API endpoint');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.length > 0 ? data : defaultProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      const productWithDefaults = { 
        ...newProduct,
        id: Date.now(),
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        rating: 4.0,
        reviews: [],
        inStock: newProduct.stock > 0,
        colors: Array.isArray(newProduct.colors) ? newProduct.colors : ['Black'],
        features: Array.isArray(newProduct.features) ? newProduct.features : ['New feature'],
        warranty: newProduct.warranty || '1 year warranty',
        createdAt: new Date().toISOString()
      };
      
      setProducts(prev => [...prev, productWithDefaults]);
      
      if (process.env.NODE_ENV !== 'development') {
        await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productWithDefaults),
        });
      }
      
      return { success: true, product: productWithDefaults };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const updated = {
        ...updatedProduct,
        price: parseFloat(updatedProduct.price),
        stock: parseInt(updatedProduct.stock),
        inStock: updatedProduct.stock > 0,
        colors: Array.isArray(updatedProduct.colors) ? updatedProduct.colors : ['Black'],
        features: Array.isArray(updatedProduct.features) ? updatedProduct.features : ['New feature'],
        updatedAt: new Date().toISOString()
      };

      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updated : product
        )
      );

      if (process.env.NODE_ENV !== 'development') {
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updated),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      setProducts(prev => prev.filter(product => product.id !== id));

      if (process.env.NODE_ENV !== 'development') {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  };

  const addReview = async (productId, review) => {
    try {
      const reviewWithDefaults = {
        ...review,
        id: Date.now(),
        date: new Date().toISOString(),
        verified: true
      };
      
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? {
                ...product,
                reviews: [...product.reviews, reviewWithDefaults],
                rating: calculateNewRating(product.reviews, reviewWithDefaults.rating)
              }
            : product
        )
      );

      if (process.env.NODE_ENV !== 'development') {
        await fetch(`/api/products/${productId}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewWithDefaults),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding review:', error);
      return { success: false, error: error.message };
    }
  };

  const calculateNewRating = (existingReviews, newRating) => {
    const totalRatings = existingReviews.reduce((sum, review) => sum + review.rating, 0);
    const average = (totalRatings + newRating) / (existingReviews.length + 1);
    return parseFloat(average.toFixed(1));
  };

  const addColor = async (productId, color) => {
    try {
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? {
                ...product,
                colors: [...new Set([...product.colors, color])]
              }
            : product
        )
      );

      if (process.env.NODE_ENV !== 'development') {
        await fetch(`/api/products/${productId}/colors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ color }),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding color:', error);
      return { success: false, error: error.message };
    }
  };

  const removeColor = async (productId, color) => {
    try {
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? {
                ...product,
                colors: product.colors.filter(c => c !== color)
              }
            : product
        )
      );

      if (process.env.NODE_ENV !== 'development') {
        await fetch(`/api/products/${productId}/colors`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ color }),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing color:', error);
      return { success: false, error: error.message };
    }
  };

  const addFeature = async (productId, feature) => {
    try {
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? {
                ...product,
                features: [...new Set([...product.features, feature])]
              }
            : product
        )
      );

      if (process.env.NODE_ENV !== 'development') {
        await fetch(`/api/products/${productId}/features`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature }),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding feature:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFeature = async (productId, feature) => {
    try {
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? {
                ...product,
                features: product.features.filter(f => f !== feature)
              }
            : product
        )
      );

      if (process.env.NODE_ENV !== 'development') {
        await fetch(`/api/products/${productId}/features`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature }),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing feature:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <ProductsContext.Provider 
      value={{ 
        products, 
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        addColor,
        removeColor,
        addFeature,
        removeFeature,
        refreshProducts: () => window.location.reload()
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};