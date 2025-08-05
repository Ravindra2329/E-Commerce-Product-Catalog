import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar
} from '@mui/material';
import { 
  Store, 
  LocalShipping, 
  HeadsetMic, 
  Star 
} from '@mui/icons-material';

const AboutUs = () => {
  const features = [
    {
      icon: <Store fontSize="large" color="primary" />,
      title: "Wide Selection",
      description: "Thousands of products across multiple categories"
    },
    {
      icon: <LocalShipping fontSize="large" color="primary" />,
      title: "Fast Delivery",
      description: "Reliable shipping with options to suit your needs"
    },
    {
      icon: <HeadsetMic fontSize="large" color="primary" />,
      title: "24/7 Support",
      description: "Our team is always ready to help you"
    },
    {
      icon: <Star fontSize="large" color="primary" />,
      title: "Quality Guaranteed",
      description: "We source only the best products for you"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        About ShopEase
      </Typography>
      
      <Paper elevation={0} sx={{ p: 4, mb: 4, backgroundColor: 'background.paper' }}>
        <Typography variant="body1" paragraph>
          Welcome to ShopEase, your one-stop destination for all your shopping needs. 
          Founded in 2023, we've been committed to providing high-quality products 
          with exceptional customer service.
        </Typography>
        <Typography variant="body1" paragraph>
          Our mission is to make online shopping easy, enjoyable, and accessible 
          to everyone. We carefully curate our product selection to ensure you 
          get the best value for your money.
        </Typography>
        <Typography variant="body1">
          Whether you're shopping for electronics, home goods, or gifts, 
          ShopEase has you covered with competitive prices and fast shipping.
        </Typography>
      </Paper>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Why Choose Us?
      </Typography>
      
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              p: 2
            }}>
              <Avatar sx={{ 
                width: 60, 
                height: 60, 
                mb: 2,
                backgroundColor: 'primary.light'
              }}>
                {feature.icon}
              </Avatar>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AboutUs;