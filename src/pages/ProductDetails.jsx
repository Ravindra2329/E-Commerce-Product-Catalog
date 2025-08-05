import React, { useState } from 'react';
import { useParams, useNavigate, } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext'; 
import {
  Container,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Card,
  CardMedia,
  Paper,
  Chip,
  Rating,
  Box,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  AssignmentReturn,
  VerifiedUser,
  ArrowBack
} from '@mui/icons-material';

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const isWishlisted = isInWishlist(product?.id);

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Product not found</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }} 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, color: selectedColor });
    showSnackbar(`${product.name} added to cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart({ ...product, color: selectedColor });
    navigate('/cart');
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showSnackbar('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showSnackbar('Added to wishlist', 'success');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: `${window.location.origin}/product/${product.id}`,
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
        showSnackbar('Link copied to clipboard!', 'success');
      }
    } catch (err) {
      showSnackbar('Failed to share product', 'error');
    }
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
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="500"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
              <Tooltip title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
                <Button 
                  variant="outlined" 
                  startIcon={isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
                  onClick={toggleWishlist}
                >
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </Button>
              </Tooltip>
              <Tooltip title="Share this product">
                <Button variant="outlined" startIcon={<Share />} onClick={handleShare}>
                  Share
                </Button>
              </Tooltip>
            </Box>
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviews} reviews)
            </Typography>
            {product.inStock ? (
              <Chip label="In Stock" color="success" size="small" sx={{ ml: 2 }} />
            ) : (
              <Chip label="Out of Stock" color="error" size="small" sx={{ ml: 2 }} />
            )}
          </Box>

          <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
            ${product.price.toFixed(2)}
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          {/* Color Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Colors:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.colors.map((color) => (
                <Chip 
                  key={color} 
                  label={color} 
                  variant={selectedColor === color ? 'filled' : 'outlined'}
                  color={selectedColor === color ? 'primary' : 'default'}
                  onClick={() => setSelectedColor(color)}
                  sx={{ 
                    borderWidth: 2,
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Key Features */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Key Features:
            </Typography>
            <List dense>
              {product.features.map((feature, index) => (
                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={`• ${feature}`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Warranty Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <VerifiedUser color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {product.warranty}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              sx={{ 
                flex: 1,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleBuyNow}
              disabled={!product.inStock}
              sx={{ 
                flex: 1,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Buy Now
            </Button>
          </Box>

          {/* Shipping Info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 3, 
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2
          }}>
            <LocalShipping color="action" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Free shipping on orders over $50
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Delivery in 3-5 business days
              </Typography>
            </Box>
          </Box>

          {/* Return Policy */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 1, 
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2
          }}>
            <AssignmentReturn color="action" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Easy 30-day returns
              </Typography>
              <Typography variant="caption" color="text.secondary">
                No questions asked return policy
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

export default ProductDetails;