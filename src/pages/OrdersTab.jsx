import React, { useState } from 'react';
import { useOrders } from '../context/OrdersContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  Visibility,
  Close,
  Save,
  Search,
  FilterList,
  AttachMoney
} from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Cancel from '@mui/icons-material/Cancel';

const OrdersTab = ({ 
  searchQuery, 
  setSearchQuery, 
  filter, 
  setFilter, 
  page, 
  rowsPerPage, 
  handlePageChange, 
  showSnackbar,
  formatCurrency 
}) => {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'all' || order.status === filter;
    const matchesCustomer = order.customer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesId = order.id.toString().includes(searchQuery);
    
    return matchesStatus && (matchesCustomer || matchesId);
  });

  const paginatedOrders = filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'processing': return 'warning';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order.status);
    setOrderDetailsOpen(true);
  };

  const handleUpdateOrderStatus = async () => {
    try {
      const result = await updateOrderStatus(selectedOrder.id, orderStatus);
      if (result.success) {
        setOrderDetailsOpen(false);
        showSnackbar('Order status updated successfully', 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to update order status', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
        <TextField
          size="small"
          placeholder="Search orders..."
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
          aria-label="search orders"
        />
        <TextField
          select
          size="small"
          label="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ width: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList />
              </InputAdornment>
            ),
          }}
          aria-label="filter orders"
        >
          <MenuItem value="all">All Orders</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Shipped">Shipped</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {order.customer && order.customer !== 'undefined undefined' 
                    ? order.customer 
                    : order.customerEmail?.split('@')[0] || 'Customer'}
                </TableCell>
                <TableCell>{order.customerEmail || 'N/A'}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View/Update">
                    <IconButton 
                      color="primary"
                      onClick={() => handleViewOrder(order)}
                      aria-label={`view order ${order.id}`}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredOrders.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          aria-label="orders pagination"
        />
      </Box>

      {/* Order Details Dialog */}
      <Dialog 
        open={orderDetailsOpen} 
        onClose={() => setOrderDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="order-dialog-title"
      >
        <DialogTitle id="order-dialog-title">
          Order #{selectedOrder?.id}
          <IconButton
            aria-label="close"
            onClick={() => setOrderDetailsOpen(false)}
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
          {selectedOrder && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Customer:</strong> {selectedOrder.customer || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6">
                    Order Total: {formatCurrency(selectedOrder.total)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Order Items</Typography>
              <TableContainer>
                <Table size="small" aria-label="order items">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              src={item.image} 
                              alt={item.name}
                              sx={{ width: 40, height: 40 }}
                            />
                            {item.name || `Product ID: ${item.productId}`}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.quantity * item.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle1">Update Status:</Typography>
                <TextField
                  select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  sx={{ minWidth: 150 }}
                  aria-label="order status"
                >
                  {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOrderDetailsOpen(false)} 
            startIcon={<Cancel />}
            color="inherit"
            aria-label="cancel order update"
          >
            Close
          </Button>
          <Button 
            onClick={handleUpdateOrderStatus} 
            variant="contained"
            startIcon={<Save />}
            aria-label="update order status"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersTab;