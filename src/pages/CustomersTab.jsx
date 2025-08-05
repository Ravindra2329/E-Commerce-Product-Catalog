import React, { useState } from 'react';
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
  Badge,
  Pagination,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Visibility,
  Close,
  Email,
  Chat,
  Search,
  People,
  Phone,
  LocationOn,
  Event,
  Note,
  Star,
  LocalShipping
} from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import Add from '@mui/icons-material/Add';

const CustomersTab = ({ 
  customers, 
  searchQuery, 
  setSearchQuery, 
  customerFilter, 
  setCustomerFilter, 
  page, 
  rowsPerPage, 
  handlePageChange, 
  showSnackbar,
  formatCurrency 
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [notes, setNotes] = useState([]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(customer => 
    customerFilter.status === 'all' || customer.status === customerFilter.status
  ).sort((a, b) => {
    switch (customerFilter.sort) {
      case 'newest': return new Date(b.joinDate) - new Date(a.joinDate);
      case 'oldest': return new Date(a.joinDate) - new Date(b.joinDate);
      case 'most_orders': return b.orders - a.orders;
      case 'highest_value': return b.totalSpent - a.totalSpent;
      default: return 0;
    }
  });

  const paginatedCustomers = filteredCustomers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'banned': return 'error';
      default: return 'default';
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailsOpen(true);
    setNotes([
      {
        id: 1,
        text: 'Customer prefers email communication over phone calls',
        date: '2023-03-15T10:30:00Z',
        admin: 'Admin User'
      },
      {
        id: 2,
        text: 'VIP customer - offer priority shipping',
        date: '2023-02-20T14:15:00Z',
        admin: 'Manager'
      }
    ]);
  };

  const handleAddCustomerNote = () => {
    if (customerNotes.trim()) {
      setNotes([...notes, {
        id: Date.now(),
        text: customerNotes,
        date: new Date().toISOString(),
        admin: 'Current User'
      }]);
      setCustomerNotes('');
      showSnackbar('Note added successfully', 'success');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
        <TextField
          size="small"
          placeholder="Search customers..."
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
          aria-label="search customers"
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            size="small"
            label="Status"
            value={customerFilter.status}
            onChange={(e) => setCustomerFilter({...customerFilter, status: e.target.value})}
            sx={{ width: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="banned">Banned</MenuItem>
          </TextField>
          
          <TextField
            select
            size="small"
            label="Sort By"
            value={customerFilter.sort}
            onChange={(e) => setCustomerFilter({...customerFilter, sort: e.target.value})}
            sx={{ width: 150 }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="most_orders">Most Orders</MenuItem>
            <MenuItem value="highest_value">Highest Value</MenuItem>
          </TextField>
        </Box>
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
        <Table aria-label="customers table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Member Since</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Total Spent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>{customer.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography fontWeight="medium">{customer.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last order: {customer.lastOrder ? formatDate(customer.lastOrder) : 'Never'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{customer.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(customer.joinDate)}</TableCell>
                  <TableCell>
                    <Badge 
                      badgeContent={customer.orders} 
                      color="primary"
                      sx={{ '& .MuiBadge-badge': { right: -10, top: 10 } }}
                    />
                  </TableCell>
                  <TableCell>
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={customer.status} 
                      color={getStatusColor(customer.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton 
                          color="primary"
                          onClick={() => handleViewCustomer(customer)}
                          aria-label={`view customer ${customer.id}`}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Message">
                        <IconButton 
                          color="info"
                          aria-label={`message customer ${customer.id}`}
                        >
                          <Chat fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Email">
                        <IconButton 
                          color="secondary"
                          aria-label={`email customer ${customer.id}`}
                        >
                          <Email fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No customers found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredCustomers.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          aria-label="customers pagination"
        />
      </Box>

      {/* Customer Details Dialog */}
      <Dialog 
        open={customerDetailsOpen} 
        onClose={() => setCustomerDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="customer-dialog-title"
      >
        <DialogTitle id="customer-dialog-title">
          Customer Details
          <IconButton
            aria-label="close"
            onClick={() => setCustomerDetailsOpen(false)}
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
          {selectedCustomer && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                  {selectedCustomer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4">{selectedCustomer.name}</Typography>
                  <Typography color="text.secondary">{selectedCustomer.email}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip 
                      label={selectedCustomer.status} 
                      color={getStatusColor(selectedCustomer.status)}
                    />
                    <Chip 
                      label={`${selectedCustomer.orders} orders`} 
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      label={`Spent ${formatCurrency(selectedCustomer.totalSpent)}`} 
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People /> Customer Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <Email />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Email" secondary={selectedCustomer.email} />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <Phone />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Phone" secondary={selectedCustomer.phone || 'Not provided'} />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <LocationOn />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary="Address" 
                            secondary={selectedCustomer.address || 'Not provided'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <Event />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary="Member Since" 
                            secondary={formatDate(selectedCustomer.joinDate)} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <LocalShipping />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary="Last Order" 
                            secondary={selectedCustomer.lastOrder ? formatDate(selectedCustomer.lastOrder) : 'No orders yet'} 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Note /> Customer Notes
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="Add notes about this customer..."
                        sx={{ mb: 2 }}
                        aria-label="customer notes"
                      />
                      <Button 
                        variant="contained" 
                        startIcon={<Add />}
                        onClick={handleAddCustomerNote}
                        disabled={!customerNotes.trim()}
                        aria-label="add customer note"
                      >
                        Add Note
                      </Button>
                      
                      <Box sx={{ mt: 3, maxHeight: 300, overflow: 'auto' }}>
                        {notes.length > 0 ? (
                          <List>
                            {notes.map(note => (
                              <ListItem key={note.id} alignItems="flex-start">
                                <ListItemAvatar>
                                  <Avatar>{note.admin.charAt(0)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={note.text}
                                  secondary={
                                    <>
                                      <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                      >
                                        {note.admin}
                                      </Typography>
                                      {` — ${formatDate(note.date)}`}
                                    </>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                            No notes yet
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCustomerDetailsOpen(false)} 
            startIcon={<Close />}
            color="inherit"
            aria-label="close customer details"
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Email />}
            color="primary"
            aria-label="send email to customer"
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersTab;