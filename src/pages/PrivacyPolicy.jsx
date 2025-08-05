import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const PrivacyPolicy = () => {
  const policySections = [
    {
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, address, etc.)",
        "Order details and purchase history",
        "Payment information (processed securely by our payment partners)",
        "Device and usage information when you visit our site"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To process and fulfill your orders",
        "To communicate with you about your account and orders",
        "To improve our products and services",
        "To prevent fraud and enhance security",
        "To comply with legal obligations"
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "We may share information with service providers who assist with our operations (shipping, payment processing, etc.)",
        "We may disclose information when required by law or to protect our rights"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access and update your account information",
        "Request deletion of your personal data (subject to legal requirements)",
        "Opt-out of marketing communications",
        "Lodge a complaint with a data protection authority"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your data",
        "All transactions are encrypted using SSL technology",
        "Regular security audits and monitoring"
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies to enhance your shopping experience and analyze site usage",
        "You can manage cookie preferences in your browser settings",
        "We may use analytics services to understand how our site is used"
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        Privacy Policy
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Last updated: June 30, 2023
      </Typography>

      <Paper elevation={0} sx={{ 
        p: 4,
        backgroundColor: 'background.paper'
      }}>
        <Typography variant="body1" paragraph>
          At ShopEase, we are committed to protecting your privacy. This policy explains how we collect, 
          use, and safeguard your personal information when you use our website and services.
        </Typography>

        {policySections.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {section.title}
            </Typography>
            
            <List dense>
              {section.content.map((item, itemIndex) => (
                <ListItem key={itemIndex} disablePadding sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={`• ${item}`} 
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              ))}
            </List>
            
            {index < policySections.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}

        <Typography variant="body1" paragraph>
          If you have any questions about our privacy practices, please contact us at privacy@shopease.com.
        </Typography>
        <Typography variant="body1">
          We may update this policy from time to time. Any changes will be posted on this page with an updated revision date.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;