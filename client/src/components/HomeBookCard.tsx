import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
} from '@mui/material';
import ViewIcon from '@mui/icons-material/Visibility';
import type { Books } from '../types/book';

interface HomeBookCardProps {
  book: Books;
}

const HomeBookCard: React.FC<HomeBookCardProps> = ({ book }) => {
  return (
    <Card
      data-testid="book-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={book.coverImageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
        alt={`${book.title} cover`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
        }}
        sx={{
          objectFit: 'cover',
          backgroundColor: 'grey.100',
          transition: 'transform 0.3s ease',
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }} data-testid="book-title">
          {book.title}
        </Typography>
        <Typography variant="subtitle1" color="primary" gutterBottom data-testid="book-author">
          by {book.author}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {book.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/book/${book.id}`}
          variant="contained"
          startIcon={<ViewIcon />}
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 2,
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default HomeBookCard;