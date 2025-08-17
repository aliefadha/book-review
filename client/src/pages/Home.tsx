import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Box,
  Skeleton,
  Alert,
  AlertTitle,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import ViewIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from '@tanstack/react-query';
import type { Books } from '../types/book';
import { fetchBooks } from '../services/bookService';

const Home: React.FC = () => {
  const { isPending, error, data, refetch } = useQuery<Books[]>({
    queryKey: ['booksData'],
    queryFn: fetchBooks,
  })

  const displayedBooks = data || [];

  // Loading skeleton component
  const BookSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 1, width: '60%' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '80%' }} />
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
      </CardActions>
    </Card>
  );

  if (isPending) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            <BookIcon sx={{ fontSize: 48, mr: 2, verticalAlign: 'middle' }} />
            Book Review Library
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Discover amazing books and share your thoughts with our community of readers
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <BookSkeleton key={index} />
          ))}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            <BookIcon sx={{ fontSize: 48, mr: 2, verticalAlign: 'middle' }} />
            Book Review Library
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Alert
            severity="error"
            sx={{ maxWidth: 600, width: '100%' }}
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => refetch()}
              >
                Retry
              </Button>
            }
          >
            <AlertTitle>Failed to load books</AlertTitle>
            {error.message || 'Something went wrong. Please try again.'}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          <BookIcon sx={{ fontSize: 48, mr: 2, verticalAlign: 'middle' }} />
          Book Review Library
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Discover amazing books and share your thoughts with our community of readers
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {displayedBooks.map((book: Books) => (
          <Card key={book.id}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={book.coverImageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
              alt={`${book.title} cover`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
              sx={{
                objectFit: 'cover',
                backgroundColor: 'grey.100'
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                {book.title}
              </Typography>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                by {book.author}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {book.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                component={RouterLink}
                to={`/book/${book.id}`}
                variant="contained"
                startIcon={<ViewIcon />}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
        </Box>
    </Container>
  );
};

export default Home;