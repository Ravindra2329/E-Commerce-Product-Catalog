import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Alert,
  IconButton,
  TextField,
  Snackbar
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ArrowBack,
  ShoppingCartCheckout
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? (subtotal > 50 ? 0 : 5.99) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (itemKey, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemKey);
      showSnackbar('Item removed from cart', 'info');
    } else {
      updateQuantity(itemKey, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showSnackbar('Your cart is empty', 'error');
      return;
    }
    navigate('/checkout');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ flex: 1 }}>
          Your Shopping Cart
        </Typography>
        <Typography variant="subtitle1">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </Typography>
      </Box>

      {cart.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          Your cart is empty.{' '}
          <Link to="/" style={{ marginLeft: '5px', textDecoration: 'underline' }}>
            Continue Shopping
          </Link>
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Card 
                key={item.key}
                sx={{ 
                  display: 'flex', 
                  mb: 2,
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <Link 
                  to={`/product/${item.id}`} 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      objectFit: 'contain', 
                      p: 1,
                      backgroundColor: (theme) => theme.palette.grey[100]
                    }}
                    image={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      e.target.style.backgroundColor = '#f5f5f5';
                    }}
                  />
                </Link>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      component={Link} 
                      to={`/product/${item.id}`}
                      sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {item.name}
                    </Typography>
                    {item.variant && (
                      <Typography variant="body2" color="text.secondary">
                        Variant: {item.variant.name}
                      </Typography>
                    )}
                    <Typography color="primary" fontWeight="bold">
                      ${item.price.toFixed(2)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <IconButton 
                        onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                        size="small"
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.key, newValue);
                        }}
                        type="number"
                        inputProps={{ min: 1 }}
                        sx={{ 
                          width: 60,
                          mx: 1,
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                            py: 0.5
                          }
                        }}
                        size="small"
                      />
                      <IconButton 
                        onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                        size="small"
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      startIcon={<Delete />} 
                      onClick={() => {
                        removeFromCart(item.key);
                        showSnackbar(`${item.name} removed from cart`, 'info');
                      }}
                      color="error"
                      size="small"
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            ))}
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal ({cart.length} items)</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>
                  {subtotal > 50 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax (estimated)</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingCartCheckout />}
                onClick={handleProceedToCheckout}
                disabled={cart.length === 0}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="medium"
                onClick={() => {
                  clearCart();
                  showSnackbar('Cart cleared', 'info');
                }}
                disabled={cart.length === 0}
                sx={{
                  mt: 2,
                  py: 1,
                  textTransform: 'none'
                }}
              >
                Clear Cart
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                or{' '}
                <Link to="/" style={{ textDecoration: 'underline' }}>
                  Continue Shopping
                </Link>
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;