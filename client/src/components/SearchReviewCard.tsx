import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Rating,
  Typography,
} from '@mui/material';
import type { Review } from '../services/searchService';

interface SearchReviewCardProps {
  review: Review;
}

const SearchReviewCard: React.FC<SearchReviewCardProps> = ({ review }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/book/${review.bookId}`);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" component="h3">
                Review for "{review.book.title}"
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                by {review.book.author}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              {review.reviewerName}
            </Typography>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>({review.rating}/5)</Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {review.text}
          </Typography>

          {review.summary && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                AI Summary:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {review.summary}
              </Typography>
            </Box>
          )}

          {review.tags && review.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {review.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SearchReviewCard;