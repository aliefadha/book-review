import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, userEvent, createMockBook } from '../../test/test-utils';
import SearchBar from '../SearchBar';
import type { Books } from '../../types/book';

// Mock the book service
vi.mock('../../services/bookService', () => ({
    searchBooks: vi.fn(),
}));

import { searchBooks } from '../../services/bookService';
const mockSearchBooks = vi.mocked(searchBooks);

describe('SearchBar', () => {
    const mockOnResults = vi.fn();

    const defaultProps = {
        onResults: mockOnResults,
        placeholder: 'Search books by title or author...',
        disabled: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockSearchBooks.mockClear();
    });

    it('renders with default placeholder', () => {
        renderWithProviders(<SearchBar {...defaultProps} />);

        expect(screen.getByPlaceholderText('Search books by title or author...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
        renderWithProviders(
            <SearchBar {...defaultProps} placeholder="Custom search placeholder" />
        );

        expect(screen.getByPlaceholderText('Custom search placeholder')).toBeInTheDocument();
    });

    it('handles text input correctly', async () => {
        const user = userEvent.setup();
        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, 'test query');

        expect(input).toHaveValue('test query');
    });

    it('triggers search when typing', async () => {
        const user = userEvent.setup();
        const mockBooks: Books[] = [createMockBook()];
        mockSearchBooks.mockResolvedValue(mockBooks);

        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, 'test');

        await waitFor(() => {
            expect(mockSearchBooks).toHaveBeenCalledWith('test');
        });
    });

    it('calls onResults with search results', async () => {
        const user = userEvent.setup();
        const mockBooks: Books[] = [createMockBook()];
        mockSearchBooks.mockResolvedValue(mockBooks);

        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, 'test');

        await waitFor(() => {
            expect(mockOnResults).toHaveBeenCalledWith(mockBooks, false, null);
        });
    });

    it('shows loading state during search', async () => {
        const user = userEvent.setup();
        let resolveSearch: (value: Books[]) => void;
        const searchPromise = new Promise<Books[]>((resolve) => {
            resolveSearch = resolve;
        });
        mockSearchBooks.mockReturnValue(searchPromise);

        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, 'test');

        // Should show loading spinner
        await waitFor(() => {
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        // Resolve the search
        resolveSearch!([createMockBook()]);

        // Loading should disappear
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    });

    it('clears search when clear button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, 'test query');

        expect(input).toHaveValue('test query');

        const clearButton = screen.getByRole('button', { name: /clear/i });
        await user.click(clearButton);

        expect(input).toHaveValue('');
        expect(mockOnResults).toHaveBeenCalledWith(null, false, null);
    });

    it('handles Enter key press', async () => {
        const user = userEvent.setup();
        const mockBooks: Books[] = [createMockBook()];
        mockSearchBooks.mockResolvedValue(mockBooks);

        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, 'test');
        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(mockSearchBooks).toHaveBeenCalledWith('test');
        });
    });

    it('disables input when disabled prop is true', () => {
        renderWithProviders(<SearchBar {...defaultProps} disabled={true} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        expect(input).toBeDisabled();

        const searchButton = screen.getByRole('button', { name: /search/i });
        expect(searchButton).toBeDisabled();
    });

    it('handles search errors gracefully', async () => {
        const user = userEvent.setup();
        const searchError = new Error('Search failed');
        mockSearchBooks.mockRejectedValue(searchError);

        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, 'test');

        await waitFor(() => {
            expect(mockOnResults).toHaveBeenCalledWith(null, false, searchError);
        });
    });

    it('does not search for empty queries', async () => {
        const user = userEvent.setup();
        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, '   ');

        // Should not call search for whitespace-only query
        expect(mockSearchBooks).not.toHaveBeenCalled();
        expect(mockOnResults).toHaveBeenCalledWith(null, false, null);
    });

    it('trims whitespace from search queries', async () => {
        const user = userEvent.setup();
        const mockBooks: Books[] = [createMockBook()];
        mockSearchBooks.mockResolvedValue(mockBooks);

        renderWithProviders(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, '  test query  ');

        await waitFor(() => {
            expect(mockSearchBooks).toHaveBeenCalledWith('test query');
        });
    });

    it('shows search icon when not loading', () => {
        renderWithProviders(<SearchBar {...defaultProps} />);

        expect(screen.getByText('SearchIcon')).toBeInTheDocument();
    });

    it('only shows clear button when there is text', async () => {
        const user = userEvent.setup();
        renderWithProviders(<SearchBar {...defaultProps} />);

        // Initially no clear button
        expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

        const input = screen.getByPlaceholderText('Search books by title or author...');
        await user.type(input, 'test');

        // Clear button should appear
        expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });
});