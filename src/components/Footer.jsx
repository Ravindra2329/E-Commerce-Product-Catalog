import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Grid,
  Typography,
  Container,
  List,
  ListItem,
  Button, 
  Link,
  TextField,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Hide only on auth pages when not logged in
  const hideOnAuthPages = !isAuthenticated && ['/login', '/register'].includes(location.pathname);
  if (hideOnAuthPages) {
    return null;
  }

  const quickLinks = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'About Us', path: '/about' },
    { text: 'Contact', path: '/contact' },
    { text: 'FAQ', path: '/faq' },
    { text: 'Privacy Policy', path: '/privacy' }
  ];

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com' },
    { icon: <Twitter />, url: 'https://twitter.com' },
    { icon: <Instagram />, url: 'https://instagram.com' },
    { icon: <LinkedIn />, url: 'https://linkedin.com' }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      showSnackbar('Please enter your email address', 'error');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }
    showSnackbar('Thanks for subscribing!', 'success');
    setEmail('');
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
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        pt: 6,
        pb: 3,
        
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              ShopEase
            </Typography>
            <Typography variant="body1" paragraph>
              Your one-stop shop for quality products and exceptional service.
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              {socialLinks.map((social, index) => (
                <IconButton 
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main,
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              Quick Links
            </Typography>
            <List dense disablePadding>
              {quickLinks.map((link) => (
                <ListItem key={link.text} disablePadding sx={{ py: 0.5 }}>
                  <Link 
                    component={RouterLink}
                    to={link.path}
                    color="inherit"
                    underline="hover"
                    sx={{
                      '&:hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {link.text}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              Contact Us
            </Typography>
            <List dense disablePadding>
              <ListItem disablePadding sx={{ py: 0.5, alignItems: 'flex-start' }}>
                <Email fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
                <Link href="mailto:contact@shopease.com" color="inherit" underline="hover">
                  contact@shopease.com
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5, alignItems: 'flex-start' }}>
                <Phone fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
                <Link href="tel:+11234567890" color="inherit" underline="hover">
                  +(91) 6304595654
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5, alignItems: 'flex-start' }}>
                <LocationOn fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="body1">
                     123 Main Street, Guntur, India               
                 </Typography>
              </ListItem>
            </List>

            {!isMobile && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" paragraph>
                  Subscribe to our newsletter
                </Typography>
                <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex' }}>
                  <TextField
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px 0 0 4px',
                        height: '40px'
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '8px 12px'
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{
                      borderRadius: '0 4px 4px 0',
                      boxShadow: 'none',
                      height: '40px'
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: isMobile ? 1 : 0 }}>
            <Link 
              component={RouterLink}
              to="/terms"
              color="inherit"
              variant="body2"
              underline="hover"
            >
              Terms of Service
            </Link>
            <Link 
              component={RouterLink}
              to="/privacy"
              color="inherit"
              variant="body2"
              underline="hover"
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer;