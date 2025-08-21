import React, { useMemo, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Rating,
  Paper,
  Divider,
  Stack,
  CardMedia,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { fetchBookById } from '../services/bookService';
import type { Book } from '../types/book';
import { useQuery } from '@tanstack/react-query';
import ReviewCard from '../components/ReviewCard';
import ReviewModal from '../components/ReviewModal';
import { useFavorites } from '../hooks/useFavorites';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useFavorites();

  const { isPending, error, data: book, refetch } = useQuery<Book | null>({
    queryKey: ['bookData', id],
    queryFn: () => fetchBookById(id || ''),
    enabled: !!id,
  })

  const { averageRating, reviewCount } = useMemo(() => {
    if (!book?.reviews?.length) {
      return { averageRating: 0, reviewCount: 0 };
    }
    const totalRating = book.reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      averageRating: totalRating / book.reviews.length,
      reviewCount: book.reviews.length
    };
  }, [book?.reviews]);

  if (isPending) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Loading...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Error Loading Book
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Failed to load book details. Please try again.
          </Typography>
          <Button
            onClick={() => refetch()}
            variant="contained"
            sx={{ mr: 2 }}
          >
            Retry
          </Button>
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back to Book List
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Book Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The book with ID {id} was not found.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            startIcon={<ArrowBackIcon />}
          >
            Back to Book List
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Book List
      </Button>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Cover Image */}
          <Box sx={{ flexShrink: 0 }}>
            <CardMedia
              component="img"
              sx={{
                width: { xs: '100%', md: 300 },
                height: { xs: 300, md: 400 },
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: 3,
              }}
              image={book.coverImageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjAgMTgwSDEwMFYyMDBIMTIwVjE4MFoiIGZpbGw9IiM5RTlFOUUiLz4KPHA+dGggZD0iTTEyMCAxNjBIMTAwVjE4MEgxMjBWMTYwWiIgZmlsbD0iIzlFOUU5RSIvPgo8cGF0aCBkPSJNMTQwIDE2MEgxMjBWMTgwSDE0MFYxNjBaIiBmaWxsPSIjOUU5RTlFIi8+CjxwYXRoIGQ9Ik0xNjAgMTYwSDE0MFYxODBIMTYwVjE2MFoiIGZpbGw9IiM5RTlFOUUiLz4KPHA+dGggZD0iTTE4MCAxNjBIMTYwVjE4MEgxODBWMTYwWiIgZmlsbD0iIzlFOUU5RSIvPgo8cGF0aCBkPSJNMjAwIDE2MEgxODBWMTgwSDIwMFYxNjBaIiBmaWxsPSIjOUU5RTlFIi8+CjxwYXRoIGQ9Ik0yMDAgMTgwSDE4MFYyMDBIMjAwVjE4MFoiIGZpbGw9IiM5RTlFOUUiLz4KPHA+dGggZD0iTTE4MCAyMDBIMTYwVjIyMEgxODBWMjAwWiIgZmlsbD0iIzlFOUU5RSIvPgo8cGF0aCBkPSJNMTYwIDIwMEgxNDBWMjIwSDE2MFYyMDBaIiBmaWxsPSIjOUU5RTlFIi8+CjxwYXRoIGQ9Ik0xNDAgMjAwSDEyMFYyMjBIMTQwVjIwMFoiIGZpbGw9IiM5RTlFOUUiLz4KPHA+dGggZD0iTTEyMCAyMDBIMTAwVjIyMEgxMjBWMjAwWiIgZmlsbD0iIzlFOUU5RSIvPgo8dGV4dCB4PSIxNTAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOUU5RTlFIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'}
              alt={book.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjAgMTgwSDEwMFYyMDBIMTIwVjE4MFoiIGZpbGw9IiM5RTlFOUUiLz4KPHA+dGggZD0iTTEyMCAxNjBIMTAwVjE4MEgxMjBWMTYwWiIgZmlsbD0iIzlFOUU5RSIvPgo8cGF0aCBkPSJNMTQwIDE2MEgxMjBWMTgwSDE0MFYxNjBaIiBmaWxsPSIjOUU5RTlFIi8+CjxwYXRoIGQ9Ik0xNjAgMTYwSDE0MFYxODBIMTYwVjE2MFoiIGZpbGw9IiM5RTlFOUUiLz4KPHA+dGggZD0iTTE4MCAxNjBIMTYwVjE4MEgxODBWMTYwWiIgZmlsbD0iIzlFOUU5RSIvPgo8cGF0aCBkPSJNMjAwIDE2MEgxODBWMTgwSDIwMFYxNjBaIiBmaWxsPSIjOUU5RTlFIi8+CjxwYXRoIGQ9Ik0yMDAgMTgwSDE4MFYyMDBIMjAwVjE4MFoiIGZpbGw9IiM5RTlFOUUiLz4KPHA+dGggZD0iTTE4MCAyMDBIMTYwVjIyMEgxODBWMjAwWiIgZmlsbD0iIzlFOUU5RSIvPgo8cGF0aCBkPSJNMTYwIDIwMEgxNDBWMjIwSDE2MFYyMDBaIiBmaWxsPSIjOUU5RTlFIi8+CjxwYXRoIGQ9Ik0xNDAgMjAwSDEyMFYyMjBIMTQwVjIwMFoiIGZpbGw9IiM5RTlFOUUiLz4KPHA+dGggZD0iTTEyMCAyMDBIMTAwVjIyMEgxMjBWMjAwWiIgZmlsbD0iIzlFOUU5RSIvPgo8dGV4dCB4PSIxNTAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOUU5RTlFIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
              }}
            />
          </Box>

          {/* Book Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {book.title}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              by {book.author}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                {reviewCount > 0 ? averageRating.toFixed(1) : 'No rating'} ({reviewCount} reviews)
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {book.description}
          </Typography>
        </Box>


        <Divider sx={{ my: 3 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            startIcon={<RateReviewIcon />}
            size="large"
            sx={{ 
              flex: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => setIsReviewModalOpen(true)}
          >
            Write a Review
          </Button>
          <Button
            variant={isFavorite(book.id) ? "contained" : "outlined"}
            startIcon={isFavorite(book.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            size="large"
            disabled={favoritesLoading}
            onClick={() => toggleFavorite(book)}
            sx={{ 
              flex: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              transition: 'all 0.3s ease-in-out',
              backgroundColor: isFavorite(book.id) ? 'error.main' : 'transparent',
              borderColor: isFavorite(book.id) ? 'error.main' : 'primary.main',
              color: isFavorite(book.id) ? 'white' : 'primary.main',
              '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: isFavorite(book.id) ? 'error.dark' : 'primary.main',
                color: 'white',
                borderColor: isFavorite(book.id) ? 'error.dark' : 'primary.main',
                boxShadow: 3,
              },
              '&:disabled': {
                opacity: 0.6,
                transform: 'none',
              },
            }}
          >
            {isFavorite(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </Stack>
      </Paper>

      {/* Reviews Section */}
      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Reviews ({book.reviews?.length || 0})
        </Typography>

        {book.reviews && book.reviews.length > 0 ? (
          <Stack spacing={3}>
            {book.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <RateReviewIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Reviews Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              Be the first to share your thoughts about this book. Your review will help other readers discover great content.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RateReviewIcon />}
              size="large"
              onClick={() => setIsReviewModalOpen(true)}
            >
              Write the First Review
            </Button>
          </Box>
        )}
      </Paper>

      {/* Review Modal */}
      <ReviewModal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        bookId={id || ''}
        bookTitle={book?.title || ''}
        onReviewSubmitted={() => {
          refetch();
          setIsReviewModalOpen(false);
        }}
      />
    </Container>
  );
};

export default BookDetail;