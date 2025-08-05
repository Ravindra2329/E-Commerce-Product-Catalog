import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Snackbar
} from '@mui/material';
import { Edit, CameraAlt, Lock, Save, Cancel, CheckCircle } from '@mui/icons-material';

const ProfilePage = () => {
  const { user, updateUserProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: null,
    previewImage: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        image: null,
        previewImage: user.image || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          previewImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }

      const result = await updateUserProfile(formDataObj);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setSnackbarOpen(true);
        setEditMode(false);
      } else {
        setError(result.error || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (result.success) {
        setSuccess('Password changed successfully!');
        setSnackbarOpen(true);
        setChangePasswordMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.error || 'Failed to change password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      image: null,
      previewImage: user.image || ''
    });
    setError('');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Profile
          </Typography>
          {!editMode && !changePasswordMode && (
            <Button
              startIcon={<Edit />}
              variant="contained"
              color="primary"
              onClick={() => {
                setEditMode(true);
                setError('');
              }}
              sx={{ textTransform: 'none' }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 6 }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            sx={{ width: '100%' }}
            icon={<CheckCircle fontSize="inherit" />}
          >
            {success}
          </Alert>
        </Snackbar>

        {!changePasswordMode ? (
          <Box
            component="form"
            onSubmit={handleProfileSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={formData.previewImage || ''}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    bgcolor: 'primary.main'
                  }}
                >
                  {!formData.previewImage && user.name?.charAt(0)}
                </Avatar>
                {editMode && (
                  <>
                    <input
                      accept="image/*"
                      id="profile-image-upload"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <label htmlFor="profile-image-upload">
                      <IconButton
                        color="primary"
                        component="span"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <CameraAlt />
                      </IconButton>
                    </label>
                  </>
                )}
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
              required
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
              required
              margin="normal"
              variant="outlined"
            />

            {editMode ? (
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{ flex: 1, py: 1.5, textTransform: 'none' }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEditMode(false);
                    resetForm();
                  }}
                  startIcon={<Cancel />}
                  sx={{ flex: 1, py: 1.5, textTransform: 'none' }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Lock />}
                onClick={() => {
                  setChangePasswordMode(true);
                  setError('');
                }}
                sx={{ mt: 2, textTransform: 'none' }}
              >
                Change Password
              </Button>
            )}
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handlePasswordSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              margin="normal"
              variant="outlined"
              helperText="Password must be at least 8 characters"
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              margin="normal"
              variant="outlined"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{ flex: 1, py: 1.5, textTransform: 'none' }}
              >
                Update Password
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setChangePasswordMode(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setError('');
                }}
                startIcon={<Cancel />}
                sx={{ flex: 1, py: 1.5, textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
