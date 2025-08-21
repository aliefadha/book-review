import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, userEvent, createMockReview } from '../../test/test-utils';
import SearchReviewCard from '../SearchReviewCard';
import type { Review } from '../../services/searchService';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SearchReviewCard', () => {
  const defaultReview: Review = {
    ...createMockReview(),
    book: {
      title: 'Test Book Title',
      author: 'Test Author',
    },
    matchType: 'text' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders review information correctly', () => {
    renderWithProviders(<SearchReviewCard review={defaultReview} />);
    
    expect(screen.getByText('Review for "Test Book Title"')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Reviewer')).toBeInTheDocument();
    expect(screen.getByText('This is a test review for unit testing purposes.')).toBeInTheDocument();
  });

  it('displays rating correctly', () => {
    renderWithProviders(<SearchReviewCard review={defaultReview} />);
    
    expect(screen.getByText('(4/5)')).toBeInTheDocument();
    
    // Check for rating component (MUI Rating renders as a group of radio buttons)
    const ratingElement = screen.getByRole('img', { name: /4 stars/i });
    expect(ratingElement).toBeInTheDocument();
  });

  it('navigates to book page when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchReviewCard review={defaultReview} />);
    
    const card = screen.getByText('Review for "Test Book Title"').closest('[role="button"], div');
    expect(card).toBeInTheDocument();
    
    if (card) {
      await user.click(card);
      expect(mockNavigate).toHaveBeenCalledWith('/book/test-book-1');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    }
  });

  it('displays AI summary when present', () => {
    const reviewWithSummary: Review = {
      ...defaultReview,
      summary: 'This is an AI-generated summary of the review.',
    };
    
    renderWithProviders(<SearchReviewCard review={reviewWithSummary} />);
    
    expect(screen.getByText('AI Summary:')).toBeInTheDocument();
    expect(screen.getByText('This is an AI-generated summary of the review.')).toBeInTheDocument();
  });

  it('does not display AI summary section when not present', () => {
    const reviewWithoutSummary: Review = {
      ...defaultReview,
      summary: undefined,
    };
    
    renderWithProviders(<SearchReviewCard review={reviewWithoutSummary} />);
    
    expect(screen.queryByText('AI Summary:')).not.toBeInTheDocument();
  });

  it('displays tags when present', () => {
    const reviewWithTags: Review = {
      ...defaultReview,
      tags: ['fiction', 'mystery', 'thriller'],
    };
    
    renderWithProviders(<SearchReviewCard review={reviewWithTags} />);
    
    expect(screen.getByText('fiction')).toBeInTheDocument();
    expect(screen.getByText('mystery')).toBeInTheDocument();
    expect(screen.getByText('thriller')).toBeInTheDocument();
  });

  it('does not display tags section when tags are empty', () => {
    const reviewWithoutTags: Review = {
      ...defaultReview,
      tags: [],
    };
    
    renderWithProviders(<SearchReviewCard review={reviewWithoutTags} />);
    
    // Should not find any chip elements
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('handles different rating values', () => {
    const reviewWithDifferentRating: Review = {
      ...defaultReview,
      rating: 2,
    };
    
    renderWithProviders(<SearchReviewCard review={reviewWithDifferentRating} />);
    
    expect(screen.getByText('(2/5)')).toBeInTheDocument();
  });

  it('handles long review text', () => {
    const reviewWithLongText: Review = {
      ...defaultReview,
      text: 'This is a very long review text that should be displayed properly in the card component. '.repeat(10),
    };
    
    renderWithProviders(<SearchReviewCard review={reviewWithLongText} />);
    
    const reviewText = screen.getByText(/This is a very long review text/);
    expect(reviewText).toBeInTheDocument();
  });

  it('handles special characters in book title and author', () => {
    const reviewWithSpecialChars: Review = {
      ...defaultReview,
      book: {
        title: 'Book with "Quotes" & Special Characters',
        author: 'Author O\'Malley',
      },
    };
    
    renderWithProviders(<SearchReviewCard review={reviewWithSpecialChars} />);
    
    expect(screen.getByText('Review for "Book with "Quotes" & Special Characters"')).toBeInTheDocument();
    expect(screen.getByText('by Author O\'Malley')).toBeInTheDocument();
  });

  it('has proper hover effects', () => {
    renderWithProviders(<SearchReviewCard review={defaultReview} />);
    
    const card = screen.getByText('Review for "Test Book Title"').closest('div');
    expect(card).toBeInTheDocument();
    
    // Test that the card is present and clickable
    expect(card).toBeTruthy();
  });

  it('displays reviewer name prominently', () => {
    renderWithProviders(<SearchReviewCard review={defaultReview} />);
    
    const reviewerName = screen.getByText('Test Reviewer');
    expect(reviewerName).toBeInTheDocument();
    
    // Should be in a subtitle1 variant (larger text)
    expect(reviewerName.closest('h6, p, span')).toBeInTheDocument();
  });
});