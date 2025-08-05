import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Link,
  InputAdornment,
  Divider,
  IconButton
} from '@mui/material';
import { 
  LockOutlined, 
  EmailOutlined,
  Google,
  Facebook,
  Twitter,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const Login = () => {
  const { 
    login, 
    isAuthenticated, 
    error: authError, 
    clearError,
    loading: authLoading 
  } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from?.pathname || '/';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Handle messages from redirected routes
  useEffect(() => {
    if (location.state?.message) {
      setSnackbarMessage(location.state.message);
      setSnackbarOpen(true);
      // Clear the location state to prevent showing again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Handle auth context errors
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (localError) {
      setLocalError('');
      clearError();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      setLocalError('Password is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData);
      
    if (result.success) {
      // Success message will be handled by the redirect
      return;
    }
  };

  const handleSocialLogin = (provider) => {
    // Store current path for redirect after social login
    const redirectPath = location.state?.from?.pathname || '/';
    localStorage.setItem('preSocialLoginPath', redirectPath);
    
    // Redirect to backend OAuth endpoint
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <Container maxWidth="sm" sx={{ 
      py: 8,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'center'
    }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 2, 
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #3f51b5, #2196f3)'
        }
      }}>
        <Box textAlign="center" mb={4}>
          <Box sx={{
            display: 'inline-flex',
            p: 2,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            mb: 2
          }}>
            <LockOutlined sx={{ 
              fontSize: 32, 
              color: 'primary.main'
            }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            color: 'text.primary'
          }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to access your account
          </Typography>
        </Box>

        {localError && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => {
              setLocalError('');
              clearError();
            }}
          >
            {localError}
          </Alert>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2,
          mb: 3,
          flexWrap: 'wrap'
        }}>
          <Button
            variant="outlined"
            startIcon={<Google color="error" />}
            onClick={() => handleSocialLogin('google')}
            sx={{ 
              flex: '1 1 120px',
              py: 1.5,
              textTransform: 'none',
              minWidth: '120px'
            }}
          >
            Google
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Facebook color="primary" />}
            onClick={() => handleSocialLogin('facebook')}
            sx={{ 
              flex: '1 1 120px',
              py: 1.5,
              textTransform: 'none',
              minWidth: '120px'
            }}
          >
            Facebook
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Twitter color="info" />}
            onClick={() => handleSocialLogin('twitter')}
            sx={{ 
              flex: '1 1 120px',
              py: 1.5,
              textTransform: 'none',
              minWidth: '120px'
            }}
          >
            Twitter
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR CONTINUE WITH EMAIL
          </Typography>
        </Divider>

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="action" />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            mb: 2
          }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              variant="body2"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={authLoading}
            sx={{ 
              mt: 1,
              mb: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }
            }}
          >
            {authLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/register" 
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;