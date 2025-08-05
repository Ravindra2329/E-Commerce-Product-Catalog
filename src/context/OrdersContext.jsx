import { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize state with localStorage data if available
  useEffect(() => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('shopEaseOrders');
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error reading from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist orders to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shopEaseOrders', JSON.stringify(orders));
    } catch (err) {
      setError('Failed to save orders');
      console.error('Error writing to localStorage:', err);
    }
  }, [orders]);

  const createOrder = (orderData) => {
  setLoading(true);
  try {
    const newOrder = {
      ...orderData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      // Ensure customer name is properly set
      customer: orderData.customer || `${orderData.user?.firstName || ''} ${orderData.user?.lastName || ''}`.trim()
    };
    
    setOrders(prev => [...prev, newOrder]);
    return { success: true, order: newOrder };
  } catch (err) {
    setError('Failed to create order');
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
};

  const updateOrderStatus = (orderId, newStatus) => {
    setLoading(true);
    try {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
      return { success: true };
    } catch (err) {
      setError('Failed to update order status');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = (userId) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <OrdersContext.Provider 
      value={{ 
        orders,
        loading,
        error,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getUserOrders,
        getAllOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within a OrdersProvider');
  }
  return context;
};