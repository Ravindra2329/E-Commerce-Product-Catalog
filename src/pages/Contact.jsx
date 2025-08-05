import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn,
  Send
} from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // In a real app, you would send this to your backend
    console.log('Form submitted:', formData);
    setSnackbarMessage('Your message has been sent! We will contact you soon.');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        Contact Us
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Have questions? We're here to help!
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Send us a message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                error={!!errors.message}
                helperText={errors.message}
                margin="normal"
                required
                multiline
                rows={4}
              />
              
              <Button
                type="submit"
                variant="contained"
                startIcon={<Send />}
                sx={{ mt: 3 }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Information
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Email color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  contact@shopease.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Phone color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  +(91) 6304595654
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <LocationOn color="primary" sx={{ mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  123 Main Street<br />
                  Guntur, India
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Business Hours
            </Typography>
            <Typography variant="body1" paragraph>
              Monday - Friday: 9:00 AM - 6:00 PM
            </Typography>
            <Typography variant="body1">
              Saturday - Sunday: 10:00 AM - 4:00 PM
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;