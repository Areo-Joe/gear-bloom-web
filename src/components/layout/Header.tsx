import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const navigation = [
  { title: 'Dashboard', path: '/' },
  { title: 'Time Entry', path: '/time-entry' },
  { title: 'Categories', path: '/categories' },
  { title: 'Statistics', path: '/statistics' },
];

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderNavLinks = () => {
    return navigation.map((item) => (
      <Button
        key={item.path}
        component={RouterLink}
        to={item.path}
        color="inherit"
        sx={{
          mx: 1,
          textDecoration: 'none',
          color: location.pathname === item.path ? 'secondary.main' : 'inherit',
        }}
      >
        {item.title}
      </Button>
    ));
  };

  const renderMobileDrawer = () => (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Time Management
      </Typography>
      <List>
        {navigation.map((item) => (
          <ListItem
            key={item.path}
            component={RouterLink}
            to={item.path}
            sx={{
              textAlign: 'center',
              color: location.pathname === item.path ? 'secondary.main' : 'inherit',
              textDecoration: 'none',
            }}
          >
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Time Management
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{renderNavLinks()}</Box>
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {renderMobileDrawer()}
        </Drawer>
      )}
    </Box>
  );
};

export default Header;