import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Rating,
  Avatar,
  Chip,
} from '@mui/material';
import type { Review } from '../types/book';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card variant="outlined" data-testid="review-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {review.reviewerName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {review.reviewerName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating value={review.rating} size="small" readOnly />
              <Typography variant="body2" color="text.secondary">
                {review.rating}/5
              </Typography>
              {review.createdAt && (
                <Typography variant="body2" color="text.secondary">
                  • {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {review.summary && (
          <Box sx={{
            mb: 2,
            p: 2,
            bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.light',
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                ✨ AI-Enhanced Summary
              </Typography>
              <Chip
                label="AI"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: '20px'
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                color: 'text.primary',
                lineHeight: 1.5
              }}
            >
              {review.summary}
            </Typography>
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {review.text}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {review.sentimentScore !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                🤖 AI Sentiment:
              </Typography>
              <Chip
                label={`${review.sentimentScore > 0.5 ? 'Positive' : review.sentimentScore < -0.5 ? 'Negative' : 'Neutral'} (${review.sentimentScore.toFixed(2)})`}
                size="small"
                color={review.sentimentScore > 0.5 ? 'success' : review.sentimentScore < -0.5 ? 'error' : 'default'}
                variant="outlined"
                sx={{
                  borderStyle: 'dashed',
                  '& .MuiChip-label': {
                    fontSize: '0.7rem'
                  }
                }}
              />
            </Box>
          )}
          {review.tags && review.tags.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                🏷️ AI Tags:
              </Typography>
              {review.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderStyle: 'dashed',
                    '& .MuiChip-label': {
                      fontSize: '0.7rem'
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;