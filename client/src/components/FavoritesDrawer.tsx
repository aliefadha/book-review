import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  MenuBook as BookIcon,
  FavoriteBorder as EmptyHeartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import type { FavoriteBook } from '../types/favorites';

interface FavoritesDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ open, onClose }) => {
  const { favorites, removeFromFavorites, clearFavorites, favoritesCount } = useFavorites();
  const navigate = useNavigate();

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
    onClose();
  };

  const handleRemoveFavorite = (bookId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeFromFavorites(bookId);
  };

  const handleClearAll = () => {
    clearFavorites();
  };

  const EmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <EmptyHeartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Favorites Yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Start adding books to your favorites to see them here!
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          navigate('/');
          onClose();
        }}
        sx={{ textTransform: 'none' }}
      >
        Browse Books
      </Button>
    </Box>
  );

  const FavoriteBookItem: React.FC<{ book: FavoriteBook }> = ({ book }) => (
    <ListItem
      sx={{
          cursor: 'pointer',
          borderRadius: 1,
          mb: 1,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'action.hover',
            transform: 'translateX(4px)',
            boxShadow: 1,
          },
        }}
      onClick={() => handleBookClick(book.id)}
    >
      <ListItemAvatar>
        <Avatar
          src={book.coverImageUrl}
          alt={book.title}
          sx={{
            width: 48,
            height: 64,
            borderRadius: 1,
            bgcolor: 'primary.light',
          }}
        >
          <BookIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {book.title}
          </Typography>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              by {book.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Added {new Date(book.addedAt).toLocaleDateString()}
            </Typography>
          </Box>
        }
        sx={{ mr: 1 }}
      />
      <IconButton
        edge="end"
        aria-label="remove from favorites"
        onClick={(e) => handleRemoveFavorite(book.id, e)}
        sx={{
          color: 'error.main',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'error.light',
            color: 'error.dark',
            transform: 'scale(1.1)',
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              My Favorites ({favoritesCount})
            </Typography>
            <IconButton onClick={onClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Paper>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {favorites.length === 0 ? (
            <EmptyState />
          ) : (
            <Box sx={{ p: 2 }}>
              <List sx={{ p: 0 }}>
                {favorites.map((book) => (
                  <FavoriteBookItem key={book.id} book={book} />
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* Footer */}
        {favorites.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleClearAll}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Clear All Favorites
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default FavoritesDrawer;