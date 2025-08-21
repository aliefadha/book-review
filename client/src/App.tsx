import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Favorite as FavoriteIcon } from '@mui/icons-material';
import { AppRoutes } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { useFavorites } from './hooks/useFavorites';
import FavoritesDrawer from './components/FavoritesDrawer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);
  const { favoritesCount } = useFavorites();

  const handleFavoritesClick = () => {
    setFavoritesDrawerOpen(true);
  };

  const handleFavoritesClose = () => {
    setFavoritesDrawerOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Book Review Library
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/search">
              Search
            </Button>
            <IconButton
              color="inherit"
              onClick={handleFavoritesClick}
              aria-label={`Open favorites (${favoritesCount} items)`}
              sx={{
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Badge badgeContent={favoritesCount} color="secondary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <main>
          <AppRoutes />
        </main>
      </Box>

      <FavoritesDrawer
        open={favoritesDrawerOpen}
        onClose={handleFavoritesClose}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App
