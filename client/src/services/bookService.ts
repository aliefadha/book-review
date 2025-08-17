import type { Books, Book } from '../types/book';

const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    coverImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
    reviews: [],
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    coverImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
    reviews: [],
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel about totalitarian control and surveillance.',
    coverImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
    reviews: [],
  },
];


export const fetchBooks = async (): Promise<Books[]> => {
  try {
    const response = await fetch('http://localhost:3000/books');
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return await response.json();
  } catch {
    // Fallback to sample data when API is unavailable
    return sampleBooks;
  }
};

export const fetchBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await fetch(`http://localhost:3000/books/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }
    return await response.json();
  } catch {
    // Fallback to sample data when API is unavailable
    return sampleBooks.find(book => book.id === id) || null;
  }
};

export const searchBooks = async (query: string): Promise<Books[]> => {
  try {
    const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search books');
    }
    const result = await response.json();
    return result.books || [];
  } catch {
    // Fallback to sample data search when API is unavailable
    const lowercaseQuery = query.toLowerCase();
    return sampleBooks.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery)
    );
  }
};