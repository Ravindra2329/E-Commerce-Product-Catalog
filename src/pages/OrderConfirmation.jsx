import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrdersContext';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { CheckCircle, ShoppingBag, Home } from '@mui/icons-material';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const orderId = location.state?.orderId;
  const email = location.state?.email;
  const order = orderId ? getOrderById(orderId) : null;

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Order not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // Calculate estimated delivery date (3-5 business days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3 + Math.floor(Math.random() * 3));

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle color="success" sx={{ fontSize: 80 }} />
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your order has been placed successfully
        </Typography>
        <Chip
          label={`Order #${order.id}`}
          color="primary"
          sx={{ mt: 2, fontSize: '1rem', padding: '8px 16px' }}
        />
      </Box>

      {email && (
        <Alert severity="info" sx={{ mb: 3 }}>
          A confirmation email has been sent to {email}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingBag sx={{ mr: 1 }} /> Order Summary
        </Typography>
        <List>
          {order.items.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body1">
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal</Typography>
          <Typography>{formatCurrency(order.subtotal)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Shipping</Typography>
          <Typography>
            {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Tax (18%)</Typography>
          <Typography>{formatCurrency(order.tax)}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">{formatCurrency(order.total)}</Typography>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Delivery Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Estimated Delivery: {deliveryDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </Typography>
        <Typography variant="body1">
          Shipping to: {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.zip}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/orders')}
        >
          View My Orders
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmation;