import type { Review } from '../types/book';
import { apiEndpoints } from '../config/env';

export interface CreateReviewRequest {
  reviewerName: string;
  text: string;
  rating: number;
}

export interface CreateReviewResponse {
  success: boolean;
  review?: Review;
  message?: string;
}

export const submitReview = async (bookId: string, reviewData: CreateReviewRequest): Promise<CreateReviewResponse> => {
  try {
    const response = await fetch(`${apiEndpoints.books}/${bookId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to submit review' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      review: result,
      message: 'Review submitted successfully!'
    };
  } catch (error) {
    console.error('Error submitting review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit review. Please try again.'
    };
  }
};

// Note: Update and delete review endpoints are not implemented in the backend
// These functions are removed to align with available backend functionality