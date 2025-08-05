import React, { useState, useRef } from 'react';
import { useProducts } from '../context/ProductsContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Typography,
  Pagination,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  Save,
  Category,
  Description,
  Storage,
  ColorLens,
  FeaturedVideo,
  AttachMoney,
  Search,
  Star,
  StarBorder,
  Image as ImageIcon,
  CloudUpload
} from '@mui/icons-material';
import Inventory from '@mui/icons-material/Inventory';
import Cancel from '@mui/icons-material/Cancel';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

const ProductsTab = ({ 
  searchQuery, 
  setSearchQuery, 
  page, 
  rowsPerPage, 
  handlePageChange, 
  showSnackbar 
}) => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    addReview,
    
  } = useProducts();
  
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: '',
    colors: ['Black'],
    features: ['New feature']
  });
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentReviews, setCurrentReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    title: '',
    comment: '',
    rating: 5,
    userName: 'Anonymous'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Books',
    'Beauty',
    'Sports',
    'Toys',
    'Other'
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const paginatedProducts = filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        showSnackbar('Please select an image file', 'error');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar('Image size should be less than 2MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProductForm(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setProductForm(prev => ({
      ...prev,
      image: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setProductForm({
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      image: '',
      colors: ['Black'],
      features: ['New feature']
    });
    setImagePreview(null);
    setOpenProductDialog(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      description: product.description || '',
      image: product.image || '',
      colors: product.colors || ['Black'],
      features: product.features || ['New feature']
    });
    setImagePreview(product.image || null);
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        showSnackbar('Product deleted successfully', 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete product', 'error');
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.price || !productForm.stock) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        colors: Array.isArray(productForm.colors) ? productForm.colors : [productForm.colors],
        features: Array.isArray(productForm.features) ? productForm.features : [productForm.features],
        rating: currentProduct?.rating || 4.0,
        reviews: currentProduct?.reviews || []
      };

      if (currentProduct) {
        const result = await updateProduct(currentProduct.id, productData);
        if (result.success) {
          showSnackbar('Product updated successfully', 'success');
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await addProduct(productData);
        if (result.success) {
          showSnackbar('Product added successfully', 'success');
        } else {
          throw new Error(result.error);
        }
      }
      setOpenProductDialog(false);
    } catch (error) {
      showSnackbar(error.message || `Failed to ${currentProduct ? 'update' : 'add'} product`, 'error');
    }
  };

  const handleViewReviews = (product) => {
    setCurrentProduct(product);
    setCurrentReviews(product.reviews || []);
    setReviewDialogOpen(true);
  };

  const handleAddReview = async () => {
    try {
      const review = {
        ...newReview,
        id: Date.now(),
        date: new Date().toISOString()
      };
      
      const result = await addReview(currentProduct.id, review);
      if (result.success) {
        setReviewDialogOpen(false);
        setNewReview({
          title: '',
          comment: '',
          rating: 5,
          userName: 'Anonymous'
        });
        showSnackbar('Review added successfully', 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to add review', 'error');
    }
  };

  

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          aria-label="search products"
        />
        <Button 
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
          aria-label="add product"
        >
          Add Product
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: 2,
          overflowX: 'auto',
          '.MuiTableCell-root': {
            whiteSpace: 'nowrap'
          }
        }}
      >
        <Table aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Colors</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={product.image || ''}
                        alt={product.name}
                        sx={{ width: 40, height: 40 }}
                        variant="rounded"
                      >
                        {!product.image && <ImageIcon />}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="medium">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description?.substring(0, 30)}...
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" />
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.stock} 
                      color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {product.colors?.map(color => (
                        <Chip 
                          key={color} 
                          label={color} 
                          size="small" 
                          sx={{ 
                            backgroundColor: color.toLowerCase(),
                            color: ['white', 'yellow', 'pink'].includes(color.toLowerCase()) ? 'black' : 'white'
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {product.features?.slice(0, 2).map(feature => (
                        <Chip 
                          key={feature} 
                          label={feature} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                      {product.features?.length > 2 && (
                        <Tooltip title={product.features.slice(2).join(', ')}>
                          <Chip 
                            label={`+${product.features.length - 2} more`} 
                            size="small" 
                            variant="outlined"
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star color="primary" />
                      <Typography>{product.rating?.toFixed(1) || 'N/A'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({product.reviews?.length || 0})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton 
                          color="primary"
                          onClick={() => handleEditProduct(product)}
                          aria-label={`edit product ${product.id}`}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reviews">
                        <IconButton 
                          color="info"
                          onClick={() => handleViewReviews(product)}
                          aria-label={`view reviews for ${product.id}`}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteProduct(product.id)}
                          aria-label={`delete product ${product.id}`}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          aria-label="products pagination"
        />
      </Box>

      {/* Product Dialog */}
      <Dialog 
        open={openProductDialog} 
        onClose={() => setOpenProductDialog(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="product-dialog-title"
      >
        <DialogTitle id="product-dialog-title">
          {currentProduct ? 'Edit Product' : 'Add New Product'}
          <IconButton
            aria-label="close"
            onClick={() => setOpenProductDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Product Name"
              name="name"
              value={productForm.name}
              onChange={handleProductFormChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory />
                  </InputAdornment>
                ),
              }}
              aria-label="product name"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={productForm.price}
              onChange={handleProductFormChange}
              inputProps={{ step: "0.01", min: "0" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
              aria-label="product price"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Stock Quantity"
              name="stock"
              type="number"
              value={productForm.stock}
              onChange={handleProductFormChange}
              inputProps={{ min: "0" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Storage />
                  </InputAdornment>
                ),
              }}
              aria-label="product stock"
            />
            <TextField
              margin="normal"
              select
              fullWidth
              label="Category"
              name="category"
              value={productForm.category}
              onChange={handleProductFormChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Category />
                  </InputAdornment>
                ),
              }}
              aria-label="product category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            
            {/* Image Upload Section */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="product-image-upload"
              />
              <label htmlFor="product-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Upload Product Image
                </Button>
              </label>
              
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px',
                        borderRadius: '4px'
                      }}
                    />
                    <IconButton
                      aria-label="remove image"
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.7)'
                        }
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>

            <TextField
              margin="normal"
              fullWidth
              label="Colors (comma separated)"
              value={productForm.colors?.join(',') || ''}
              onChange={(e) => setProductForm({
                ...productForm,
                colors: e.target.value.split(',').map(c => c.trim())
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ColorLens />
                  </InputAdornment>
                ),
              }}
              aria-label="product colors"
            />
            <TextField
              margin="normal"
              fullWidth
              label="Features (comma separated)"
              value={productForm.features?.join(',') || ''}
              onChange={(e) => setProductForm({
                ...productForm,
                features: e.target.value.split(',').map(f => f.trim())
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FeaturedVideo />
                  </InputAdornment>
                ),
              }}
              aria-label="product features"
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              name="description"
              value={productForm.description}
              onChange={handleProductFormChange}
              multiline
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
              aria-label="product description"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenProductDialog(false)} 
            startIcon={<Cancel />}
            color="inherit"
            aria-label="cancel product edit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProductSubmit} 
            variant="contained"
            startIcon={<Save />}
            aria-label="save product"
          >
            {currentProduct ? 'Update' : 'Save'} Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reviews Dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="reviews-dialog-title"
      >
        <DialogTitle id="reviews-dialog-title">
          Product Reviews
          <IconButton
            aria-label="close"
            onClick={() => setReviewDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {currentProduct && (
            <Box>
              <Typography variant="h6">{currentProduct.name}</Typography>
              <Typography color="text.secondary">Average Rating: {currentProduct.rating?.toFixed(1)}</Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Add Review</Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  aria-label="review title"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Comment"
                  multiline
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  aria-label="review comment"
                />
                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Rating"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                  aria-label="review rating"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {[...Array(5)].map((_, i) => (
                        i < num ? <Star key={i} color="primary" /> : <StarBorder key={i} color="primary" />
                      ))}
                    </MenuItem>
                  ))}
                </TextField>
                <Button 
                  variant="contained" 
                  onClick={handleAddReview}
                  disabled={!newReview.title || !newReview.comment}
                  sx={{ mt: 2 }}
                  aria-label="add review"
                >
                  Add Review
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6">All Reviews ({currentReviews.length})</Typography>
              {currentReviews.length > 0 ? (
                <List>
                  {currentReviews.map(review => (
                    <ListItem key={review.id}>
                      <ListItemAvatar>
                        <Avatar>{review.userName?.charAt(0) || 'U'}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={review.title}
                        secondary={
                          <>
                            <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                              {[...Array(5)].map((_, i) => (
                                i < review.rating ? <Star key={i} fontSize="small" color="primary" /> : <StarBorder key={i} fontSize="small" color="primary" />
                              ))}
                            </Box>
                            {review.comment}
                            <Typography variant="caption" display="block">
                              {review.userName} - {formatDate(review.date)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No reviews yet
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductsTab;