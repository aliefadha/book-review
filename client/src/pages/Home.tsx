import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Skeleton,
  Alert,
  AlertTitle,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from '@tanstack/react-query';
import type { Books } from '../types/book';
import { fetchBooks } from '../services/bookService';
import HomeBookCard from '../components/HomeBookCard';

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
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            mb: 2
          }}
        >
          <BookIcon sx={{ fontSize: { xs: 36, md: 48 }, mr: { xs: 1, md: 2 }, verticalAlign: 'middle' }} />
          Book Review Library
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.25rem' },
            px: { xs: 2, md: 0 }
          }}
        >
          Discover amazing books and share your thoughts with our community of readers
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: { xs: 2, md: 3 }
      }}>
        {displayedBooks.map((book: Books) => (
          <HomeBookCard key={book.id} book={book} />
        ))}
      </Box>
    </Container>
  );
};

export default Home;