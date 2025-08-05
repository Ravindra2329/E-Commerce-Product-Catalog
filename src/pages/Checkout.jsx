import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  TextField,
  Divider,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  Card,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  IconButton,
  Avatar,
  Collapse,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping,
  ShoppingCartCheckout,
  CreditCard,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import GooglePayButton from '@google-pay/button-react';
import PhonePeIcon from '../assets/phonepe.png';
import PaytmIcon from '../assets/paytm.png';

const steps = ['Shipping', 'Payment', 'Review'];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const Checkout = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  const [paymentData, setPaymentData] = useState({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showUpiSection, setShowUpiSection] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error if it's related to this field
    if (error.includes(name) || error.includes('fill in')) {
      setError('');
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentData(prev => ({ ...prev, method }));
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const validateShipping = () => {
    const errors = {};
    let isValid = true;
    
    const fieldsToValidate = {
      firstName: 'First name',
      lastName: 'Last name',
      address: 'Address',
      city: 'City',
      state: 'State',
      zip: 'ZIP code'
    };

    for (const [field, fieldName] of Object.entries(fieldsToValidate)) {
      if (!shippingData[field].trim()) {
        errors[field] = `${fieldName} is required`;
        isValid = false;
      } else if (field === 'zip' && !/^\d{6}$/.test(shippingData.zip)) {
        errors.zip = 'Please enter a valid 6-digit ZIP code';
        isValid = false;
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  const validatePayment = () => {
    const errors = {};
    let isValid = true;

    if (paymentData.method === 'card') {
      if (!paymentData.cardNumber.replace(/\s/g, '')) {
        errors.cardNumber = 'Card number is required';
        isValid = false;
      } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid 16-digit card number';
        isValid = false;
      }

      if (!paymentData.cardName.trim()) {
        errors.cardName = 'Name on card is required';
        isValid = false;
      }

      if (!paymentData.expiry.trim()) {
        errors.expiry = 'Expiry date is required';
        isValid = false;
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry.trim())) {
        errors.expiry = 'Please use MM/YY format';
        isValid = false;
      }

      if (!paymentData.cvv.trim()) {
        errors.cvv = 'CVV is required';
        isValid = false;
      } else if (!/^\d{3,4}$/.test(paymentData.cvv.trim())) {
        errors.cvv = 'Please enter a valid CVV (3-4 digits)';
        isValid = false;
      }
    } else if (paymentData.method === 'upi' && !paymentData.upiId.trim()) {
      errors.upiId = 'UPI ID is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleNext = async () => {
    setError('');
    setFieldErrors({});

    let isValid = false;
    
    if (activeStep === 0) {
      isValid = validateShipping();
    } else if (activeStep === 1) {
      isValid = validatePayment();
    } else {
      isValid = true;
    }

    if (isValid) {
      if (activeStep < steps.length - 1) {
        setActiveStep(prev => prev + 1);
      } else {
        await handlePlaceOrder();
      }
    } else {
      setError("We need a bit more info—please review your input.");
    }
  };

  // Update handlePlaceOrder function:
const handlePlaceOrder = async () => {
  setIsProcessingPayment(true);
  setError('');
  
  try {
    if (!user) {
      throw new Error('You must be logged in to place an order');
    }

    const orderItems = cart.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 1000 ? 0 : 50;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    const orderData = {
      userId: user.id,
      customer: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      items: orderItems,
      shippingInfo: shippingData,
      paymentInfo: {
        method: paymentData.method,
        amount: total,
        transactionId: `TXN_${Date.now()}`,
        ...(paymentData.method === 'card' ? {
          cardLast4: paymentData.cardNumber.slice(-4)
        } : {})
      },
      subtotal,
      shipping,
      tax,
      total,
      status: 'Processing'
    };

    const result = await createOrder(orderData);
    
    if (result.success) {
      clearCart();
      navigate('/order-confirmation', { 
        state: { 
          orderId: result.order.id,
          email: user.email 
        } 
      });
    } else {
      throw new Error(result.error || 'Failed to place order');
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setIsProcessingPayment(false);
  }
};

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Your cart is empty
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={shippingData.firstName}
                    onChange={handleShippingChange}
                    error={!!fieldErrors.firstName}
                    helperText={fieldErrors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={shippingData.lastName}
                    onChange={handleShippingChange}
                    error={!!fieldErrors.lastName}
                    helperText={fieldErrors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    error={!!fieldErrors.address}
                    helperText={fieldErrors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    name="city"
                    value={shippingData.city}
                    onChange={handleShippingChange}
                    error={!!fieldErrors.city}
                    helperText={fieldErrors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="State"
                    name="state"
                    value={shippingData.state}
                    onChange={handleShippingChange}
                    error={!!fieldErrors.state}
                    helperText={fieldErrors.state}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="ZIP Code"
                    name="zip"
                    value={shippingData.zip}
                    onChange={handleShippingChange}
                    error={!!fieldErrors.zip}
                    helperText={fieldErrors.zip}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Country"
                    name="country"
                    value={shippingData.country}
                    onChange={handleShippingChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {activeStep === 1 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={paymentData.method}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                >
                  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCard sx={{ mr: 1 }} />
                          <Typography>Credit/Debit Card</Typography>
                        </Box>
                      }
                    />
                    {paymentData.method === 'card' && (
                      <Grid container spacing={2} sx={{ mt: 1, pl: 4 }}>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Card Number"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handlePaymentChange}
                            placeholder="1234 5678 9012 3456"
                            error={!!fieldErrors.cardNumber}
                            helperText={fieldErrors.cardNumber}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Name on Card"
                            name="cardName"
                            value={paymentData.cardName}
                            onChange={handlePaymentChange}
                            error={!!fieldErrors.cardName}
                            helperText={fieldErrors.cardName}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="Expiry Date"
                            name="expiry"
                            value={paymentData.expiry}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            error={!!fieldErrors.expiry}
                            helperText={fieldErrors.expiry}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="CVV"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            error={!!fieldErrors.cvv}
                            helperText={fieldErrors.cvv}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Paper>

                  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <FormControlLabel
                      value="googlepay"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png" sx={{ width: 24, height: 24, mr: 1 }} />
                          <Typography>Google Pay</Typography>
                        </Box>
                      }
                    />
                    {paymentData.method === 'googlepay' && (
                      <Box sx={{ mt: 2, pl: 4 }}>
                        <GooglePayButton
                          environment="TEST"
                          paymentRequest={{
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            allowedPaymentMethods: [
                              {
                                type: 'CARD',
                                parameters: {
                                  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                  allowedCardNetworks: ['MASTERCARD', 'VISA']
                                },
                                tokenizationSpecification: {
                                  type: 'PAYMENT_GATEWAY',
                                  parameters: {
                                    gateway: 'example',
                                    gatewayMerchantId: 'exampleGatewayMerchantId'
                                  }
                                }
                              }
                            ],
                            merchantInfo: {
                              merchantId: '12345678901234567890',
                              merchantName: 'Demo Merchant'
                            },
                            transactionInfo: {
                              totalPriceStatus: 'FINAL',
                              totalPriceLabel: 'Total',
                              totalPrice: total.toString(),
                              currencyCode: 'INR',
                              countryCode: 'IN'
                            }
                          }}
                          onLoadPaymentData={paymentData => {
                            console.log('Google Pay success', paymentData);
                            handleNext();
                          }}
                          onError={error => {
                            console.error('Google Pay error', error);
                            setError('Google Pay payment failed. Please try another method.');
                          }}
                          existingPaymentMethodRequired={false}
                          buttonColor="black"
                          buttonType="buy"
                        />
                      </Box>
                    )}
                  </Paper>

                  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControlLabel
                        value="upi"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" sx={{ width: 24, height: 24, mr: 1 }} />
                            <Typography>UPI Payment</Typography>
                          </Box>
                        }
                      />
                      <IconButton onClick={() => setShowUpiSection(!showUpiSection)}>
                        {showUpiSection ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                    
                    <Collapse in={paymentData.method === 'upi' || showUpiSection}>
                      <Box sx={{ pl: 4 }}>
                        <TextField
                          fullWidth
                          label="UPI ID"
                          name="upiId"
                          value={paymentData.upiId}
                          onChange={handlePaymentChange}
                          placeholder="yourname@upi"
                          sx={{ mt: 2 }}
                          error={!!fieldErrors.upiId}
                          helperText={fieldErrors.upiId}
                        />
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<Avatar src={PhonePeIcon} sx={{ width: 24, height: 24 }} />}
                            onClick={() => {
                              handlePaymentMethodChange('phonepe');
                              setSnackbarMessage('Redirecting to PhonePe...');
                              setOpenSnackbar(true);
                            }}
                            sx={{ flex: 1 }}
                          >
                            Pay with PhonePe
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Avatar src={PaytmIcon} sx={{ width: 24, height: 24 }} />}
                            onClick={() => {
                              handlePaymentMethodChange('paytm');
                              setSnackbarMessage('Redirecting to Paytm...');
                              setOpenSnackbar(true);
                            }}
                            sx={{ flex: 1 }}
                          >
                            Pay with Paytm
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  </Paper>
                </RadioGroup>
              </FormControl>
            </Paper>
          )}

          {activeStep === 2 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <List>
                {cart.map((item) => (
                  <ListItem key={`${item.id}-${item.color || 'default'}`} divider>
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
                <Typography>{formatCurrency(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax (18%)</Typography>
                <Typography>{formatCurrency(tax)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{formatCurrency(total)}</Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Payment Method: {paymentData.method.toUpperCase()}
              </Typography>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ p: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List dense>
              {cart.map((item) => (
                <ListItem key={`${item.id}-${item.color || 'default'}`} disablePadding>
                  <ListItemText
                    primary={`${item.quantity} × ${item.name}`}
                    secondary={formatCurrency(item.price)}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>{formatCurrency(subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax (18%)</Typography>
              <Typography>{formatCurrency(tax)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="subtitle1">{formatCurrency(total)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isProcessingPayment}
                startIcon={
                  isProcessingPayment ? (
                    <CircularProgress size={24} />
                  ) : activeStep === steps.length - 1 ? (
                    <ShoppingCartCheckout />
                  ) : (
                    <LocalShipping />
                  )
                }
              >
                {isProcessingPayment ? 'Processing...' : 
                 activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;