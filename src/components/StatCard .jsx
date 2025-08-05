import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import Card from '@mui/material/Card';

const StatCard = ({ icon, title, value, color, trend }) => (
  <Card sx={{ 
    p: 2, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 3,
    borderLeft: `4px solid ${color}`,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 2
    }
  }}>
    <Box sx={{ 
      width: 60, 
      height: 60, 
      borderRadius: '50%', 
      bgcolor: `${color}20`, 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
      <Typography 
        variant="caption" 
        color={trend === 'up' ? 'success.main' : 'error.main'}
        sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
      >
        {trend === 'up' ? '↑ 5.2%' : '↓ 2.1%'} from last month
      </Typography>
    </Box>
  </Card>
);

export default StatCard;