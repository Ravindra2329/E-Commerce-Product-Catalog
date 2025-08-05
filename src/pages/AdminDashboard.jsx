import React, { useState, useEffect,  useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { useOrders } from '../context/OrdersContext';
import {
  Container,
  Typography,
  Box,
  
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Button,
  LinearProgress,
  
} from '@mui/material';
import {
  Inventory,
  LocalShipping,
  People,
  Refresh
} from '@mui/icons-material';
import ProductsTab from './ProductsTab';
import OrdersTab from './OrdersTab';
import CustomersTab from './CustomersTab';
import StatCard from '../components/StatCard ';
import AttachMoney from '@mui/icons-material/AttachMoney';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { products: contextProducts, loading: productsLoading } = useProducts();
  const { orders: contextOrders } = useOrders();
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState({
    status: 'all',
    sort: 'newest'
  });
  const [page, setPage] = useState(1);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    activeCustomers: 0
  });

  const rowsPerPage = 8;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const updateStats = useCallback((products, orders, customers) => {
    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(o => o.status === 'Processing').length,
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.status === 'active').length
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const mockCustomers = [
        { 
          id: 1, 
          name: 'John Doe', 
          email: 'john@example.com', 
          phone: '+1 555-123-4567',
          address: '123 Main St, New York, NY 10001',
          orders: 5, 
          totalSpent: 1245.99,
          joinDate: '2022-01-15',
          lastOrder: '2023-04-10',
          status: 'active'
        },
        { 
          id: 2, 
          name: 'Jane Smith', 
          email: 'jane@example.com', 
          phone: '+1 555-987-6543',
          address: '456 Oak Ave, Los Angeles, CA 90001',
          orders: 3, 
          totalSpent: 789.50,
          joinDate: '2022-03-22',
          lastOrder: '2023-03-15',
          status: 'active'
        },
        { 
          id: 3, 
          name: 'Bob Johnson', 
          email: 'bob@example.com', 
          phone: '+1 555-456-7890',
          address: '789 Pine Rd, Chicago, IL 60601',
          orders: 2, 
          totalSpent: 345.75,
          joinDate: '2022-05-10',
          lastOrder: '2023-01-20',
          status: 'inactive'
        }
      ];
      
      setCustomers(mockCustomers);
      updateStats(contextProducts, contextOrders, mockCustomers);
    } catch (error) {
      showSnackbar('Failed to load data', 'error');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [contextProducts, contextOrders, showSnackbar, updateStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (contextProducts && contextProducts.length > 0) {
      updateStats(contextProducts, contextOrders, customers);
    }
  }, [contextProducts, contextOrders, customers, updateStats]);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Unauthorized access. Please log in as an administrator.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={fetchData} aria-label="refresh">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => {
              logout();
              navigate('/admin-login');
            }}
            aria-label="logout"
          >
            Logout
          </Button>
          <Chip 
            avatar={<Avatar>{user.name.charAt(0)}</Avatar>}
            label={user.name}
            variant="outlined"
          />
        </Box>
      </Box>

      {loading || productsLoading ? (
        <LinearProgress />
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2, mb: 4 }}>
            <StatCard 
              icon={<Inventory fontSize="large" />} 
              title="Products" 
              value={stats.totalProducts} 
              color="#4caf50"
              trend="up"
            />
            <StatCard 
              icon={<LocalShipping fontSize="large" />} 
              title="Orders" 
              value={stats.totalOrders} 
              color="#2196f3"
              trend="up"
            />
            <StatCard 
              icon={<AttachMoney fontSize="large" />} 
              title="Revenue" 
              value={formatCurrency(stats.totalRevenue)} 
              color="#ff9800"
              trend="up"
            />
            <StatCard 
              icon={<People fontSize="large" />} 
              title="Customers" 
              value={stats.totalCustomers} 
              color="#9c27b0"
              trend="up"
            />
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin tabs">
              <Tab label="Products" icon={<Inventory />} iconPosition="start" />
              <Tab label="Orders" icon={<LocalShipping />} iconPosition="start" />
              <Tab label="Customers" icon={<People />} iconPosition="start" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <ProductsTab 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              page={page}
              rowsPerPage={rowsPerPage}
              handlePageChange={handlePageChange}
              showSnackbar={showSnackbar}
            />
          )}

          {activeTab === 1 && (
            <OrdersTab 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter={filter}
              setFilter={setFilter}
              page={page}
              rowsPerPage={rowsPerPage}
              handlePageChange={handlePageChange}
              showSnackbar={showSnackbar}
              formatCurrency={formatCurrency}
            />
          )}

          {activeTab === 2 && (
            <CustomersTab 
              customers={customers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              customerFilter={customerFilter}
              setCustomerFilter={setCustomerFilter}
              page={page}
              rowsPerPage={rowsPerPage}
              handlePageChange={handlePageChange}
              showSnackbar={showSnackbar}
              formatCurrency={formatCurrency}
            />
          )}

          
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity}
              sx={{ width: '100%' }}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
};



export default AdminDashboard;