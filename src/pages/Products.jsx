import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';

const Products = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        Our Products
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Discover our wide range of quality products
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No products available at the moment
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard
                product={product}
                onProductClick={handleProductClick}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Products;