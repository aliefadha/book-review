import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import type { Books } from '../types/book';

interface BookCardProps {
  book: Books & { matchType: string };
  onBookClick: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBookClick }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
        '&:active': {
          transform: 'translateY(-2px)',
        },
      }}
      data-testid="search-book-card"
      onClick={() => onBookClick(book.id)}
    >
      <CardMedia
        component="img"
        height="200"
        image={book.coverImageUrl}
        alt={book.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            {book.title}
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {book.author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {book.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;