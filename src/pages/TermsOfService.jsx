import React from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link
} from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        Terms of Service
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper elevation={0} sx={{ 
        p: 4,
        backgroundColor: 'background.paper'
      }}>
        <Typography variant="body1" paragraph>
          Welcome to ShopEase! These Terms of Service ("Terms") govern your use of our website and services.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing or using our services, you agree to be bound by these Terms. If you disagree, please do not use our services.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          2. User Accounts
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• You must provide accurate information when creating an account" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• You are responsible for maintaining the confidentiality of your account" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• You must be at least 18 years old to use our services" />
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          3. Purchases and Payments
        </Typography>
        <Typography variant="body1" paragraph>
          All purchases are subject to availability. We reserve the right to refuse or cancel any order.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          4. Returns and Refunds
        </Typography>
        <Typography variant="body1" paragraph>
          Please review our Return Policy for details about returns and refunds.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          5. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          All content on our website is our property and protected by copyright laws.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          6. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          ShopEase shall not be liable for any indirect, incidental, or consequential damages.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          7. Changes to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          We may modify these Terms at any time. Continued use after changes constitutes acceptance.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          8. Governing Law
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms shall be governed by the laws of [Your Country/State] without regard to conflict of law provisions.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body1">
          If you have any questions about these Terms, please contact us at{' '}
          <Link href="mailto:legal@shopease.com">legal@shopease.com</Link>.
        </Typography>
      </Paper>
    </Container>
  );
};


export default TermsOfService;
