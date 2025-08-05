import React, { useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  ExitToApp,
  Dashboard,
  Favorite,
  Menu as MenuIcon,
  AdminPanelSettings
} from '@mui/icons-material';
import logo from '../assets/shopease.png';

const ShopEaseLogo = React.memo(() => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Avatar 
      src={logo}
      alt="ShopEase Logo"
      sx={{ 
        width: 40, 
        height: 40,
        backgroundColor: 'white',
        padding: 0.5
      }}
    />
    <Typography 
      variant="h6" 
      component={Link} 
      to="/" 
      sx={{ 
        color: '#fff', 
        textDecoration: 'none',
        fontFamily: '"Pacifico", cursive',
        background: 'linear-gradient(45deg, #ffffff, #ffeb3b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 700,
        '&:focus': {
          outline: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '4px'
        }
      }}
      aria-label="ShopEase Home"
    >
      ShopEase
    </Typography>
  </Box>
));

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuEl, setMobileMenuEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login', { replace: true, state: { from: location } });
  };

  // Navigation links configuration
  const navLinks = useMemo(() => {
    if (isAdmin) {
      return [
        { text: 'Products', path: '/products', show: true, aria: 'Manage products' },
        { text: 'Dashboard', path: '/admin/dashboard', show: true, aria: 'Admin dashboard' }
      ];
    }
    
    return [
      { text: 'Products', path: '/products', show: true, aria: 'Browse products' },
      { text: 'About Us', path: '/about', show: true, aria: 'About ShopEase' },
      { text: 'Contact', path: '/contact', show: true, aria: 'Contact us' },
      { text: 'My Orders', path: '/orders', show: isAuthenticated, aria: 'View your orders' },
      { text: 'Wishlist', path: '/wishlist', show: isAuthenticated, icon: <Favorite />, badge: wishlistCount, aria: 'View your wishlist' },
      { text: 'Cart', path: '/cart', show: isAuthenticated, icon: <ShoppingCart />, badge: cartCount, aria: 'View your shopping cart' },
    ];
  }, [isAuthenticated, isAdmin, cartCount, wishlistCount]);

  // Hide only on auth pages when not logged in
  const hideOnAuthPages = !isAuthenticated && ['/login', '/register'].includes(location.pathname);
  if (hideOnAuthPages) {
    return null;
  }

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: 'primary.main',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        maxWidth: 'xl',
        margin: '0 auto',
        width: '100%',
        py: 1
      }}>
        <ShopEaseLogo />

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMobileMenu}
              sx={{ ml: 'auto' }}
              aria-label="Open navigation menu"
              aria-controls="mobile-menu"
              aria-haspopup="true"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="mobile-menu"
              anchorEl={mobileMenuEl}
              open={Boolean(mobileMenuEl)}
              onClose={handleClose}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  }
                }
              }}
              MenuListProps={{
                'aria-labelledby': 'mobile-menu',
              }}
            >
              {navLinks.map((link) => (
                link.show && (
                  <MenuItem 
                    key={link.path}
                    component={Link}
                    to={link.path}
                    onClick={handleClose}
                    aria-label={link.aria}
                  >
                    {link.icon && (
                      <Badge badgeContent={link.badge} color="error" sx={{ mr: 1 }}>
                        {link.icon}
                      </Badge>
                    )}
                    {link.text}
                  </MenuItem>
                )
              ))}

              {isAuthenticated && (
                <>
                  <Divider />
                  <MenuItem 
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                    aria-label="View and update your profile"
                  >
                    <AccountCircle sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem 
                      component={Link}
                      to="/admin/dashboard"
                      onClick={handleClose}
                      aria-label="Admin dashboard"
                    >
                      <AdminPanelSettings sx={{ mr: 1 }} />
                      Dashboard
                    </MenuItem>
                  )}
                  <MenuItem 
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <ExitToApp sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Divider />
                  <MenuItem 
                    component={Link}
                    to="/login"
                    onClick={handleClose}
                    aria-label="Login to your account"
                  >
                    Login
                  </MenuItem>
                  <MenuItem 
                    component={Link}
                    to="/register"
                    onClick={handleClose}
                    aria-label="Create new account"
                  >
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => (
              link.show && (link.icon ? (
                <Tooltip key={link.path} title={link.text}>
                  <IconButton 
                    color="inherit" 
                    component={Link} 
                    to={link.path}
                    aria-label={link.aria}
                    sx={{ 
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      },
                      '&:focus': {
                        outline: '2px solid rgba(255,255,255,0.5)'
                      }
                    }}
                  >
                    <Badge badgeContent={link.badge} color="error">
                      {link.icon}
                    </Badge>
                  </IconButton>
                </Tooltip>
              ) : (
                <Button 
                  key={link.path}
                  color="inherit" 
                  component={Link} 
                  to={link.path}
                  aria-label={link.aria}
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    },
                    '&:focus': {
                      outline: '2px solid rgba(255,255,255,0.5)',
                      borderRadius: '4px'
                    }
                  }}
                >
                  {link.text}
                </Button>
              ))
            ))}

            {isAuthenticated && (
              <>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                    sx={{
                      p: 0,
                      ml: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      },
                      '&:focus': {
                        outline: '2px solid rgba(255,255,255,0.5)'
                      }
                    }}
                    aria-label="Account menu"
                    aria-controls="account-menu"
                    aria-haspopup="true"
                  >
                    <Avatar 
                      src={user?.image} 
                      alt={user?.name || 'User avatar'}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid white'
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                      }
                    }
                  }}
                  MenuListProps={{
                    'aria-labelledby': 'account-menu',
                  }}
                >
                  <MenuItem disabled sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ color: '#000000', fontWeight: 700 }}
                    >
                      {user?.name || 'User'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {user?.email || ''}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  
                  <MenuItem 
                    component={Link} 
                    to="/profile"
                    onClick={handleClose}
                    aria-label="View and update your profile"
                  >
                    <AccountCircle sx={{ mr: 1 }} /> 
                    Profile
                  </MenuItem>
                  
                  {isAdmin && (
                    <MenuItem 
                      component={Link} 
                      to="/admin/dashboard"
                      onClick={handleClose}
                      aria-label="Admin dashboard"
                    >
                      <Dashboard sx={{ mr: 1 }} /> 
                      Dashboard
                    </MenuItem>
                  )}
                  
                  <MenuItem 
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <ExitToApp sx={{ mr: 1 }} /> 
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  aria-label="Login to your account"
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    },
                    '&:focus': {
                      outline: '2px solid rgba(255,255,255,0.5)',
                      borderRadius: '4px'
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  aria-label="Create new account"
                  sx={{ 
                    fontWeight: 600,
                    borderColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    },
                    '&:focus': {
                      outline: '2px solid rgba(255,255,255,0.5)',
                      borderRadius: '4px'
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Navbar);