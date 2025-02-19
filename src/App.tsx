/*  *//*  */import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';
import Header from './components/layout/Header';
import { TimeManagementProvider } from './contexts/TimeManagementContext';
import './App.css';

// Lazy load pages for better performance
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const TimeEntryPage = React.lazy(() => import('./pages/TimeEntryPage'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const StatisticsPage = React.lazy(() => import('./pages/StatisticsPage'));

const App: React.FC = () => {
  return (
    <TimeManagementProvider>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/time-entry" element={<TimeEntryPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
              </Routes>
            </React.Suspense>
          </Container>
        </Box>
      </Router>
    </TimeManagementProvider>
  );
};

export default App;