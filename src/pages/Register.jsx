import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock
} from '@mui/icons-material';

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    showPassword: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleClickShowPassword = () => {
    setFormData(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in.' 
          } 
        });
      } else {
        setSubmitError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 2, 
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join our community today
          </Typography>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color={errors.name ? 'error' : 'action'} />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color={errors.email ? 'error' : 'action'} />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type={formData.showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password || 'Minimum 8 characters'}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color={errors.password ? 'error' : 'action'} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ 
              mt: 3, 
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Account'
            )}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Button
            component={RouterLink}
            to="/login"
            color="primary"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Sign In
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;