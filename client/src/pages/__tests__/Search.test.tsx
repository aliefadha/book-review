import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Search from '../Search';
import * as searchService from '../../services/searchService';
import type { SearchResult } from '../../services/searchService';

// Mock the search service
vi.mock('../../services/searchService');
const mockSearchAll = vi.mocked(searchService.searchAll);

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock components
interface MockBook {
  id: string;
  title: string;
  author: string;
  description: string;
}

interface MockReview {
  id: string;
  reviewerName: string;
  text: string;
  rating: number;
  book: {
    title: string;
    author: string;
  };
}

vi.mock('../../components/BookCard', () => ({
  default: ({ book, onBookClick }: { book: MockBook; onBookClick: (id: string) => void }) => (
    <div data-testid={`book-card-${book.id}`} onClick={() => onBookClick(book.id)}>
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <p>{book.description}</p>
    </div>
  ),
}));

vi.mock('../../components/SearchReviewCard', () => ({
  default: ({ review }: { review: MockReview }) => (
    <div data-testid={`review-card-${review.id}`}>
      <h4>Review by {review.reviewerName}</h4>
      <p>{review.text}</p>
      <p>Rating: {review.rating}/5</p>
      <p>Book: {review.book.title} by {review.book.author}</p>
    </div>
  ),
}));

const mockSearchResult: SearchResult = {
  query: 'gatsby',
  totalResults: 3,
  books: [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic American novel',
      coverImageUrl: 'https://example.com/gatsby.jpg',
      matchType: 'title' as const,
    },
  ],
  reviews: [
    {
      id: 'r1',
      bookId: '1',
      reviewerName: 'John Doe',
      text: 'Amazing book about the American Dream',
      rating: 5,
      book: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      },
      matchType: 'text' as const,
    },
    {
      id: 'r2',
      bookId: '2',
      reviewerName: 'Jane Smith',
      text: 'Gatsby is a complex character',
      rating: 4,
      book: {
        title: 'Another Book',
        author: 'Another Author',
      },
      matchType: 'text' as const,
    },
  ],
};

const emptySearchResult: SearchResult = {
  query: 'nonexistent',
  totalResults: 0,
  books: [],
  reviews: [],
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Search Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders search page with title and input', () => {
      renderWithProviders(<Search />);
      
      expect(screen.getByText('Search Books & Reviews')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...')).toBeInTheDocument();
      expect(screen.getByText('Start searching to find books and reviews')).toBeInTheDocument();
    });

    it('renders empty state message initially', () => {
      renderWithProviders(<Search />);
      
      expect(screen.getByText('Start searching to find books and reviews')).toBeInTheDocument();
      expect(screen.getByText('Enter keywords to search through book titles, authors, descriptions, and review content.')).toBeInTheDocument();
    });
  });

  describe('Search Input', () => {
    it('updates input value when typing', () => {
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      fireEvent.change(searchInput, { target: { value: 'gatsby' } });
      
      expect(searchInput).toHaveValue('gatsby');
    });

    it('clears input when clear button is clicked', () => {
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      fireEvent.change(searchInput, { target: { value: 'gatsby' } });
      
      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);
      
      expect(searchInput).toHaveValue('');
    });

    it('shows clear button only when input has value', () => {
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      
      // Initially no clear button
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      
      // Type something
      fireEvent.change(searchInput, { target: { value: 'gatsby' } });
      
      // Clear button should appear
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Search Results', () => {
    it('displays search results when search is successful', async () => {
      mockSearchAll.mockResolvedValue(mockSearchResult);
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      fireEvent.change(searchInput, { target: { value: 'gatsby' } });
      
      await waitFor(() => {
        expect(screen.getByText('Search Results for "gatsby"')).toBeInTheDocument();
        expect(screen.getByText('Found 3 results')).toBeInTheDocument();
      }, { timeout: 15000 });
    });

    it('displays books in the books tab by default', async () => {
      mockSearchAll.mockResolvedValue(mockSearchResult);
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      fireEvent.change(searchInput, { target: { value: 'gatsby' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('book-card-1')).toBeInTheDocument();
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
        expect(screen.getByText('by F. Scott Fitzgerald')).toBeInTheDocument();
      }, { timeout: 15000 });
    });

    it('switches to reviews tab when clicked', async () => {
      mockSearchAll.mockResolvedValue(mockSearchResult);
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      fireEvent.change(searchInput, { target: { value: 'gatsby' } });
      
      await waitFor(() => {
        expect(screen.getByText('Books')).toBeInTheDocument();
      }, { timeout: 15000 });
      
      const reviewsTab = screen.getByText('Reviews');
      fireEvent.click(reviewsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('review-card-r1')).toBeInTheDocument();
        expect(screen.getByTestId('review-card-r2')).toBeInTheDocument();
        expect(screen.getByText('Review by John Doe')).toBeInTheDocument();
        expect(screen.getByText('Review by Jane Smith')).toBeInTheDocument();
      }, { timeout: 15000 });
    });

    it('navigates to book detail when book card is clicked', async () => {
      mockSearchAll.mockResolvedValue(mockSearchResult);
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      fireEvent.change(searchInput, { target: { value: 'gatsby' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('book-card-1')).toBeInTheDocument();
      }, { timeout: 15000 });
      
      const bookCard = screen.getByTestId('book-card-1');
      fireEvent.click(bookCard);
      
      expect(mockNavigate).toHaveBeenCalledWith('/book/1');
    });
  });

  describe('Empty Results', () => {
    it('displays no results message when search returns empty', async () => {
      mockSearchAll.mockResolvedValue(emptySearchResult);
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      
      await waitFor(() => {
        expect(screen.getByText('No results found for "nonexistent". Try different keywords or check your spelling.')).toBeInTheDocument();
      }, { timeout: 15000 });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when search fails', async () => {
      mockSearchAll.mockRejectedValue(new Error('Search failed'));
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      fireEvent.change(searchInput, { target: { value: 'gatsby' } });
      
      await waitFor(() => {
        expect(screen.getByText('An error occurred while searching. Please try again.')).toBeInTheDocument();
      }, { timeout: 15000 });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderWithProviders(<Search />);
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Search Books & Reviews');
    });

    it('has proper search input accessibility', () => {
      renderWithProviders(<Search />);
      
      const searchInput = screen.getByPlaceholderText('Search books, authors, reviews, or reviewers...');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toBeInTheDocument();
    });
  });
});