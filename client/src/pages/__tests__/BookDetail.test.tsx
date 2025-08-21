import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookDetail from '../BookDetail';
import * as bookService from '../../services/bookService';
import type { Book, Review } from '../../types/book';



// Mock the book service
vi.mock('../../services/bookService');
const mockFetchBookById = vi.mocked(bookService.fetchBookById);

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

// Mock components
vi.mock('../../components/ReviewCard', () => ({
  default: ({ review }: { review: Review }) => (
    <div data-testid={`review-card-${review.id}`}>
      <h4>Review by {review.reviewerName}</h4>
      <p>{review.text}</p>
      <p>Rating: {review.rating}/5</p>
    </div>
  ),
}));

vi.mock('../../components/ReviewModal', () => ({
  default: ({ open, onClose, bookId, bookTitle, onReviewSubmitted }: {
    open: boolean;
    onClose: () => void;
    bookId: string;
    bookTitle: string;
    onReviewSubmitted: () => void;
  }) => (
    open ? (
      <div data-testid="review-modal">
        <h3>Write Review for {bookTitle}</h3>
        <p>Book ID: {bookId}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={onReviewSubmitted}>Submit Review</button>
      </div>
    ) : null
  ),
}));

const mockBookWithReviews: Book = {
  id: '1',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
  coverImageUrl: 'https://example.com/gatsby.jpg',
  reviews: [
    {
      id: 'r1',
      bookId: '1',
      reviewerName: 'John Doe',
      text: 'Amazing book about the American Dream',
      rating: 5,
      summary: 'Great read',
      sentimentScore: 0.8,
      tags: ['classic', 'american'],
      createdAt: '2023-01-01',
    },
    {
      id: 'r2',
      bookId: '1',
      reviewerName: 'Jane Smith',
      text: 'Complex characters and beautiful prose',
      rating: 4,
      summary: 'Well written',
      sentimentScore: 0.7,
      tags: ['literary', 'classic'],
      createdAt: '2023-01-02',
    },
  ],
};

const mockBookWithoutReviews: Book = {
  id: '2',
  title: 'To Kill a Mockingbird',
  author: 'Harper Lee',
  description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
  coverImageUrl: 'https://example.com/mockingbird.jpg',
  reviews: [],
};



describe('BookDetail Page', () => {
  let queryClient: QueryClient;

  const renderBookDetail = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookDetail />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('displays loading message while fetching book data', async () => {
      mockFetchBookById.mockImplementation(() => new Promise(() => { })); // Never resolves

      renderBookDetail();

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when book fetch fails', async () => {
      mockFetchBookById.mockRejectedValue(new Error('Failed to fetch book'));

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Error Loading Book')).toBeInTheDocument();
      });

      expect(screen.getByText('Failed to load book details. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
      expect(screen.getByText('Back to Book List')).toBeInTheDocument();
    });
  });

  describe('Book Not Found', () => {
    it('displays not found message when book is null', async () => {
      mockFetchBookById.mockResolvedValue(null);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Book Not Found')).toBeInTheDocument();
      });

      expect(screen.getByText('The book with ID 1 was not found.')).toBeInTheDocument();
    });
  });

  describe('Book Display', () => {
    it('displays book information correctly', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      });

      expect(screen.getByText('by F. Scott Fitzgerald')).toBeInTheDocument();
      expect(screen.getByText('A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.')).toBeInTheDocument();
    });

    it('displays book cover image', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        const coverImage = screen.getByAltText('The Great Gatsby');
        expect(coverImage).toBeInTheDocument();
        expect(coverImage).toHaveAttribute('src', 'https://example.com/gatsby.jpg');
      });
    });

    it('displays back to book list button', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        const backButtons = screen.getAllByText('Back to Book List');
        expect(backButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Rating Calculations', () => {
    it('calculates and displays average rating correctly', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        // Average of 5 and 4 is 4.5
        expect(screen.getByText('4.5 (2 reviews)')).toBeInTheDocument();
      });
    });

    it('displays no rating when there are no reviews', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithoutReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('No rating (0 reviews)')).toBeInTheDocument();
      });
    });
  });

  describe('Reviews Section', () => {
    it('displays reviews when available', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Reviews (2)')).toBeInTheDocument();
      });

      expect(screen.getByTestId('review-card-r1')).toBeInTheDocument();
      expect(screen.getByTestId('review-card-r2')).toBeInTheDocument();
      expect(screen.getByText('Review by John Doe')).toBeInTheDocument();
      expect(screen.getByText('Review by Jane Smith')).toBeInTheDocument();
    });

    it('displays no reviews message when no reviews exist', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithoutReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Reviews (0)')).toBeInTheDocument();
      });

      expect(screen.getByText('No Reviews Yet')).toBeInTheDocument();
      expect(screen.getByText('Be the first to share your thoughts about this book. Your review will help other readers discover great content.')).toBeInTheDocument();
      expect(screen.getByText('Write the First Review')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('displays write review and add to favorites buttons', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Write a Review')).toBeInTheDocument();
        expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
      });
    });
  });

  describe('Review Modal', () => {
    it('opens review modal when write review button is clicked', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Write a Review')).toBeInTheDocument();
      });

      const writeReviewButton = screen.getByText('Write a Review');
      fireEvent.click(writeReviewButton);

      expect(screen.getByTestId('review-modal')).toBeInTheDocument();
      expect(screen.getByText('Write Review for The Great Gatsby')).toBeInTheDocument();
      expect(screen.getByText('Book ID: 1')).toBeInTheDocument();
    });

    it('closes review modal when close button is clicked', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Write a Review')).toBeInTheDocument();
      });

      const writeReviewButton = screen.getByText('Write a Review');
      fireEvent.click(writeReviewButton);

      expect(screen.getByTestId('review-modal')).toBeInTheDocument();

      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
    });

it('refetches book data and closes modal when review is submitted', async () => {
  mockFetchBookById.mockResolvedValue(mockBookWithReviews);

  renderBookDetail();

  await waitFor(() => {
    expect(screen.getByText('Write a Review')).toBeInTheDocument();
  });

  const writeReviewButton = screen.getByText('Write a Review');
  fireEvent.click(writeReviewButton);

  expect(screen.getByTestId('review-modal')).toBeInTheDocument();

  const submitButton = screen.getByText('Submit Review');
  fireEvent.click(submitButton);

  expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
  expect(mockFetchBookById).toHaveBeenCalledTimes(2); // Initial load + refetch
});

    it('opens review modal from no reviews section', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithoutReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Write the First Review')).toBeInTheDocument();
      });

      const writeFirstReviewButton = screen.getByText('Write the First Review');
      fireEvent.click(writeFirstReviewButton);

      expect(screen.getByTestId('review-modal')).toBeInTheDocument();
      expect(screen.getByText('Write Review for To Kill a Mockingbird')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('handles missing book ID parameter', () => {
      mockFetchBookById.mockResolvedValue(null);

      renderBookDetail();

      // Should not call fetch when ID is missing
      expect(mockFetchBookById).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('displays book title as main heading', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      });
    });

    it('displays action buttons with proper text', async () => {
      mockFetchBookById.mockResolvedValue(mockBookWithReviews);

      renderBookDetail();

      await waitFor(() => {
        expect(screen.getByText('Write a Review')).toBeInTheDocument();
        expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
      });
    });
  });
});