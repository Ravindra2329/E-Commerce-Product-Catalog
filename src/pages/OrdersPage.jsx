import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  
  Stack
} from '@mui/material';
import { ShoppingBag,  } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const OrdersPage = () => {
  const { user } = useAuth();
  const { getUserOrders, loading, error } = useOrders();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const orders = user ? getUserOrders(user.id) : [];

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You need to be logged in to view your orders
        </Alert>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          You haven't placed any orders yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start shopping to see your orders here
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ShoppingBag sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4">My Orders</Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip 
          label="All" 
          onClick={() => setFilter('all')} 
          color={filter === 'all' ? 'primary' : 'default'}
        />
        <Chip 
          label="Processing" 
          onClick={() => setFilter('processing')} 
          color={filter === 'processing' ? 'primary' : 'default'}
        />
        <Chip 
          label="Shipped" 
          onClick={() => setFilter('shipped')} 
          color={filter === 'shipped' ? 'primary' : 'default'}
        />
        <Chip 
          label="Delivered" 
          onClick={() => setFilter('delivered')} 
          color={filter === 'delivered' ? 'primary' : 'default'}
        />
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrdersPage;