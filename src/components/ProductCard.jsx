import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext'; 
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Badge
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  ShoppingCart,
  Share,
  Bolt
} from '@mui/icons-material';

const ProductCard = ({ product, }) => {
    const { addToCart } = useCart();
  
  const { 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist,
    wishlistCount
  } = useWishlist();
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  // Memoize price calculation
  const getFinalPrice = useCallback(() => {
    if (product.discount) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }, [product.price, product.discount]);

  const handleAddToCart = async () => {
    setIsCartLoading(true);
    try {
      await addToCart(product);
      showSnackbar(`${product.name} added to cart!`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showSnackbar('Failed to add to cart. Please try again.', 'error');
    } finally {
      setIsCartLoading(false);
    }
  };

  const toggleWishlist = async () => {
    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        showSnackbar(`${product.name} removed from wishlist`, 'info');
      } else {
        await addToWishlist(product);
        showSnackbar(`${product.name} added to wishlist`, 'success');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showSnackbar('Failed to update wishlist. Please try again.', 'error');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: product.name,
        text: `Check out ${product.name} for $${getFinalPrice().toFixed(2)}`,
        url: `${window.location.origin}/product/${product.id}`,
      };
      
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        showSnackbar('Link copied to clipboard!', 'success');
      } else {
        showSnackbar('Sharing not supported in this browser', 'info');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing product:', err);
        showSnackbar('Failed to share product', 'error');
      }
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

  // Calculate if product is a bestseller (for demo purposes)
  const isBestseller = product.rating >= 4.5 && product.reviews >= 50;

  return (
    <>
      <Card 
        sx={{ 
          maxWidth: 280, 
          margin: 'auto', 
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
          },
          position: 'relative'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image with Action Buttons */}
        <Box sx={{ position: 'relative' }}>
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <CardMedia
              component="img"
              height="200"
              image={product.image}
              alt={product.name}
              loading="lazy"
              sx={{ 
                objectFit: 'cover',
                backgroundColor: '#f5f5f5',
                transition: 'opacity 0.3s',
                '&[loading="lazy"]': { opacity: 0 },
                '&[loading="eager"], &[loading="auto"]': { opacity: 1 }
              }}
              onLoad={(e) => { e.target.style.opacity = 1; }}
            />
          </Link>
          
          {/* Quick actions on hover */}
          {isHovered && (
            <Box sx={{ 
              position: 'absolute', 
              bottom: 8, 
              right: 8, 
              display: 'flex', 
              gap: 1,
              transition: 'opacity 0.3s',
              opacity: isHovered ? 1 : 0
            }}>
              <Tooltip title="Quick add to cart">
                <IconButton
                  aria-label="Quick add to cart"
                  onClick={handleAddToCart}
                  disabled={isCartLoading}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                  }}
                >
                  {isCartLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <ShoppingCart color="primary" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Top action buttons */}
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Tooltip title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
              <IconButton 
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={toggleWishlist}
                disabled={isWishlistLoading}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                }}
              >
                {isWishlistLoading ? (
                  <CircularProgress size={20} />
                ) : isWishlisted ? (
                  <Favorite color="error" aria-hidden="true" />
                ) : (
                  <FavoriteBorder color="primary" aria-hidden="true" />
                )}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share product">
              <IconButton 
                aria-label="Share product"
                onClick={handleShare}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                }}
              >
                <Share color="primary" aria-hidden="true" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Product badges */}
          {product.isNew && (
            <Chip 
              label="NEW" 
              color="success" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                left: 8, 
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }} 
            />
          )}
          
          {product.discount && (
            <Chip 
              label={`${product.discount}% OFF`} 
              color="error" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                bottom: 8, 
                left: 8, 
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }} 
            />
          )}

          {isBestseller && (
            <Chip 
              label="Bestseller" 
              color="warning" 
              size="small" 
              icon={<Bolt fontSize="small" />}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                left: product.isNew ? 60 : 8,
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }} 
            />
          )}
        </Box>

        {/* Product Info */}
        <CardContent sx={{ padding: 2 }}>
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                height: '2.8em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.4em'
              }}
            >
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating 
                value={product.rating || 4.5} 
                precision={0.5} 
                readOnly 
                size="small" 
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviews || 24} reviews)
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                ${getFinalPrice().toFixed(2)}
              </Typography>
              {product.originalPrice && (
                <Typography 
                  component="span" 
                  variant="body2" 
                  color="text.disabled"
                  sx={{ textDecoration: 'line-through', ml: 1 }}
                >
                  ${product.originalPrice.toFixed(2)}
                </Typography>
              )}
            </Box>
          </Link>
        </CardContent>

        {/* Add to Cart Button */}
        <CardActions sx={{ padding: 2, paddingTop: 0 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={isCartLoading ? <CircularProgress size={20} /> : <ShoppingCart />}
            onClick={handleAddToCart}
            disabled={isCartLoading}
            sx={{
              py: 1,
              borderRadius: 1,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }
            }}
          >
            {isCartLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </CardActions>
      </Card>

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
          elevation={6}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default React.memo(ProductCard);