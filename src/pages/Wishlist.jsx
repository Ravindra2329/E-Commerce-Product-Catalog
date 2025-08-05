import React from 'react';
import { 
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { Favorite, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = ({ addToCart }) => {
  const { 
    wishlist, 
    removeFromWishlist,
    wishlistCount,
    clearWishlist,
    isLoading,
    error
  } = useWishlist();

  if (isLoading) {
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

  if (wishlistCount === 0) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Your Wishlist is Empty
        </Typography>
        <Typography variant="body1" paragraph>
          Save your favorite items here to view them later
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/"
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Your Wishlist ({wishlistCount})
        </Typography>
        <Button 
          variant="outlined" 
          color="error"
          onClick={clearWishlist}
          disabled={wishlistCount === 0}
        >
          Clear All
        </Button>
      </Box>
      
      <Grid container spacing={4}>
        {wishlist.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
              }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image || '/default-product-image.jpg'}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 1 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price?.toFixed(2) || '0.00'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button 
                  size="small" 
                  color="primary"
                  component={Link}
                  to={`/product/${product.id}`}
                >
                  View Details
                </Button>
                <Box>
                  <IconButton 
                    aria-label="add to cart"
                    onClick={() => addToCart(product)}
                    sx={{ mr: 1 }}
                  >
                    <ShoppingCart />
                  </IconButton>
                  <IconButton 
                    aria-label="remove from wishlist"
                    onClick={() => removeFromWishlist(product.id)}
                    color="error"
                  >
                    <Favorite />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Wishlist;