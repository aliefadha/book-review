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
    <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.333%' }, p: 1 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
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
    </Box>
  );
};

export default BookCard;