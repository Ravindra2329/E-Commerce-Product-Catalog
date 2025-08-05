import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize with mock data if none exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        // Initialize mock users if none exist
        const mockUsers = [
          { 
            id: 1,
            email: 'admin@example.com', 
            password: 'admin123', 
            name: 'Admin User', 
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            role: 'admin',
            permissions: ['manage_products', 'view_dashboard', 'manage_users']
          },
          { 
            id: 2,
            email: 'user@example.com', 
            password: 'user123', 
            name: 'Regular User', 
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
            role: 'user',
            permissions: []
          }
        ];
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      } else {
        setUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

 const register = async (userData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');

    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      permissions: [],
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

    return { 
      success: true
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Registration failed' 
    };
  }
};


  const login = async (credentials) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get mock users
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || []);
      
      // Find user
      const foundUser = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Create user session (without password)
      const { password, ...userSession } = foundUser;
      localStorage.setItem('user', JSON.stringify(userSession));
      setUser(userSession);

      // Initialize mock orders for demo user
      if (foundUser.email === 'user@example.com') {
        initializeMockOrders(foundUser.id);
      }

      return { 
        success: true, 
        user: userSession 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const initializeMockOrders = (userId) => {
    const mockOrders = [
      {
        id: 1001,
        userId,
        items: [
          { 
            productId: 1, 
            name: 'Wireless Headphones', 
            price: 99.99, 
            quantity: 1, 
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' 
          },
          { 
            productId: 2, 
            name: 'Smart Watch', 
            price: 199.99, 
            quantity: 1, 
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' 
          }
        ],
        shippingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA',
          phone: '+1234567890'
        },
        paymentInfo: {
          method: 'credit_card',
          cardLast4: '4242'
        },
        subtotal: 299.98,
        shipping: 0,
        tax: 23.99,
        total: 323.97,
        status: 'delivered',
        trackingNumber: 'TRK123456789',
        createdAt: '2023-05-15T10:30:00Z'
      },
      {
        id: 1002,
        userId,
        items: [
          { 
            productId: 3, 
            name: 'Bluetooth Speaker', 
            price: 79.99, 
            quantity: 2, 
            image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb' 
          }
        ],
        shippingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA',
          phone: '+1234567890'
        },
        paymentInfo: {
          method: 'credit_card',
          cardLast4: '4242'
        },
        subtotal: 159.98,
        shipping: 5.99,
        tax: 12.80,
        total: 178.77,
        status: 'shipped',
        trackingNumber: 'TRK987654321',
        createdAt: '2023-06-01T14:15:00Z'
      }
    ];
    
    localStorage.setItem('orders', JSON.stringify(mockOrders));
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { 
      state: { 
        message: 'You have been successfully logged out.' 
      } 
    });
  };

  const updateUserProfile = async (formData) => {
    try {
      if (!user) throw new Error('Not authenticated');
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing mock users
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || []);
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) throw new Error('User not found');
      
      // Extract form data
      const name = formData.get('name');
      const email = formData.get('email');
      const imageFile = formData.get('image');
      
      // Create updated user object
      const updatedUser = { 
        ...mockUsers[userIndex],
        name: name || mockUsers[userIndex].name,
        email: email || mockUsers[userIndex].email,
        // In a real app, you would upload the image to a server and get back a URL
        image: imageFile ? URL.createObjectURL(imageFile) : mockUsers[userIndex].image
      };
      
      // Update mock database
      mockUsers[userIndex] = updatedUser;
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      
      // Update current session (without password)
      const { password, ...userSession } = updatedUser;
      localStorage.setItem('user', JSON.stringify(userSession));
      setUser(userSession);
      
      return { 
        success: true, 
        user: userSession,
        message: 'Profile updated successfully!' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to update profile' 
      };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) throw new Error('Not authenticated');
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing mock users
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || []);
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) throw new Error('User not found');
      
      // Verify current password
      if (mockUsers[userIndex].password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      mockUsers[userIndex].password = newPassword;
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      
      return { 
        success: true,
        message: 'Password changed successfully!' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to change password' 
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUserProfile,
        changePassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        userPermissions: user?.permissions || []
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}