import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import Home from '../Home';
import * as bookService from '../../services/bookService';
import type { Books } from '../../types/book';

// Mock the book service
vi.mock('../../services/bookService', () => ({
  fetchBooks: vi.fn(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockBooks: Books[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age.',
    coverImageUrl: 'https://example.com/gatsby.jpg',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence.',
    coverImageUrl: 'https://example.com/mockingbird.jpg',
  },
];

describe('Home Page', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Loading State', () => {
    it('displays loading skeletons while fetching books', async () => {
      // Mock pending state
      vi.mocked(bookService.fetchBooks).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithProviders(<Home />);

      // Check for loading skeletons
      expect(screen.getByText('Book Review Library')).toBeInTheDocument();
      expect(screen.getByText('Discover amazing books and share your thoughts with our community of readers')).toBeInTheDocument();
      
      // Should show skeleton cards (no test-id, just check for skeleton elements)
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Success State', () => {
    beforeEach(() => {
      vi.mocked(bookService.fetchBooks).mockResolvedValue(mockBooks);
    });

    it('renders the home page with book grid', async () => {
      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Book Review Library')).toBeInTheDocument();
      });

      expect(screen.getByText('Discover amazing books and share your thoughts with our community of readers')).toBeInTheDocument();
    });

    it('displays all books in the grid', async () => {
      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      });

      expect(screen.getByText('To Kill a Mockingbird')).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'by F. Scott Fitzgerald';
      })).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'by Harper Lee';
      })).toBeInTheDocument();
    });

    it('displays book covers with correct alt text', async () => {
      renderWithProviders(<Home />);

      await waitFor(() => {
        const gatsbyImage = screen.getByAltText('The Great Gatsby cover');
        expect(gatsbyImage).toBeInTheDocument();
        expect(gatsbyImage).toHaveAttribute('src', 'https://example.com/gatsby.jpg');
      });

      const mockingbirdImage = screen.getByAltText('To Kill a Mockingbird cover');
      expect(mockingbirdImage).toBeInTheDocument();
      expect(mockingbirdImage).toHaveAttribute('src', 'https://example.com/mockingbird.jpg');
    });

    it('shows view details links for each book', async () => {
      renderWithProviders(<Home />);

      await waitFor(() => {
        const viewLinks = screen.getAllByText('View Details');
        expect(viewLinks).toHaveLength(2);
      });

      // Check that links have proper accessibility
      const viewLinks = screen.getAllByText('View Details');
      viewLinks.forEach(link => {
        expect(link.closest('a')).toHaveAttribute('href');
      });
    });

    it('has correct href for book detail navigation', async () => {
      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      });

      const viewLinks = screen.getAllByRole('link', { name: /view details/i });
      expect(viewLinks[0]).toHaveAttribute('href', '/book/1');
      expect(viewLinks[1]).toHaveAttribute('href', '/book/2');
    });

    // Note: The current Home component doesn't have a search section
    // These tests would be added if/when that functionality is implemented
  });

  describe('Error State', () => {
    it('displays error message when book fetching fails', async () => {
      const errorMessage = 'Failed to fetch books';
      vi.mocked(bookService.fetchBooks).mockRejectedValue(new Error(errorMessage));

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load books')).toBeInTheDocument();
      });
    });

    it('shows retry button when there is an error', async () => {
      vi.mocked(bookService.fetchBooks).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      const retryButton = screen.getByText('Retry');
      expect(retryButton).toHaveAttribute('type', 'button');
    });

    it('refetches data when retry button is clicked', async () => {
      // First call fails
      vi.mocked(bookService.fetchBooks)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockBooks);

      renderWithProviders(<Home />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByText('Retry');
      await user.click(retryButton);

      // Should show success state after retry
      await waitFor(() => {
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      });

      expect(bookService.fetchBooks).toHaveBeenCalledTimes(2);
    });
  });

  describe('Empty State', () => {
    it('handles empty book list gracefully', async () => {
      vi.mocked(bookService.fetchBooks).mockResolvedValue([]);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Book Review Library')).toBeInTheDocument();
      });

      // Should not show any book cards
      expect(screen.queryByText('The Great Gatsby')).not.toBeInTheDocument();
      expect(screen.queryByText('To Kill a Mockingbird')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(bookService.fetchBooks).mockResolvedValue(mockBooks);
    });

    it('has proper heading structure', async () => {
      renderWithProviders(<Home />);

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toHaveTextContent('Book Review Library');
      });
    });

    it('has proper link roles and labels', async () => {
      renderWithProviders(<Home />);

      await waitFor(() => {
        const viewLinks = screen.getAllByRole('link', { name: /view details/i });
        expect(viewLinks).toHaveLength(2);
      });

      // Check that links have proper href attributes
      const viewLinks = screen.getAllByRole('link', { name: /view details/i });
      expect(viewLinks[0]).toHaveAttribute('href', '/book/1');
      expect(viewLinks[1]).toHaveAttribute('href', '/book/2');
    });
  });
});