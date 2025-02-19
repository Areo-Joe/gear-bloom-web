import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import CategoryManager from '../components/CategoryManager';

const CategoriesPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 500,
              color: 'primary.main',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Category Management
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: 'center' }}
          >
            Create and manage categories to organize your time entries
          </Typography>
          <CategoryManager />
        </Paper>
      </Box>
    </Container>
  );
};

export default CategoriesPage;