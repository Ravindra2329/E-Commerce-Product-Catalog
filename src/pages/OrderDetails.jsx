import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Grid,
  Card,
  CardMedia,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  ShoppingBag,
  LocalShipping,
  Payment,
  Home
} from '@mui/icons-material';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, loading, error } = useOrders();
  const order = getOrderById(Number(id));

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

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Order not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  const renderPaymentInfo = () => {
    if (!order.paymentInfo) {
      return (
        <Typography variant="body1" color="text.secondary">
          Payment information not available
        </Typography>
      );
    }

    switch (order.paymentInfo.method) {
      case 'card':
        return (
          <>
            <Typography variant="body1">
              Card ending in ****{order.paymentInfo.cardNumber?.slice(-4) || '----'}
            </Typography>
            <Typography variant="body1">
              Expires {order.paymentInfo.expiry || '--/--'}
            </Typography>
          </>
        );
      case 'upi':
        return (
          <Typography variant="body1">
            Paid via UPI {order.paymentInfo.upiId ? `(${order.paymentInfo.upiId})` : ''}
          </Typography>
        );
      case 'googlepay':
        return (
          <Typography variant="body1">
            Paid via Google Pay
          </Typography>
        );
      case 'phonepe':
        return (
          <Typography variant="body1">
            Paid via PhonePe
          </Typography>
        );
      case 'paytm':
        return (
          <Typography variant="body1">
            Paid via Paytm
          </Typography>
        );
      default:
        return (
          <Typography variant="body1">
            Paid via {order.paymentInfo.method || 'unknown method'}
          </Typography>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ShoppingBag sx={{ mr: 2, fontSize: 40 }} />
        <Box>
          <Typography variant="h4">Order #{order.id}</Typography>
          <Typography variant="body1" color="text.secondary">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Chip
          label={order.status}
          color={
            order.status === 'processing' ? 'warning' :
            order.status === 'shipped' ? 'info' :
            order.status === 'delivered' ? 'success' : 'error'
          }
          sx={{ ml: 'auto', fontSize: '1rem', padding: '8px 16px' }}
        />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <List>
              {order.items.map((item, index) => (
                <ListItem key={index} divider>
                  <CardMedia
                    component="img"
                    image={item.image || '/default-product.png'}
                    alt={item.name}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'contain', 
                      mr: 2,
                      backgroundColor: '#f5f5f5'
                    }}
                    onError={(e) => {
                      e.target.src = '/default-product.png';
                    }}
                  />
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
              <Typography>Tax</Typography>
              <Typography>{formatCurrency(order.tax)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{formatCurrency(order.total)}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalShipping sx={{ mr: 1 }} />
              <Typography variant="h6">Shipping Information</Typography>
            </Box>
            <Typography variant="body1">
              {order.shippingInfo.firstName} {order.shippingInfo.lastName}
            </Typography>
            <Typography variant="body1">
              {order.shippingInfo.address}
            </Typography>
            <Typography variant="body1">
              {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zip}
            </Typography>
            <Typography variant="body1">
              {order.shippingInfo.country}
            </Typography>
          </Card>

          <Card elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Payment sx={{ mr: 1 }} />
              <Typography variant="h6">Payment Information</Typography>
            </Box>
            {renderPaymentInfo()}
            <Typography variant="body1" sx={{ mt: 1 }}>
              Total Paid: {formatCurrency(order.total)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Transaction ID: {order.paymentInfo?.transactionId || 'N/A'}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Continue Shopping
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/orders')}
        >
          View All Orders
        </Button>
      </Box>
    </Container>
  );
};

export default OrderDetails;