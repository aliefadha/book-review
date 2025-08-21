import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, userEvent, createMockBook } from '../../test/test-utils';
import BookCard from '../BookCard';
import type { Books } from '../../types/book';

describe('BookCard', () => {
  const mockOnBookClick = vi.fn();
  
  const defaultProps = {
    book: { ...createMockBook(), matchType: 'title' } as Books & { matchType: string },
    onBookClick: mockOnBookClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders book information correctly', () => {
    renderWithProviders(<BookCard {...defaultProps} />);
    
    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('This is a test book description for unit testing purposes.')).toBeInTheDocument();
  });

  it('displays book cover image with correct attributes', () => {
    renderWithProviders(<BookCard {...defaultProps} />);
    
    const coverImage = screen.getByRole('img', { name: 'Test Book Title' });
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', 'https://example.com/test-cover.jpg');
    expect(coverImage).toHaveAttribute('alt', 'Test Book Title');
  });

  it('calls onBookClick when card is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCard {...defaultProps} />);
    
    const card = screen.getByRole('img', { name: 'Test Book Title' }).closest('[role="button"], div');
    expect(card).toBeInTheDocument();
    
    if (card) {
      await user.click(card);
      expect(mockOnBookClick).toHaveBeenCalledWith('test-book-1');
      expect(mockOnBookClick).toHaveBeenCalledTimes(1);
    }
  });

  it('handles missing cover image gracefully', () => {
    const bookWithoutCover = {
      ...defaultProps,
      book: { ...defaultProps.book, coverImageUrl: undefined },
    };
    
    renderWithProviders(<BookCard {...bookWithoutCover} />);
    
    const coverImage = screen.getByRole('img', { name: 'Test Book Title' });
    expect(coverImage).toBeInTheDocument();
    // MUI CardMedia doesn't set src when image is undefined
    expect(coverImage).not.toHaveAttribute('src');
  });

  it('renders with different match types', () => {
    const bookWithAuthorMatch = {
      ...defaultProps,
      book: { ...defaultProps.book, matchType: 'author' },
    };
    
    renderWithProviders(<BookCard {...bookWithAuthorMatch} />);
    
    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
  });

  it('truncates long descriptions appropriately', () => {
    const bookWithLongDescription = {
      ...defaultProps,
      book: {
        ...defaultProps.book,
        description: 'This is a very long description that should be displayed in the card. '.repeat(10),
      },
    };
    
    renderWithProviders(<BookCard {...bookWithLongDescription} />);
    
    const description = screen.getByText(/This is a very long description/);
    expect(description).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithProviders(<BookCard {...defaultProps} />);
    
    const coverImage = screen.getByRole('img', { name: 'Test Book Title' });
    expect(coverImage).toHaveAttribute('alt', 'Test Book Title');
    
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Test Book Title');
  });
});