import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';

const Home = () => {
    const { addToCart } = useCart();
  const navigate = useNavigate();
  const { products, loading } = useProducts();


  const handleProductClick = (productId) => {
    navigate(`/product/${productId.id}`);
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', my: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to ShopEase
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover amazing products at great prices
        </Typography>
      </Paper>

      {/* Featured Products */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Featured Products
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No products available yet. Check back soon!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  onProductClick={handleProductClick}
                  addToCart={addToCart}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Home;
