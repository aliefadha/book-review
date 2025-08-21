import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import HomeBookCard from '../HomeBookCard';
import type { Books } from '../../types/book';

const mockBook: Books = {
  id: '1',
  title: 'Test Book Title',
  author: 'Test Author',
  description: 'This is a test book description that should be displayed in the card.',
  coverImageUrl: 'https://example.com/test-cover.jpg'
};

const mockBookWithoutImage: Books = {
  ...mockBook,
  id: '2',
  coverImageUrl: undefined
};

describe('HomeBookCard', () => {
  it('should render book information correctly', () => {
    renderWithProviders(<HomeBookCard book={mockBook} />);
    
    expect(screen.getByTestId('book-card')).toBeInTheDocument();
    expect(screen.getByTestId('book-title')).toHaveTextContent('Test Book Title');
    expect(screen.getByTestId('book-author')).toHaveTextContent('by Test Author');
    expect(screen.getByText('This is a test book description that should be displayed in the card.')).toBeInTheDocument();
  });

  it('should display cover image with correct alt text', () => {
    renderWithProviders(<HomeBookCard book={mockBook} />);
    
    const coverImage = screen.getByAltText('Test Book Title cover');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', 'https://example.com/test-cover.jpg');
  });

  it('should display fallback image when coverImageUrl is null', () => {
    renderWithProviders(<HomeBookCard book={mockBookWithoutImage} />);
    
    const coverImage = screen.getByAltText('Test Book Title cover');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage.getAttribute('src')).toContain('data:image/svg+xml');
  });

  it('should handle image load error and show fallback', () => {
    renderWithProviders(<HomeBookCard book={mockBook} />);
    
    const coverImage = screen.getByAltText('Test Book Title cover');
    
    // Simulate image load error
    fireEvent.error(coverImage);
    
    expect(coverImage.getAttribute('src')).toContain('data:image/svg+xml');
  });

  it('should render View Details button with correct link', () => {
    renderWithProviders(<HomeBookCard book={mockBook} />);
    
    const viewDetailsButton = screen.getByRole('link', { name: /view details/i });
    expect(viewDetailsButton).toBeInTheDocument();
    expect(viewDetailsButton).toHaveAttribute('href', '/book/1');
  });

  it('should have proper accessibility attributes', () => {
    renderWithProviders(<HomeBookCard book={mockBook} />);
    
    const card = screen.getByTestId('book-card');
    const title = screen.getByTestId('book-title');
    const author = screen.getByTestId('book-author');
    const viewButton = screen.getByRole('link', { name: /view details/i });
    
    expect(card).toBeInTheDocument();
    expect(title).toHaveAttribute('data-testid', 'book-title');
    expect(author).toHaveAttribute('data-testid', 'book-author');
    expect(viewButton).toHaveAccessibleName();
  });

  it('should apply hover styles correctly', () => {
    renderWithProviders(<HomeBookCard book={mockBook} />);
    
    const card = screen.getByTestId('book-card');
    expect(card).toHaveStyle({
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    });
  });

  it('should handle long book titles and descriptions', () => {
    const longContentBook: Books = {
      ...mockBook,
      title: 'This is a very long book title that should be displayed properly even when it exceeds normal length expectations',
      description: 'This is a very long description that goes on and on and should be properly displayed in the card component without breaking the layout or causing any visual issues in the user interface.'
    };
    
    renderWithProviders(<HomeBookCard book={longContentBook} />);
    
    expect(screen.getByTestId('book-title')).toHaveTextContent(longContentBook.title);
    expect(screen.getByText(longContentBook.description)).toBeInTheDocument();
  });

  it('should handle special characters in book data', () => {
    const specialCharBook: Books = {
      ...mockBook,
      title: 'Book with "Quotes" & Special Characters',
      author: 'Author with Àccénts & Symbols',
      description: 'Description with <HTML> tags & special chars: @#$%^&*()'
    };
    
    renderWithProviders(<HomeBookCard book={specialCharBook} />);
    
    expect(screen.getByTestId('book-title')).toHaveTextContent('Book with "Quotes" & Special Characters');
    expect(screen.getByTestId('book-author')).toHaveTextContent('by Author with Àccénts & Symbols');
    expect(screen.getByText('Description with <HTML> tags & special chars: @#$%^&*()')).toBeInTheDocument();
  });

  it('should maintain proper component structure', () => {
    renderWithProviders(<HomeBookCard book={mockBook} />);
    
    // Check that all main sections are present
    const card = screen.getByTestId('book-card');
    const image = screen.getByAltText('Test Book Title cover');
    const title = screen.getByTestId('book-title');
    const author = screen.getByTestId('book-author');
    const button = screen.getByRole('link', { name: /view details/i });
    
    expect(card).toContainElement(image);
    expect(card).toContainElement(title);
    expect(card).toContainElement(author);
    expect(card).toContainElement(button);
  });
});