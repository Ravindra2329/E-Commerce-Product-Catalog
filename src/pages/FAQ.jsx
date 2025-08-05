import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const FAQ = () => {
  const [expanded, setExpanded] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Express options are available at checkout for faster delivery."
    },
    {
      question: "Can I return or exchange an item?",
      answer: "Yes, we offer a 30-day return policy. Items must be in original condition with tags attached. Please contact our support team to initiate a return."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within India. We plan to expand our shipping options in the future."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also check your order status in your account dashboard."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        Frequently Asked Questions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Find answers to common questions about shopping with us
      </Typography>

      <Paper elevation={0} sx={{ 
        p: 2, 
        mb: 4,
        backgroundColor: 'background.paper'
      }}>
        {faqs.map((faq, index) => (
          <Box key={index} sx={{ mb: index === faqs.length - 1 ? 0 : 2 }}>
            <Accordion 
              expanded={expanded === `panel${index}`} 
              onChange={handleChange(`panel${index}`)}
              elevation={2}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
            {index < faqs.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Still have questions?
      </Typography>
      <Typography variant="body1">
        Contact our customer support team at support@shopease.com or call us at +(91) 6304595654.
      </Typography>
    </Container>
  );
};

export default FAQ;